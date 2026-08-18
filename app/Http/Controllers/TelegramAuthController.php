<?php

namespace App\Http\Controllers;

use App\Actions\Telegram\ValidateTelegramWebAppData;
use App\Models\AppSetting;
use App\Models\RecentActivity;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TelegramAuthController extends Controller
{
    public function __construct(
        private readonly ValidateTelegramWebAppData $validator,
    ) {}

    /**
     * Authenticate (or register) a user using the Telegram Mini App payload.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'init_data' => ['required', 'string'],
        ]);

        $payload = $this->validator->validate($validated['init_data']);

        $userData = $this->resolveUserData($payload);

        $telegramId = (int) ($userData['id'] ?? 0);

        if ($telegramId <= 0) {
            throw $this->authenticationFailed();
        }

        $name = trim(($userData['first_name'] ?? '').' '.($userData['last_name'] ?? ''));

        $user = User::firstOrNew(['telegram_id' => $telegramId]);

        $isNewUser = ! $user->exists;

        if ($isNewUser && ! $this->registrationIsEnabled()) {
            throw ValidationException::withMessages([
                'init_data' => 'Registration is currently closed. Please check back soon.',
            ]);
        }

        if ($isNewUser) {
            $user->fill([
                'name' => $name !== '' ? $name : 'Telegram User',
                'email' => $this->generateUniqueEmail(),
                'password' => Str::password(32),
                'email_verified_at' => now(),
                'is_admin' => $this->isAdminTelegramId($telegramId),
            ]);
        } elseif (! $user->email_verified_at) {
            $user->email_verified_at = now();
        }

        $user->fill([
            'name' => $name !== '' ? $name : $user->name,
            'telegram_username' => $userData['username'] ?? $user->telegram_username,
            'telegram_photo_url' => $userData['photo_url'] ?? $user->telegram_photo_url,
            'language_code' => $userData['language_code'] ?? $user->language_code,
            'last_seen_at' => now(),
        ]);

        $user->is_admin = $user->is_admin || $this->isAdminTelegramId($telegramId);

        $user->save();

        if ($isNewUser) {
            RecentActivity::query()->create([
                'userId' => $user->id,
                'type' => 'JOINED',
                'status' => 'success',
                'title_en' => 'Account created',
                'title_am' => null,
                'description_en' => 'Welcome! Your membership is active.',
                'description_am' => null,
                'link' => null,
                'cycle' => null,
                'meta' => null,
                'occurred_at' => now(),
            ]);
        }

        Auth::login($user, remember: true);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Attach the phone number the user shared through the native Telegram
     * contact dialog (validated the same way as the auth payload).
     */
    public function storePhone(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'init_data' => ['required', 'string'],
        ]);

        $payload = $this->validator->validateContact($validated['init_data']);

        $contactData = $payload !== null && isset($payload['contact'])
            ? json_decode((string) $payload['contact'], true)
            : null;

        if (! is_array($contactData)) {
            throw $this->authenticationFailed();
        }

        $contactUserId = (int) ($contactData['user_id'] ?? 0);
        $phoneNumber = $this->normalizePhone((string) ($contactData['phone_number'] ?? ''));

        if ($contactUserId <= 0 || $phoneNumber === '') {
            throw $this->authenticationFailed();
        }

        /** @var User $user */
        $user = $request->user();

        if ($contactUserId !== (int) $user->telegram_id) {
            throw $this->authenticationFailed();
        }

        $inUse = User::query()
            ->where('phoneNumber', $phoneNumber)
            ->whereKeyNot($user->getKey())
            ->exists();

        if ($inUse) {
            throw ValidationException::withMessages([
                'phone' => 'This phone number is already linked to another account.',
            ]);
        }

        $user->phoneNumber = $phoneNumber;
        $user->save();

        return redirect()->back()->with('status', 'Phone number saved.');
    }

    /**
     * Normalize a shared phone number to its international form (e.g.
     * +251912345678), dropping whitespace and separators.
     */
    private function normalizePhone(string $phone): string
    {
        $normalized = preg_replace('/[\s\-()]+/', '', $phone);

        return is_string($normalized) ? $normalized : '';
    }

    /**
     * @return array<string, mixed>|null
     */
    private function resolveUserData(?array $payload): ?array
    {
        if ($payload === null || ! isset($payload['user'])) {
            return null;
        }

        $userData = json_decode((string) $payload['user'], true);

        if (! is_array($userData)) {
            return null;
        }

        return $userData;
    }

    private function isAdminTelegramId(int $telegramId): bool
    {
        return in_array((string) $telegramId, config('telegram.admin_ids'), true);
    }

    private function registrationIsEnabled(): bool
    {
        return AppSetting::query()->first()?->registration_enabled ?? true;
    }

    private function generateUniqueEmail(): string
    {
        do {
            $email = sprintf('telegram_%s@placeholder.local', Str::lower(Str::random(32)));
        } while (User::query()->where('email', $email)->exists());

        return $email;
    }

    private function authenticationFailed(): ValidationException
    {
        return ValidationException::withMessages([
            'init_data' => 'Telegram authentication failed. Please open the app from Telegram.',
        ]);
    }
}
