<?php

use App\Models\Payments;
use App\Models\Ticket;
use App\Models\User;

it('returns null payment for a ticket without paymentId', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    $ticket = Ticket::factory()->create([
        'paymentId' => null,
    ]);

    $this->actingAs($admin)
        ->getJson(route('admin.tickets.payment', ['ticket' => $ticket->id]))
        ->assertSuccessful()
        ->assertJson([
            'ticketId' => $ticket->id,
            'payment' => null,
        ]);
});

it('returns payment details for a ticket with paymentId', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    $payment = Payments::factory()->create([
        'status' => 'PENDING',
    ]);

    $ticket = Ticket::factory()->create([
        'userId' => $payment->userId,
        'paymentId' => $payment->id,
        'status' => 'RESERVED',
    ]);

    $this->actingAs($admin)
        ->getJson(route('admin.tickets.payment', ['ticket' => $ticket->id]))
        ->assertSuccessful()
        ->assertJsonPath('ticketId', $ticket->id)
        ->assertJsonPath('payment.id', (string) $payment->id)
        ->assertJsonPath('payment.userId', $payment->userId)
        ->assertJsonPath('payment.status', $payment->status);
});
