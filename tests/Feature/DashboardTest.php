<?php

use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('the root path redirects to the dashboard', function () {
    $this->get('/')->assertRedirect(route('dashboard'));

    $this->actingAs(User::factory()->create())
        ->get('/')
        ->assertRedirect(route('dashboard'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('ticketBoard')
            ->has('ticketBoard.data')
            ->has('ticketBoard.nextCursor')
            ->has('userSummary')
        );
});

test('users without a phone number are sent to phone verification', function () {
    $user = User::factory()->create(['phoneNumber' => null]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('phone.verify'));
});

test('dashboard ticket board endpoint supports cursor pagination', function () {
    $user = User::factory()->create();

    Ticket::factory()->createMany(collect(range(1, 140))
        ->map(fn (int $number): array => [
            'ticketNumber' => $number,
            'status' => $number % 2 === 0 ? 'SOLD' : 'AVAILABLE',
        ])
        ->all());

    $response = $this
        ->actingAs($user)
        ->get(route('dashboard.ticket-board', ['perPage' => 12]));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('ticketBoard', fn (Assert $prop) => $prop
                ->has('data', 12)
                ->where('data.0.number', 1)
                ->where('data.0.taken', false)
                ->where('data.1.number', 2)
                ->where('data.1.taken', true)
                ->has('prevCursor')
                ->has('nextCursor')
            )
        );
});

test('dashboard ticket board endpoint can start at a requested ticket number', function () {
    $user = User::factory()->create();

    Ticket::factory()->createMany(collect(range(1, 140))
        ->map(fn (int $number): array => [
            'ticketNumber' => $number,
            'status' => $number % 2 === 0 ? 'SOLD' : 'AVAILABLE',
        ])
        ->all());

    $this
        ->actingAs($user)
        ->get(route('dashboard.ticket-board', ['perPage' => 12, 'startAt' => 10]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('ticketBoard', fn (Assert $prop) => $prop
                ->has('data', 12)
                ->where('data.0.number', 10)
                ->where('data.0.taken', true)
                ->where('data.1.number', 11)
                ->where('data.1.taken', false)
                ->has('prevCursor')
                ->has('nextCursor')
            )
        );
});

test('ticket availability endpoint returns taken status', function () {
    $user = User::factory()->create();

    Ticket::factory()->create(['ticketNumber' => 10, 'status' => 'AVAILABLE']);
    Ticket::factory()->create(['ticketNumber' => 11, 'status' => 'SOLD']);

    $this
        ->actingAs($user)
        ->getJson(route('tickets.check-availability', ['number' => 10]))
        ->assertSuccessful()
        ->assertJson([
            'exists' => true,
            'taken' => false,
        ]);

    $this
        ->actingAs($user)
        ->getJson(route('tickets.check-availability', ['number' => 11]))
        ->assertSuccessful()
        ->assertJson([
            'exists' => true,
            'taken' => true,
        ]);
});
