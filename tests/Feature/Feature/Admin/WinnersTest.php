<?php

use App\Models\AppNotification;
use App\Models\AppSetting;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Winner;
use App\Notifications\WinnerAnnounced;
use Illuminate\Support\Facades\Notification;

it('forbids non-admin users from announcing winners', function () {
    AppSetting::factory()->create();

    $user = User::factory()->create(['is_admin' => false]);
    $ticket = Ticket::factory()->create([
        'ticketNumber' => 123,
        'userId' => $user->id,
        'cycle' => 1,
    ]);

    $this->actingAs($user)
        ->postJson('/admin/winners/announce', [
            'ticketNumber' => $ticket->ticketNumber,
            'place' => 1,
        ])
        ->assertForbidden();
});

it('announces a winner and notifies the user (in-app + email)', function () {
    Notification::fake();
    $settings = AppSetting::factory()->create(['cycle' => 7, 'prize_name' => 'Toyota Vitz']);

    $admin = User::factory()->create(['is_admin' => true]);
    $winnerUser = User::factory()->create(['is_admin' => false]);

    $ticket = Ticket::factory()->create([
        'ticketNumber' => 4512,
        'userId' => $winnerUser->id,
        'cycle' => 7,
    ]);

    $this->actingAs($admin)
        ->postJson('/admin/winners/announce', [
            'ticketNumber' => $ticket->ticketNumber,
            'place' => 2,
        ])
        ->assertSuccessful();

    $winner = Winner::query()->where('cycle', 7)->where('place', 2)->first();
    expect($winner)->not->toBeNull();
    expect($winner->user_id)->toBe($winnerUser->id);
    expect($winner->ticket_id)->toBe($ticket->id);
    expect($winner->prize_amount)->toBe(100_000);

    $notification = AppNotification::query()->where('target_user_id', $winnerUser->id)->latest('id')->first();
    expect($notification)->not->toBeNull();

    Notification::assertSentTo($winnerUser, WinnerAnnounced::class);

    $settings->refresh();
    expect($settings->winner_announcement_mode)->toBeFalse();
});
