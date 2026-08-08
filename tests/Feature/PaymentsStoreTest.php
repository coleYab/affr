<?php

use App\Models\Payments;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('stores a payment request with receipt upload', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $ticket = Ticket::factory()->create([
        'ticketNumber' => 12,
        'status' => 'AVAILABLE',
    ]);

    $response = $this->actingAs($user)->post(route('payments.store'), [
        'amount' => 5000,
        'requestedTicket' => 12,
        'receipt' => UploadedFile::fake()->image('receipt.png', 1200, 800),
    ]);

    $response->assertRedirect(route('mypayments'));

    expect(Payments::query()->count())->toBe(1);

    $payment = Payments::query()->firstOrFail();

    expect($payment->userId)->toBe($user->id);
    expect((int) $payment->requestedTicket)->toBe(12);
    expect((float) $payment->amount)->toBe(5000.0);
    expect($payment->receiptUrl)->toStartWith('/storage/receipts/');

    $ticket->refresh();
    expect($ticket->status)->toBe('RESERVED');
    expect($ticket->userId)->toBe($user->id);
    expect($ticket->paymentId)->toBe($payment->id);

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $payment->receiptUrl));
});

it('updates a payment request with a webp receipt upload', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $payment = Payments::factory()->create([
        'userId' => $user->id,
        'status' => 'PENDING',
        'receiptUrl' => '/storage/receipts/old.png',
    ]);

    $response = $this->actingAs($user)->put(route('payments.update', ['id' => $payment->id]), [
        'amount' => 5000,
        'requestedTicket' => 12,
        'receipt' => UploadedFile::fake()->image('receipt.webp', 1200, 800),
    ]);

    $response->assertRedirect(route('mypayments'));

    $payment->refresh();

    expect($payment->receiptUrl)->toStartWith('/storage/receipts/');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $payment->receiptUrl));
});
