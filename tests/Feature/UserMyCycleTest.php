<?php

use App\Models\User;

test('guests are redirected to the login page for mycycle', function () {
    $response = $this->get(route('user.mycycle'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can visit mycycle', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('user.mycycle'));

    $response->assertOk();
});
