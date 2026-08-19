<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Payments;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        $settings = AppSetting::query()->first();
        $currentCycle = $settings?->cycle;

        $contribution = Payments::query()
            ->where('userId', $user->id)
            ->where('status', 'APPROVED')
            ->sum('amount');

        $myTickets = Ticket::query()
            ->where('userId', $user->id)
            ->when($currentCycle, fn ($query) => $query->where('cycle', $currentCycle))
            ->orderBy('ticketNumber')
            ->get(['id', 'ticketNumber', 'status', 'reservedAt', 'paymentId']);

        return Inertia::render('dashboard', [
            'ticketBoard' => $this->ticketBoard($request, forcePerPage: $request->routeIs('dashboard') ? 1500 : null),
            'userSummary' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phoneNumber ?? '',
                'status' => $user->email_verified_at ? 'VERIFIED' : 'PENDING',
                'contribution' => (float) $contribution,
                'joinedDate' => $user->created_at?->toDateString(),
            ],
            'myTickets' => $myTickets,
        ]);
    }

    /**
     * @return array{data: array<int, array{number:int, taken:bool}>, prevCursor: ?string, nextCursor: ?string}
     */
    protected function ticketBoard(Request $request, ?int $defaultStartAt = null, ?int $forcePerPage = null): array
    {
        $perPage = $forcePerPage ?? (int) $request->integer('perPage', 60);
        $perPage = max(12, min(2000, $perPage));

        $cursor = $request->string('cursor')->toString();
        $cursor = $cursor !== '' ? $cursor : null;

        if ($cursor === null) {
            $startAt = $request->filled('startAt')
                ? (int) $request->integer('startAt')
                : $defaultStartAt;

            if (is_int($startAt) && $startAt > 1) {
                $warmup = Ticket::query()
                    ->select(['ticketNumber', 'status'])
                    ->orderBy('ticketNumber')
                    ->cursorPaginate($startAt - 1, ['ticketNumber', 'status'], 'cursor');

                $cursor = $warmup->nextCursor()?->encode();
            }
        }

        $paginator = Ticket::query()
            ->select(['ticketNumber', 'status'])
            ->orderBy('ticketNumber')
            ->cursorPaginate($perPage, ['ticketNumber', 'status'], 'cursor', $cursor);

        $prevCursor = $paginator->previousCursor()?->encode();
        $nextCursor = $paginator->nextCursor()?->encode();

        $data = collect($paginator->items())
            ->map(function (Ticket $ticket): array {
                return [
                    'number' => (int) $ticket->ticketNumber,
                    'taken' => $ticket->status !== 'AVAILABLE',
                ];
            })
            ->all();

        return [
            'data' => $data,
            'prevCursor' => $prevCursor,
            'nextCursor' => $nextCursor,
        ];
    }

    public function checkAvailability(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'number' => ['required', 'integer', 'min:1'],
        ]);

        $ticket = Ticket::query()
            ->select(['ticketNumber', 'status'])
            ->where('ticketNumber', $validated['number'])
            ->first();

        if (! $ticket) {
            return response()->json([
                'number' => (int) $validated['number'],
                'exists' => false,
                'taken' => null,
            ]);
        }

        return response()->json([
            'number' => (int) $ticket->ticketNumber,
            'exists' => true,
            'taken' => $ticket->status !== 'AVAILABLE',
        ]);
    }

    // Show tickets for the logged-in user
    public function tickets(): Response
    {
        $tickets = Ticket::where('userId', Auth::user()->id)
            ->latest()
            ->get();

        // $tickets = Ticket::take(10)->get();

        return Inertia::render('tickets', [
            'tickets' => $tickets,
        ]);
    }

    // Reserve a ticket for a user (only 1 ticket per payment)
    public function store(Request $request)
    {
        $request->validate([
            'paymentId' => 'required|exists:payments,id',
            'ticketNumber' => 'required|integer|exists:tickets,ticketNumber',
        ]);

        $payment = Payments::where('id', $request->paymentId)
            ->where('userId', Auth::id())
            ->firstOrFail();

        if ($payment->status !== 'PENDING') {
            return back()->with('error', 'Cannot reserve ticket for this payment.');
        }

        // Find the ticket by ticketNumber
        $ticket = Ticket::where('ticketNumber', $request->ticketNumber)
            ->where('status', 'AVAILABLE')
            ->lockForUpdate()
            ->first();

        if (! $ticket) {
            return back()->with('error', 'This ticket number is not available.');
        }

        $ticket->update([
            'userId' => $payment->userId,
            'paymentId' => $payment->id,
            'reservedAt' => now(),
            'status' => 'PENDING', // set when reserved
        ]);

        return redirect()->route('tickets')
            ->with('success', 'Ticket reserved successfully and is now PENDING approval.');
    }

    public function reject($id)
    {
        $ticket = Ticket::findOrFail($id);

        if (! Auth::user()->is_admin) {
            abort(403);
        }

        $ticket->update([
            'userId' => null,
            'paymentId' => null,
            'reservedAt' => null,
            'status' => 'AVAILABLE',
        ]);

        return back()->with('success', 'Ticket reset to AVAILABLE.');
    }

    // Admin view all tickets
    public function adminTickets()
    {
        if (! Auth::user()->is_admin) {
            abort(403);
        }

        $tickets = Ticket::latest()->get();

        return Inertia::render('admin/tickets', [
            'tickets' => $tickets,
        ]);
    }

    // Admin approves ticket after payment approved
    public function approveTickets(Payments $payment)
    {
        if (! Auth::user()->is_admin) {
            abort(403);
        }

        if ($payment->status !== 'APPROVED') {
            return back()->with('error', 'Payment must be approved first.');
        }

        $payment->tickets()->update([
            'status' => 'SOLD',
        ]);

        return back()->with('success', 'Ticket approved and marked as SOLD.');
    }

    public function index(): Response
    {
        return Inertia::render('tickets', []);
    }

    public function create(): Response
    {
        return Inertia::render('ticket/create', []);
    }

    public function find(): Response
    {
        return Inertia::render('tickets', []);
    }

    public function delete(): Response
    {
        return Inertia::render('ticket/index', []);
    }
}
