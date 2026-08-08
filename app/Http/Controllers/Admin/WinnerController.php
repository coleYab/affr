<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\WinnerAnnounceRequest;
use App\Models\AppNotification;
use App\Models\AppSetting;
use App\Models\Ticket;
use App\Models\Winner;
use App\Notifications\WinnerAnnounced;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class WinnerController extends Controller
{
    public function announce(WinnerAnnounceRequest $request): JsonResponse
    {
        $data = $request->validated();

        $settings = AppSetting::query()->first();
        $cycle = $settings?->cycle;

        if (! $cycle) {
            return response()->json([
                'message' => 'App settings missing or cycle not configured.',
            ], 422);
        }

        $ticket = Ticket::query()
            ->where('ticketNumber', $data['ticketNumber'])
            ->first();

        if (! $ticket || ! $ticket->userId) {
            return response()->json([
                'message' => 'Ticket not found or not assigned to a user.',
            ], 422);
        }

        $place = (int) $data['place'];

        $prizeName = match ($place) {
            2 => '100K ETB',
            3 => '50K ETB',
            default => $settings->prize_name,
        };

        $prizeAmount = match ($place) {
            2 => 100_000,
            3 => 50_000,
            default => null,
        };

        /** @var Winner $winner */
        $winner = DB::transaction(function () use ($cycle, $place, $ticket, $prizeName, $prizeAmount, $settings): Winner {
            $winner = Winner::query()->updateOrCreate(
                ['cycle' => $cycle, 'place' => $place],
                [
                    'user_id' => $ticket->userId,
                    'ticket_id' => $ticket->id,
                    'prize_name' => $prizeName,
                    'prize_amount' => $prizeAmount,
                    'announced_at' => now(),
                ],
            );

            if ($place === 1) {
                $settings->update([
                    'winner_announcement_mode' => true,
                ]);
            }

            return $winner;
        });

        $winner->loadMissing(['ticket', 'user']);

        AppNotification::query()->create([
            'target_user_id' => $winner->user_id,
            'title_en' => 'Congratulations! You are a winner',
            'title_am' => null,
            'message_en' => sprintf(
                'You won %s for cycle %d with ticket #%d.',
                $winner->prize_amount !== null
                    ? sprintf('%s (ETB %s)', $winner->prize_name, number_format($winner->prize_amount))
                    : $winner->prize_name,
                $winner->cycle,
                $winner->ticket->ticketNumber,
            ),
            'message_am' => null,
            'link' => '/dashboard',
            'is_urgent' => true,
            'sent_at' => now(),
        ]);

        $winner->user->notify(new WinnerAnnounced($winner));

        return response()->json([
            'message' => 'Winner announced.',
        ]);
    }
}
