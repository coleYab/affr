<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AppSetting>
 */
class AppSettingFactory extends Factory
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
            'days_remaining' => 14,
            'draw_date' => now()->addDays(14),
            'prize_name' => 'iPhone 17 Pro',
            'prize_value' => '1,199 USD',
            'prize_image' => null,
            'prize_images' => null,
            'live_stream_url' => null,
            'is_live' => false,
            'registration_enabled' => true,
            'ticket_selection_enabled' => true,
            'winner_announcement_mode' => false,
        ];
    }
}
