<?php

use App\Models\User;

test('the user notifications page has been removed', function () {
    $this->actingAs(User::factory()->create())
        ->get('/notifications')
        ->assertNotFound();
});

test('the notification read endpoints have been removed', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/notifications/1/read', [], ['Accept' => 'application/json'])
        ->assertNotFound();

    $this->actingAs($user)
        ->post('/notifications/read-all', [], ['Accept' => 'application/json'])
        ->assertNotFound();
});
