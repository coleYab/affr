<?php

use App\Models\Ticket;
use App\Models\User;

test('admin can add available tickets to an existing user', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $tickets = Ticket::factory()->count(3)->create();
    $ticketNumbers = $tickets->pluck('ticketNumber')->values()->all();

    $response = $this->actingAs($admin)
        ->post(route('admin.users.tickets.store', $user), [
            'ticketNumbers' => $ticketNumbers,
        ]);

    $response->assertRedirect(route('admin.users'));
    $response->assertSessionHas('status');

    foreach ($tickets as $ticket) {
        expect($ticket->fresh()->userId)->toBe($user->id);
        expect($ticket->fresh()->status)->toBe('SOLD');
        expect($ticket->fresh()->paymentId)->toBeNull();
        expect($ticket->fresh()->reservedAt)->not->toBeNull();
    }
});

test('non admin cannot add tickets to a user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ticket = Ticket::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('admin.users.tickets.store', $otherUser), [
            'ticketNumbers' => [$ticket->ticketNumber],
        ]);

    $response->assertForbidden();

    expect($ticket->fresh()->userId)->toBeNull();
    expect($ticket->fresh()->status)->toBe('AVAILABLE');
});

test('guest cannot add tickets to a user', function () {
    $user = User::factory()->create();
    $ticket = Ticket::factory()->create();

    $response = $this->post(route('admin.users.tickets.store', $user), [
        'ticketNumbers' => [$ticket->ticketNumber],
    ]);

    $response->assertRedirect('/login');

    expect($ticket->fresh()->userId)->toBeNull();
    expect($ticket->fresh()->status)->toBe('AVAILABLE');
});

test('adding tickets fails when a ticket is already taken', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    $takenTicket = Ticket::factory()->create(['status' => 'SOLD']);
    $availableTicket = Ticket::factory()->create();

    $response = $this->actingAs($admin)
        ->from(route('admin.users'))
        ->post(route('admin.users.tickets.store', $user), [
            'ticketNumbers' => [$availableTicket->ticketNumber, $takenTicket->ticketNumber],
        ]);

    $response->assertSessionHasErrors('ticketNumbers');

    expect($availableTicket->fresh()->status)->toBe('AVAILABLE');
    expect($availableTicket->fresh()->userId)->toBeNull();
});

test('adding tickets requires ticket numbers to exist', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)
        ->from(route('admin.users'))
        ->post(route('admin.users.tickets.store', $user), [
            'ticketNumbers' => [99999],
        ]);

    $response->assertSessionHasErrors('ticketNumbers.0');
});

test('adding tickets requires at least one ticket number', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)
        ->from(route('admin.users'))
        ->post(route('admin.users.tickets.store', $user), [
            'ticketNumbers' => [],
        ]);

    $response->assertSessionHasErrors('ticketNumbers');
});
