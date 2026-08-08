<?php

use App\Models\RecentActivity;
use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
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
            ->has('recentActivities')
        );
});

test('dashboard includes recent activities for the authenticated user', function () {
    $user = User::factory()->create();

    RecentActivity::factory()->create([
        'userId' => $user->id,
        'type' => 'PAYMENT_APPROVED',
        'status' => 'success',
        'title_en' => 'Payment Approved',
        'description_en' => 'Your payment was approved.',
        'occurred_at' => now(),
    ]);

    $otherUser = User::factory()->create();
    RecentActivity::factory()->create([
        'userId' => $otherUser->id,
        'type' => 'JOINED',
        'status' => 'info',
        'title_en' => 'Someone joined',
        'description_en' => 'Another user joined.',
        'occurred_at' => now(),
    ]);

    $this
        ->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('recentActivities', 1)
            ->where('recentActivities.0.type', 'PAYMENT_APPROVED')
            ->where('recentActivities.0.status', 'success')
            ->where('recentActivities.0.title.en', 'Payment Approved')
        );
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
                ->where('data.0.number', 61)
                ->where('data.0.taken', false)
                ->where('data.1.number', 62)
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

test('guests can load public ticket board and check availability', function () {
    Ticket::factory()->createMany([
        ['ticketNumber' => 1, 'status' => 'AVAILABLE'],
        ['ticketNumber' => 2, 'status' => 'SOLD'],
        ['ticketNumber' => 3, 'status' => 'AVAILABLE'],
        ['ticketNumber' => 4, 'status' => 'SOLD'],
        ['ticketNumber' => 5, 'status' => 'AVAILABLE'],
        ['ticketNumber' => 6, 'status' => 'SOLD'],
        ['ticketNumber' => 7, 'status' => 'AVAILABLE'],
        ['ticketNumber' => 8, 'status' => 'SOLD'],
        ['ticketNumber' => 9, 'status' => 'AVAILABLE'],
        ['ticketNumber' => 10, 'status' => 'SOLD'],
        ['ticketNumber' => 11, 'status' => 'AVAILABLE'],
        ['ticketNumber' => 12, 'status' => 'SOLD'],
        ['ticketNumber' => 13, 'status' => 'AVAILABLE'],
    ]);

    $this
        ->get(route('public.ticket-board', ['perPage' => 12]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
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

    $this
        ->getJson(route('tickets.public-check-availability', ['number' => 2]))
        ->assertSuccessful()
        ->assertJson([
            'exists' => true,
            'taken' => true,
        ]);
});
