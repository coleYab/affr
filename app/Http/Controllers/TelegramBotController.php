<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TelegramBotController extends Controller
{
    /**
     * Verify the bot API secret matches the expected value.
     */
    private function verifyBotToken(?string $token): bool
    {
        $expected = config('app.bot_api_secret', env('BOT_API_SECRET', ''));

        return $expected !== '' && hash_equals($expected, (string) $token);
    }

    /**
     * Check ticket availability.
     *
     * POST /api/bot/ticket/availability
     * Body: { ticket_number: int, bot_token: string }
     */
    public function checkAvailability(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ticket_number' => 'required|integer|min:1',
            'bot_token' => 'required|string',
        ]);

        if (! $this->verifyBotToken($validated['bot_token'])) {
            return response()->json([
                'available' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            $ticket = Ticket::query()
                ->select(['ticketNumber', 'status'])
                ->where('ticketNumber', $validated['ticket_number'])
                ->first();

            if (! $ticket) {
                return response()->json([
                    'available' => false,
                    'message' => 'Ticket number does not exist.',
                ]);
            }

            if ($ticket->status !== 'AVAILABLE') {
                return response()->json([
                    'available' => false,
                    'message' => 'This ticket is already taken (status: '.$ticket->status.').',
                    'status' => $ticket->status,
                ]);
            }

            return response()->json([
                'available' => true,
                'message' => 'Ticket is available.',
                'status' => 'AVAILABLE',
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'available' => false,
                'message' => 'Server error while checking availability.',
            ], 500);
        }
    }

    /**
     * Reserve a ticket from the bot.
     *
     * POST /api/bot/ticket/reserve
     * Body: { telegram_id: int, ticket_number: int, bot_token: string, first_name?: string, username?: string }
     */
    public function reserveTicket(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'telegram_id' => 'required|integer',
            'ticket_number' => 'required|integer|min:1',
            'bot_token' => 'required|string',
            'first_name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
        ]);

        if (! $this->verifyBotToken($validated['bot_token'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            return DB::transaction(function () use ($validated) {
                $user = User::where('telegram_id', $validated['telegram_id'])->first();

                if (! $user) {
                    $name = trim(($validated['first_name'] ?? '').' '.($validated['username'] ?? ''));
                    if (empty($name)) {
                        $name = 'Telegram Bot User';
                    }

                    $user = User::create([
                        'name' => $name,
                        'email' => 'bot_'.strtolower(Str::random(32)).'@placeholder.local',
                        'password' => bcrypt(Str::random(32)),
                        'email_verified_at' => now(),
                        'telegram_id' => $validated['telegram_id'],
                        'telegram_username' => $validated['username'] ?? null,
                    ]);
                }

                $ticket = Ticket::query()
                    ->where('ticketNumber', $validated['ticket_number'])
                    ->where('status', 'AVAILABLE')
                    ->lockForUpdate()
                    ->first();

                if (! $ticket) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This ticket is no longer available.',
                    ], 409);
                }

                $payment = \App\Models\Payments::create([
                    'userId' => $user->id,
                    'userName' => $user->name,
                    'userPhone' => $user->phoneNumber ?? '',
                    'amount' => 500,
                    'requestedTicket' => $validated['ticket_number'],
                    'receiptUrl' => null,
                    'status' => 'PENDING',
                ]);

                $ticket->update([
                    'userId' => $user->id,
                    'paymentId' => $payment->id,
                    'reservedAt' => now(),
                    'status' => 'RESERVED',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Ticket reserved successfully.',
                    'payment_id' => $payment->id,
                ]);
            });
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Server error while reserving ticket.',
            ], 500);
        }
    }

    /**
     * Upload receipt for a reserved ticket.
     *
     * POST /api/bot/ticket/upload-receipt
     * Body (multipart): payment_id: int, receipt: image, bot_token: string
     */
    public function uploadReceipt(Request $request): JsonResponse
    {
        $request->validate([
            'payment_id' => 'required|integer|exists:payments,id',
            'receipt' => 'required|image|max:10000',
            'bot_token' => 'required|string',
        ]);

        if (! $this->verifyBotToken($request->bot_token)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        try {
            $payment = \App\Models\Payments::where('id', $request->payment_id)->first();

            if (! $payment || $payment->status !== 'PENDING') {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid payment or already processed.',
                ], 400);
            }

            $path = $request->file('receipt')->store('receipts', 'public');
            $payment->receiptUrl = '/storage/'.$path;
            $payment->save();

            return response()->json([
                'success' => true,
                'message' => 'Receipt uploaded successfully.',
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Server error while uploading receipt.',
            ], 500);
        }
    }
}
