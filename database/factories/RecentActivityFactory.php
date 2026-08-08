<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RecentActivity>
 */
class RecentActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'userId' => User::factory(),
            'type' => $this->faker->randomElement([
                'JOINED',
                'PAYMENT_SUBMITTED',
                'PAYMENT_APPROVED',
                'PAYMENT_REJECTED',
                'TICKET_RESERVED',
            ]),
            'status' => $this->faker->randomElement(['success', 'info', 'warning']),
            'title_en' => $this->faker->sentence(3),
            'title_am' => null,
            'description_en' => $this->faker->sentence(10),
            'description_am' => null,
            'link' => null,
            'cycle' => $this->faker->optional()->numberBetween(1, 50),
            'meta' => null,
            'occurred_at' => $this->faker->dateTimeBetween('-14 days'),
        ];
    }
}
