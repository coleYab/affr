<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are sent to the login page', function () {
    $this->get(route('phone.verify'))->assertRedirect(route('login'));
});

test('authenticated users can view the phone verification page', function () {
    $user = User::factory()->create(['phoneNumber' => null]);

    $this->actingAs($user)
        ->get(route('phone.verify'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('phone-verify'));
});

test('the phone verification page is skipped for users with a phone number', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('phone.verify'))->assertOk();
});

test('users without a phone number are gated from the app routes', function () {
    $user = User::factory()->create(['phoneNumber' => null]);

    $this->actingAs($user)->get(route('user.mytickets'))->assertRedirect(route('phone.verify'));
    $this->actingAs($user)->get(route('mypayments'))->assertRedirect(route('phone.verify'));
    $this->actingAs($user)->get(route('profile.edit'))->assertRedirect(route('phone.verify'));
});

test('admins without a phone number are gated from admin routes', function () {
    $user = User::factory()->create([
        'phoneNumber' => null,
        'is_admin' => true,
    ]);

    $this->actingAs($user)->get(route('admin.dashboard'))->assertRedirect(route('phone.verify'));
});

test('a user can verify their phone number manually', function () {
    $user = User::factory()->create(['phoneNumber' => null]);

    $this->actingAs($user)
        ->post(route('phone.verify.store'), [
            'phoneNumber' => '+251 911-234-567',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('dashboard'));

    expect($user->fresh()->phoneNumber)->toBe('+251911234567');
});

test('a phone number already in use is rejected', function () {
    User::factory()->create(['phoneNumber' => '+251911000000']);

    $user = User::factory()->create(['phoneNumber' => null]);

    $this->actingAs($user)
        ->post(route('phone.verify.store'), [
            'phoneNumber' => '+251911000000',
        ])
        ->assertSessionHasErrors('phoneNumber');

    expect($user->fresh()->phoneNumber)->toBeNull();
});

test('an empty phone number is rejected', function () {
    $user = User::factory()->create(['phoneNumber' => null]);

    $this->actingAs($user)
        ->post(route('phone.verify.store'), [
            'phoneNumber' => '   ',
        ])
        ->assertSessionHasErrors('phoneNumber');

    expect($user->fresh()->phoneNumber)->toBeNull();
});
