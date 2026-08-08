<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('admin can create user with phone number as password', function () {
    // Create an admin user
    $admin = User::factory()->create(['is_admin' => true]);

    $userData = [
        'name' => 'John Doe',
        'phone' => '251911234567',
        'status' => 'PENDING',
        'joinedDate' => '2024-01-15',
        'ticketNumbers' => [],
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), $userData);

    $response->assertRedirect();

    $user = User::where('phoneNumber', '251911234567')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('John Doe');

    // Verify the password is the phone number (hashed)
    expect(Hash::check('251911234567', $user->password))->toBeTrue();
});

test('admin can create verified user with phone number as password', function () {
    // Create an admin user
    $admin = User::factory()->create(['is_admin' => true]);

    $userData = [
        'name' => 'Jane Smith',
        'phone' => '251922345678',
        'status' => 'VERIFIED',
        'joinedDate' => '2024-01-15',
        'ticketNumbers' => [],
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), $userData);

    $response->assertRedirect();

    $user = User::where('phoneNumber', '251922345678')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Jane Smith');
    expect($user->email_verified_at)->not->toBeNull();

    // Verify the password is the phone number (hashed)
    expect(Hash::check('251922345678', $user->password))->toBeTrue();
});
