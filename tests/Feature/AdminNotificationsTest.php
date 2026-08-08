<?php

use App\Models\AppNotification;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin notifications page is displayed', function () {
    $user = User::factory()->create(['is_admin' => true]);

    AppNotification::factory()->create([
        'title_en' => 'Test Notification',
        'message_en' => 'Test body',
        'is_urgent' => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('admin.notifications'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/notifications')
            ->has('notifications')
        );
});

test('admin can create a notification broadcast', function () {
    $user = User::factory()->create(['is_admin' => true]);

    $response = $this
        ->actingAs($user)
        ->post(route('admin.notifications.store'), [
            'title_en' => 'System Maintenance',
            'title_am' => 'የስርዓት ጥገና',
            'message_en' => 'We will be down tonight.',
            'message_am' => 'ዛሬ ማታ እንዲቆም ይችላል።',
            'link' => 'https://example.com/status',
            'is_urgent' => true,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertSessionHas('status', 'Notification broadcast created.')
        ->assertRedirect(route('admin.notifications'));

    $this->assertDatabaseHas('app_notifications', [
        'title_en' => 'System Maintenance',
        'is_urgent' => true,
    ]);
});

test('notification broadcast validation works', function () {
    $user = User::factory()->create(['is_admin' => true]);

    $response = $this
        ->actingAs($user)
        ->post(route('admin.notifications.store'), [
            'title_en' => '',
            'message_en' => '',
            'is_urgent' => 'not-bool',
        ]);

    $response->assertSessionHasErrors(['title_en', 'message_en', 'is_urgent']);
});

test('non-admin authenticated users cannot access admin notifications', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('admin.notifications'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('admin.notifications.store'), [
            'title_en' => 'Test',
            'message_en' => 'Test',
            'is_urgent' => false,
        ])
        ->assertForbidden();
});

test('guests cannot access admin notifications', function () {
    $this->get(route('admin.notifications'))->assertRedirect(route('login'));
    $this->post(route('admin.notifications.store'))->assertRedirect(route('login'));
});
