<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AdminNotificationStoreRequest;
use App\Http\Requests\Admin\AdminSettingsUpdateRequest;
use App\Http\Requests\Admin\AdminUserStoreRequest;
use App\Models\AppNotification;
use App\Models\AppSetting;
use App\Models\Payments;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AppSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings', []);
    }

    public function store(AdminSettingsUpdateRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $settings = AppSetting::first();

        $settings->update([
            'cycle' => $data['cycle'],
            'days_remaining' => $data['daysRemaining'],
            'draw_date' => $data['drawDate'],
            'prize_name' => $data['prizeName'],
            'prize_value' => $data['prizeValue'],
            'prize_image' => $data['prizeImage'] ?: null,
            'prize_images' => $data['prizeImages'] ?? null,
            'live_stream_url' => $data['liveStreamUrl'] ?: null,
            'is_live' => $data['isLive'],
            'registration_enabled' => $data['registrationEnabled'],
            'ticket_selection_enabled' => $data['ticketSelectionEnabled'],
            'winner_announcement_mode' => $data['winnerAnnouncementMode'],
            'next_draw_date_en' => $data['nextDrawDateEn'] ?? null,
            'next_draw_date_am' => $data['nextDrawDateAm'] ?? null,
        ]);

        Cache::forget('app_settings');

        return redirect()->route('admin.settings')->with('status', 'Settings saved successfully.');
    }

    public function prize()
    {
        return Inertia::render('admin/prizes', []);
    }

    public function user()
    {
        // Total contributions per user (works in both SQLite & MySQL)
        $contributions = Payments::where('status', 'APPROVED')
            ->select('userId', DB::raw('SUM(amount) as total'))
            ->groupBy('userId')
            ->pluck('total', 'userId');

        // Approved tickets per user (SQLite-compatible)
        $tickets = Ticket::where('status', 'SOLD')
            ->select('userId', DB::raw('GROUP_CONCAT(ticketNumber) as numbers'))
            ->groupBy('userId')
            ->pluck('numbers', 'userId');

        $users = User::all()->map(function ($user) use ($contributions, $tickets) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phoneNumber,
                'status' => $user->email_verified_at ? 'VERIFIED' : 'PENDING',
                'contribution' => $contributions[$user->id] ?? 0,
                'prizeNumber' => $tickets[$user->id] ?? null,
                'joinedDate' => $user->created_at?->toDateString(),
                'banned' => false,
            ];
        });

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    public function usersStore(AdminUserStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data): User {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => sprintf('user_%s@placeholder.local', Str::lower(Str::random(32))),
                'phoneNumber' => $data['phone'],
                'password' => $data['phone'],
            ]);

            if (($data['status'] ?? 'PENDING') === 'VERIFIED') {
                $user->forceFill([
                    'email_verified_at' => now(),
                ])->save();
            }

            $ticketNumbers = $data['ticketNumbers'] ?? [];

            if (is_array($ticketNumbers) && $ticketNumbers !== []) {
                $ticketsToAssign = Ticket::query()
                    ->whereIn('ticketNumber', $ticketNumbers)
                    ->lockForUpdate()
                    ->get();

                foreach ($ticketsToAssign as $ticket) {
                    $ticket->forceFill([
                        'userId' => $user->id,
                        'paymentId' => null,
                        'reservedAt' => null,
                        'status' => 'SOLD',
                    ])->save();
                }
            }

            return $user;
        });

        return redirect()
            ->route('admin.users')
            ->with('status', 'User created successfully.');
    }

    public function usersDestroy(User $user): RedirectResponse
    {
        DB::transaction(function () use ($user): void {
            Ticket::query()
                ->where('userId', $user->id)
                ->update([
                    'userId' => null,
                    'paymentId' => null,
                    'reservedAt' => null,
                    'status' => 'AVAILABLE',
                ]);

            $user->delete();
        });

        return redirect()
            ->route('admin.users')
            ->with('status', 'User deleted successfully.');
    }

    public function dashboard()
    {
        $payments = Payments::query()->where('status', 'PENDING')->take(4)->get();

        $paymentsVerified = Payments::query()
            ->where('status', 'APPROVED')
            ->count();

        $reservedTickets = Ticket::query()
            ->where('status', 'RESERVED')
            ->count();

        $totalUsers = User::count(); // no need for get()

        $claimedTickets = Ticket::query()
            ->where('status', 'SOLD')
            ->count();

        return Inertia::render('admin/dashboard', [
            'paymentRequests' => $payments,
            'claimedTickets' => $claimedTickets,
            'totalMembers' => $totalUsers,
            'totalUsers' => $totalUsers,
            'paymentsVerified' => $paymentsVerified,
            'systemHealth' => 90.999,
            'reservedTickets' => $reservedTickets,
        ]);
    }

    public function cycle()
    {
        // $tickets = Ticket::take(10)->get();
        $tickets = Ticket::query()->orderBy('ticketNumber', 'asc')->where('status', 'SOLD')->get();
        $users = User::get();
        $payments = Payments::get();

        return Inertia::render('admin/competitions', [
            'users' => $users,
            'tickets' => $tickets,
            'paymnets' => $payments,
        ]);
    }

    public function payments()
    {
        return Inertia::render('admin/payments', []);
    }

    public function notifications(): Response
    {
        $notifications = AppNotification::query()
            ->latest('created_at')
            ->get()
            ->map(function (AppNotification $notification): array {
                return [
                    'id' => $notification->id,
                    'title_en' => $notification->title_en,
                    'message_en' => $notification->message_en,
                    'is_urgent' => $notification->is_urgent,
                    'link' => $notification->link,
                    'created_at' => $notification->created_at?->format('Y-m-d H:i') ?? '',
                ];
            });

        return Inertia::render('admin/notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function notificationsStore(AdminNotificationStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        AppNotification::query()->create([
            'title_en' => $data['title_en'],
            'title_am' => $data['title_am'] ?? null,
            'message_en' => $data['message_en'],
            'message_am' => $data['message_am'] ?? null,
            'link' => $data['link'] ?: null,
            'is_urgent' => $data['is_urgent'],
            'sent_at' => now(),
        ]);

        return redirect()
            ->route('admin.notifications')
            ->with('status', 'Notification broadcast created.');
    }
}
