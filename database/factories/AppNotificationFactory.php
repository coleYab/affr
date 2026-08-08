<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AppNotification>
 */
class AppNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'target_user_id' => null,
            'title_en' => fake()->sentence(3),
            'title_am' => null,
            'message_en' => fake()->paragraph(),
            'message_am' => null,
            'link' => null,
            'is_urgent' => false,
            'sent_at' => now(),
        ];
    }
}
