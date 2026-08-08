<?php

use App\Models\AppNotification;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('user notifications page is displayed with system notifications', function () {
    $user = User::factory()->create();

    $notification = AppNotification::factory()->create([
        'title_en' => 'System Maintenance',
        'title_am' => 'የስርዓት ጥገና',
        'message_en' => 'We will be down tonight.',
        'message_am' => 'ዛሬ ማታ እንዲቆም ይችላል።',
        'is_urgent' => true,
        'sent_at' => now(),
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('user.mynotifications'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('notifications')
            ->has('notifications', 1)
            ->where('notifications.0.id', $notification->id)
            ->where('notifications.0.title.en', 'System Maintenance')
            ->where('notifications.0.desc.en', 'We will be down tonight.')
            ->where('notifications.0.urgent', true)
        );
});

test('guests cannot access notifications', function () {
    $this->get(route('user.mynotifications'))->assertRedirect(route('login'));
});

test('user can mark a notification as read and it stays read on reload', function () {
    $user = User::factory()->create();

    $notification = AppNotification::factory()->create([
        'title_en' => 'System Maintenance',
        'message_en' => 'We will be down tonight.',
        'is_urgent' => true,
        'sent_at' => now(),
    ]);

    $this
        ->actingAs($user)
        ->post(route('user.notifications.read', ['notification' => $notification->id]), [], ['Accept' => 'application/json'])
        ->assertOk();

    $this->assertDatabaseHas('app_notification_reads', [
        'user_id' => $user->id,
        'app_notification_id' => $notification->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('user.mynotifications'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('notifications')
            ->has('notifications', 1)
            ->where('notifications.0.id', $notification->id)
            ->where('notifications.0.read', true)
        );
});

test('user can mark all notifications as read', function () {
    $user = User::factory()->create();

    $n1 = AppNotification::factory()->create(['sent_at' => now()]);
    $n2 = AppNotification::factory()->create(['sent_at' => now()]);

    $this
        ->actingAs($user)
        ->post(route('user.notifications.read-all'), [], ['Accept' => 'application/json'])
        ->assertOk();

    $this->assertDatabaseHas('app_notification_reads', [
        'user_id' => $user->id,
        'app_notification_id' => $n1->id,
    ]);

    $this->assertDatabaseHas('app_notification_reads', [
        'user_id' => $user->id,
        'app_notification_id' => $n2->id,
    ]);
});
