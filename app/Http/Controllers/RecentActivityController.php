<?php

namespace App\Http\Controllers;

use App\Models\RecentActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\Cursor;

class RecentActivityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $limit = (int) $request->integer('limit', 20);
        $limit = max(1, min(100, $limit));

        $cursor = $request->filled('cursor')
            ? Cursor::fromEncoded($request->string('cursor')->toString())
            : null;

        $activities = RecentActivity::query()
            ->where('userId', $user->id)
            ->orderByDesc('occurred_at')
            ->orderByDesc('id')
            ->cursorPaginate($limit, ['*'], 'cursor', $cursor);

        return response()->json([
            'data' => $activities
                ->getCollection()
                ->map(fn (RecentActivity $activity): array => $activity->toFrontendPayload())
                ->values(),
            'next_cursor' => $activities->nextCursor()?->encode(),
        ]);
    }
}
