<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticketNumber' => $this->faker->unique()->numberBetween(1, 5000),
            'cycle' => 1,
            'userId' => null,
            'paymentId' => null,
            'status' => 'AVAILABLE',
            'reservedAt' => null,
        ];
    }
}
