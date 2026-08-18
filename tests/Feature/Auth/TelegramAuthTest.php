<?php

use App\Models\AppSetting;
use App\Models\RecentActivity;
use App\Models\User;
use Illuminate\Support\Carbon;

function telegram_init_data(array $user, ?int $authDate = null, ?string $botToken = null): string
{
    $botToken ??= (string) config('telegram.bot_token');

    $payload = [
        'auth_date' => (string) ($authDate ?? now()->timestamp),
        'query_id' => 'AAHdF6IQAAAAAN0XophC1upo7Jw',
        'user' => json_encode($user, JSON_THROW_ON_ERROR),
    ];

    $dataCheckString = collect($payload)
        ->sortKeys()
        ->map(fn (string $value, string $key) => "{$key}={$value}")
        ->values()
        ->implode("\n");

    $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
    $hash = bin2hex(hash_hmac('sha256', $dataCheckString, $secretKey, true));

    return http_build_query([...$payload, 'hash' => $hash]);
}

$telegramUser = [
    'id' => 279058397,
    'first_name' => 'Artyom',
    'last_name' => 'Bagdasarov',
    'username' => 'artyom',
    'language_code' => 'en',
    'photo_url' => 'https://t.me/i/userpic/320/abc123.jpg',
];

function telegram_contact_data(
    int $userId,
    string $phoneNumber = '+251912345678',
    ?int $authDate = null,
    ?string $botToken = null,
): string {
    $botToken ??= (string) config('telegram.bot_token');

    $payload = [
        'auth_date' => (string) ($authDate ?? now()->timestamp),
        'contact' => json_encode([
            'user_id' => $userId,
            'phone_number' => $phoneNumber,
            'first_name' => 'Artyom',
        ], JSON_THROW_ON_ERROR),
    ];

    $dataCheckString = collect($payload)
        ->sortKeys()
        ->map(fn (string $value, string $key) => "{$key}={$value}")
        ->values()
        ->implode("\n");

    $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
    $hash = bin2hex(hash_hmac('sha256', $dataCheckString, $secretKey, true));

    return http_build_query([...$payload, 'hash' => $hash]);
}

test('a guest is registered and authenticated with valid telegram initData', function () use ($telegramUser) {
    $response = $this->post(route('telegram.auth'), [
        'init_data' => telegram_init_data($telegramUser),
    ]);

    $response->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();

    $user = User::query()->firstOrFail();

    expect($user)
        ->telegram_id->toBe($telegramUser['id'])
        ->name->toBe('Artyom Bagdasarov')
        ->telegram_username->toBe('artyom')
        ->language_code->toBe('en')
        ->telegram_photo_url->toBe($telegramUser['photo_url'])
        ->email_verified_at->not->toBeNull()
        ->is_admin->toBeFalse();

    $this->assertDatabaseHas('recent_activities', [
        'userId' => $user->id,
        'type' => 'JOINED',
    ]);

    $this->assertSame(1, RecentActivity::query()->count());
});

test('an existing telegram user is logged in without creating a duplicate', function () use ($telegramUser) {
    $existing = User::factory()->create([
        'name' => 'Old Name',
        'telegram_id' => $telegramUser['id'],
        'email_verified_at' => now(),
    ]);

    $response = $this->post(route('telegram.auth'), [
        'init_data' => telegram_init_data($telegramUser),
    ]);

    $response->assertRedirect(route('dashboard'));

    expect(User::query()->count())->toBe(1)
        ->and(auth()->id())->toBe($existing->id);

    $existing->refresh();

    expect($existing)
        ->name->toBe('Artyom Bagdasarov')
        ->telegram_username->toBe('artyom')
        ->last_seen_at->not->toBeNull();

    $this->assertDatabaseCount('recent_activities', 0);
});

test('telegram users are marked as admins when their id is configured', function () use ($telegramUser) {
    $telegramUser['id'] = 777000;

    $this->post(route('telegram.auth'), [
        'init_data' => telegram_init_data($telegramUser),
    ]);

    $user = User::query()->firstOrFail();

    expect($user->is_admin)->toBeTrue();
});

test('telegram auth is rejected when the payload is tampered after signing', function () use ($telegramUser) {
    $valid = telegram_init_data($telegramUser);

    $tamperedUser = urlencode(json_encode([
        ...$telegramUser,
        'first_name' => 'Hacker',
    ], JSON_THROW_ON_ERROR));

    $tampered = preg_replace('/user=[^&]*/', "user={$tamperedUser}", $valid);

    $response = $this->post(route('telegram.auth'), [
        'init_data' => $tampered,
    ]);

    $response->assertSessionHasErrors('init_data');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('telegram auth is rejected when auth_date is too old', function () use ($telegramUser) {
    $staleAuthDate = now()->subDays(2)->timestamp;

    $response = $this->post(route('telegram.auth'), [
        'init_data' => telegram_init_data($telegramUser, $staleAuthDate),
    ]);

    $response->assertSessionHasErrors('init_data');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('telegram auth is rejected when signed with a different bot token', function () use ($telegramUser) {
    $initData = telegram_init_data($telegramUser, botToken: '999999:attacker-token');

    $response = $this->post(route('telegram.auth'), [
        'init_data' => $initData,
    ]);

    $response->assertSessionHasErrors('init_data');

    $this->assertGuest();
});

test('telegram auth requires an init_data payload', function () {
    $this->post(route('telegram.auth'), [])
        ->assertSessionHasErrors('init_data');
});

test('telegram auth works with a payload signed at the age limit', function () use ($telegramUser) {
    config(['telegram.auth_max_age' => 86400]);

    $authDate = Carbon::now()->subSeconds(86400)->timestamp;

    $response = $this->post(route('telegram.auth'), [
        'init_data' => telegram_init_data($telegramUser, $authDate),
    ]);

    $response->assertSessionHasNoErrors()->assertRedirect(route('dashboard'));
});

test('new registrations are rejected when registration is disabled', function () use ($telegramUser) {
    AppSetting::query()->create([
        'draw_date' => now()->addDays(14)->toDateString(),
        'registration_enabled' => false,
    ]);

    $this->post(route('telegram.auth'), [
        'init_data' => telegram_init_data($telegramUser),
    ])->assertSessionHasErrors('init_data');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('existing telegram users can still log in when registration is disabled', function () use ($telegramUser) {
    User::factory()->create(['telegram_id' => $telegramUser['id']]);

    AppSetting::query()->create([
        'draw_date' => now()->addDays(14)->toDateString(),
        'registration_enabled' => false,
    ]);

    $this->post(route('telegram.auth'), [
        'init_data' => telegram_init_data($telegramUser),
    ])->assertSessionHasNoErrors()->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
});

test('telegram auth works without a valid csrf token (telegram webview)', function () use ($telegramUser) {
    $response = $this
        ->withHeader('X-XSRF-TOKEN', 'bogus-token')
        ->withCookie('XSRF-TOKEN', 'bogus-token')
        ->post(route('telegram.auth'), [
            'init_data' => telegram_init_data($telegramUser),
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
});

test('csrf mismatches on other routes redirect back with a friendly message', function () {
    $response = app(\Illuminate\Foundation\Exceptions\Handler::class)->render(
        \Illuminate\Http\Request::create('/payments', 'POST'),
        new \Illuminate\Session\TokenMismatchException,
    );

    expect($response->getStatusCode())->toBe(302)
        ->and(session('status'))->toBe('The page expired, please try again.');
});

test('an authenticated telegram user can attach a shared phone number', function () use ($telegramUser) {
    $user = User::factory()->create(['telegram_id' => $telegramUser['id']]);

    $this->actingAs($user)
        ->post(route('telegram.phone'), [
            'init_data' => telegram_contact_data($telegramUser['id']),
        ])
        ->assertSessionHasNoErrors()
        ->assertSessionHas('status', 'Phone number saved.');

    expect($user->fresh()->phoneNumber)->toBe('+251912345678');
});

test('the phone number cannot be attached when it belongs to another account', function () use ($telegramUser) {
    User::factory()->create([
        'phoneNumber' => '+251911000000',
    ]);

    $user = User::factory()->create([
        'telegram_id' => $telegramUser['id'],
        'phoneNumber' => null,
    ]);

    $this->actingAs($user)
        ->post(route('telegram.phone'), [
            'init_data' => telegram_contact_data($telegramUser['id'], '+251911000000'),
        ])
        ->assertSessionHasErrors('phone');

    expect($user->fresh()->phoneNumber)->toBeNull();
});

test('the contact payload must belong to the authenticated user', function () use ($telegramUser) {
    $user = User::factory()->create([
        'telegram_id' => $telegramUser['id'],
        'phoneNumber' => null,
    ]);

    $this->actingAs($user)
        ->post(route('telegram.phone'), [
            'init_data' => telegram_contact_data(999999999),
        ])
        ->assertSessionHasErrors('init_data');

    expect($user->fresh()->phoneNumber)->toBeNull();
});

test('the phone number is rejected when the contact payload is not signed by the bot', function () use ($telegramUser) {
    $user = User::factory()->create([
        'telegram_id' => $telegramUser['id'],
        'phoneNumber' => null,
    ]);

    $this->actingAs($user)
        ->post(route('telegram.phone'), [
            'init_data' => telegram_contact_data($telegramUser['id'], botToken: '999999:attacker-token'),
        ])
        ->assertSessionHasErrors('init_data');

    expect($user->fresh()->phoneNumber)->toBeNull();
});

test('guests cannot attach a phone number', function () use ($telegramUser) {
    $this->post(route('telegram.phone'), [
        'init_data' => telegram_contact_data($telegramUser['id']),
    ])->assertRedirect(route('login'));
});

test('phone sharing works without a valid csrf token (telegram webview)', function () use ($telegramUser) {
    $user = User::factory()->create(['telegram_id' => $telegramUser['id']]);

    $this
        ->actingAs($user)
        ->withHeader('X-XSRF-TOKEN', 'bogus-token')
        ->withCookie('XSRF-TOKEN', 'bogus-token')
        ->post(route('telegram.phone'), [
            'init_data' => telegram_contact_data($telegramUser['id']),
        ])
        ->assertSessionHas('status', 'Phone number saved.');

    expect($user->fresh()->phoneNumber)->toBe('+251912345678');
});

test('authenticated users are redirected away from the telegram auth endpoint', function () use ($telegramUser) {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('telegram.auth'), [
            'init_data' => telegram_init_data($telegramUser),
        ])
        ->assertRedirect(route('dashboard'));
});
