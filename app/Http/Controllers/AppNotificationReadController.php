<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\AppNotificationRead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppNotificationReadController extends Controller
{
    public function store(Request $request, AppNotification $notification): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if ($notification->target_user_id !== null && (int) $notification->target_user_id !== (int) $user->id) {
            abort(404);
        }

        AppNotificationRead::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'app_notification_id' => $notification->id,
            ],
            [
                'read_at' => now(),
            ],
        );

        return response()->json([
            'ok' => true,
        ]);
    }

    public function storeAll(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        $notificationIds = AppNotification::query()
            ->where(function ($query) use ($user): void {
                $query->whereNull('target_user_id');
                $query->orWhere('target_user_id', $user->id);
            })
            ->pluck('id');

        $now = now();

        $rows = $notificationIds
            ->map(fn (int $id): array => [
                'user_id' => $user->id,
                'app_notification_id' => $id,
                'read_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->all();

        if ($rows !== []) {
            AppNotificationRead::query()->upsert(
                $rows,
                ['user_id', 'app_notification_id'],
                ['read_at', 'updated_at'],
            );
        }

        return response()->json([
            'ok' => true,
        ]);
    }
}
