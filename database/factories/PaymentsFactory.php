<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payments>
 */
class PaymentsFactory extends Factory
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
            'userName' => $this->faker->name(),
            'userPhone' => $this->faker->numerify('09########'),
            'amount' => $this->faker->numberBetween(50, 5000),
            'receiptUrl' => '/storage/receipts/mock.png',
            'requestedTicket' => $this->faker->numberBetween(1, 5000),
            'status' => $this->faker->randomElement(['PENDING', 'APPROVED', 'REJECTED']),
        ];
    }
}
