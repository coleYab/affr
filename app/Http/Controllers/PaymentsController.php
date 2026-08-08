<?php

namespace App\Http\Controllers;

use App\Models\Payments;
use App\Models\RecentActivity;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PaymentsController extends Controller
{
    public function mypayments()
    {
        $payments = Payments::where('userId', Auth::user()->id)
            ->latest()
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => (string) $payment->id,
                    'userId' => $payment->userId,
                    'userName' => $payment->userName,
                    'userPhone' => $payment->userPhone,
                    'amount' => (float) $payment->amount,
                    'date' => $payment->created_at->toIso8601String(),
                    'receiptUrl' => $payment->receiptUrl,
                    'status' => $payment->status,
                    'requestedTicket' => $payment->requestedTicket ?? null,
                ];
            });

        return Inertia::render('mypayments', [
            'payments' => $payments,
        ]);
    }

    public function adminpayments()
    {
        $payments = Payments::latest()->get();

        return Inertia::render('admin/payments', [
            'paymentRequest' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'requestedTicket' => 'required|integer|min:1',
            'receipt' => 'required|image|max:10000',
        ]);

        // Upload Image
        $path = $request->file('receipt')->store('receipts', 'public');

        $user = Auth::user();
        $receiptUrl = '/storage/'.$path;

        try {
            $payment = DB::transaction(function () use ($request, $user, $receiptUrl) {
                $payment = Payments::create([
                    'userId' => $user->id,
                    'userName' => $user->name,
                    'userPhone' => $user->phoneNumber ?? '',
                    'amount' => $request->amount,
                    'receiptUrl' => $receiptUrl,
                    'requestedTicket' => $request->requestedTicket,
                ]);

                $ticket = Ticket::query()
                    ->where('ticketNumber', (int) $request->requestedTicket)
                    ->where('status', 'AVAILABLE')
                    ->lockForUpdate()
                    ->first();

                if (! $ticket) {
                    throw ValidationException::withMessages([
                        'requestedTicket' => 'This ticket number is not available.',
                    ]);
                }

                $ticket->update([
                    'userId' => $user->id,
                    'paymentId' => $payment->id,
                    'reservedAt' => now(),
                    'status' => 'RESERVED',
                ]);

                return $payment;
            });
        } catch (\Throwable $e) {
            Storage::disk('public')->delete($path);
            throw $e;
        }

        RecentActivity::query()->create([
            'userId' => $user->id,
            'type' => 'PAYMENT_SUBMITTED',
            'status' => 'info',
            'title_en' => 'Payment submitted',
            'title_am' => null,
            'description_en' => 'Your payment receipt is under review.',
            'description_am' => null,
            'link' => $payment->receiptUrl,
            'cycle' => null,
            'meta' => [
                'paymentId' => $payment->id,
                'requestedTicket' => (int) $payment->requestedTicket,
                'amount' => (float) $payment->amount,
            ],
            'occurred_at' => now(),
        ]);

        return redirect()->route('mypayments')
            ->with('success', 'Payment request submitted successfully.');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $payment = Payments::where('userId', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        if ($payment->status !== 'PENDING') {
            return back()->with('error', 'You cannot update this payment.');
        }

        $request->validate([
            'amount' => 'required|numeric|min:1',
            'requestedTicket' => 'required|integer|min:1',
            'receipt' => 'nullable|image|max:10000',
        ]);

        if ($request->hasFile('receipt')) {
            // Delete old receipt
            Storage::disk('public')->delete(str_replace('/storage/', '', $payment->receiptUrl));
            $path = $request->file('receipt')->store('receipts', 'public');
            $payment->receiptUrl = '/storage/'.$path;
        }

        $payment->amount = 2000;
        $payment->requestedTicket = $request->requestedTicket;
        $payment->save();

        return redirect()->route('mypayments')->with('success', 'Payment updated successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        if (! $user->is_admin) {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:APPROVED,REJECTED',
        ]);

        $payment = Payments::findOrFail($id);

        // Only allow change if currently PENDING
        if ($payment->status !== 'PENDING') {
            return back()->with('error', 'Status cannot be changed.');
        }

        DB::transaction(function () use ($payment, $request) {
            $payment->status = $request->status;
            $payment->save();

            $ticket = Ticket::query()
                ->where('paymentId', $payment->id)
                ->lockForUpdate()
                ->first();

            if (! $ticket) {
                return;
            }

            if ($payment->status === 'APPROVED') {
                $ticket->update([
                    'status' => 'SOLD',
                ]);
            } else {
                $ticket->update([
                    'userId' => null,
                    'paymentId' => null,
                    'reservedAt' => null,
                    'status' => 'AVAILABLE',
                ]);
            }
        });

        RecentActivity::query()->create([
            'userId' => $payment->userId,
            'type' => $payment->status === 'APPROVED' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
            'status' => $payment->status === 'APPROVED' ? 'success' : 'error',
            'title_en' => $payment->status === 'APPROVED' ? 'Payment approved' : 'Payment rejected',
            'title_am' => null,
            'description_en' => $payment->status === 'APPROVED'
                ? 'Your payment was approved.'
                : 'Your payment was rejected.',
            'description_am' => null,
            'link' => $payment->receiptUrl,
            'cycle' => null,
            'meta' => [
                'paymentId' => $payment->id,
                'requestedTicket' => (int) $payment->requestedTicket,
                'amount' => (float) $payment->amount,
                'status' => $payment->status,
            ],
            'occurred_at' => now(),
        ]);

        return redirect()->route('admin.payments')->with('success', 'Payment status updated.');
    }

    public function delete($id)
    {
        $user = Auth::user();
        $payment = Payments::where('userId', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        if ($payment->status !== 'PENDING') {
            return back()->with('error', 'You cannot delete this payment.');
        }

        DB::transaction(function () use ($payment) {
            $ticket = Ticket::query()
                ->where('paymentId', $payment->id)
                ->lockForUpdate()
                ->first();

            if ($ticket) {
                $ticket->update([
                    'userId' => null,
                    'paymentId' => null,
                    'reservedAt' => null,
                    'status' => 'AVAILABLE',
                ]);
            }

            $payment->delete();
        });

        Storage::disk('public')->delete(str_replace('/storage/', '', $payment->receiptUrl));

        return redirect()->route('mypayments')->with('success', 'Payment deleted successfully.');
    }

    public function showForTicket(Ticket $ticket): JsonResponse
    {
        $payment = $ticket->payment;

        if (! $payment) {
            return response()->json([
                'ticketId' => $ticket->id,
                'payment' => null,
            ]);
        }

        return response()->json([
            'ticketId' => $ticket->id,
            'payment' => [
                'id' => (string) $payment->id,
                'userId' => $payment->userId,
                'userName' => $payment->userName,
                'userPhone' => $payment->userPhone,
                'amount' => (float) $payment->amount,
                'requestedTicket' => $payment->requestedTicket,
                'receiptUrl' => $payment->receiptUrl,
                'status' => $payment->status,
                'createdAt' => $payment->created_at?->toIso8601String(),
            ],
        ]);
    }
}
