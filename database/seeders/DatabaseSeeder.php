<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use App\Models\Payments;
use App\Models\RecentActivity;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 5000 tickets
        for ($i = 1; $i <= 2500; $i++) {
            Ticket::create([
                'ticketNumber' => $i,
                'status' => 'AVAILABLE',
                'userId' => null,
                'paymentId' => null,
            ]);
        }

        AppSetting::create([
            'cycle' => 1,
            'days_remaining' => 7,
            'draw_date' => now()->addDays(7),

            'prize_name' => 'BYD YUANUP 2025',
            'prize_value' => '85,000 USD',
            'prize_image' => 'prizes/landcruiser-main.jpg',
            'prize_images' => [
                'prizes/landcruiser-1.jpg',
                'prizes/landcruiser-2.jpg',
                'prizes/landcruiser-3.jpg',
            ],

            'live_stream_url' => 'https://youtube.com/live/example',

            'is_live' => false,
            'registration_enabled' => true,
            'ticket_selection_enabled' => true,
            'winner_announcement_mode' => false,

            'next_draw_date_en' => 'March 15, 2026',
            'next_draw_date_am' => 'መጋቢት 6, 2026',

            'pot_value' => 5000000,
            'total_members' => 12500,
            'cars_delivered' => 32,
            'trust_score' => 98,
        ]);

        // $user = User::first();
        /*

        // Create 10 payment requests and assign each to a random ticket
        for ($i = 1; $i <= 10; $i++) {
            $payment = Payments::create([
                'userId' => $user->id,
                'userName' => $user->name,
                'userPhone' => '1234567890',
                'amount' => rand(50, 500), // random amount
                'receiptUrl' => "https://hips.hearstapps.com/hmg-prod/images/future-cars-2-6939c3d6c9abe.jpg",
                'requestedTicket' => $i, // example ticket request
            ]);

            // Assign this payment to a random available ticket
            $ticket = Ticket::where('status', 'AVAILABLE')->inRandomOrder()->first();
            if ($ticket) {
                $ticket->update([
                    'status' => 'RESERVED',
                    'userId' => $user->id,
                    'paymentId' => $payment->id,
                    'reservedAt' => now(),
                ]);
            }
        }

        */
        // RecentActivity::factory()->count(10)->create([
        //     'userId' => $user->id
        // ]);
    }
}
