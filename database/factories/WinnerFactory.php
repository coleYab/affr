<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Winner>
 */
class WinnerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cycle' => 1,
            'place' => 1,
            'user_id' => User::factory(),
            'ticket_id' => Ticket::factory(),
            'prize_name' => 'iPhone 17 Pro',
            'prize_amount' => null,
            'announced_at' => now(),
        ];
    }
}
