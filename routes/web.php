<?php

use App\Http\Controllers\Admin\WinnerController;
use App\Http\Controllers\AppNotificationReadController;
use App\Http\Controllers\AppSettingsController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\RecentActivityController;
use App\Http\Controllers\TelegramAuthController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard')->name('home');

Route::get('/terms', function () {
    return Inertia::render('terms');
})->name('terms');

Route::post('auth/telegram', [TelegramAuthController::class, 'store'])
    ->middleware(['guest', 'throttle:10,1'])
    ->name('telegram.auth');

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');

Route::get('dashboard', [TicketController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('dashboard/ticket-board', [TicketController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard.ticket-board');

Route::get('tickets/check-availability', [TicketController::class, 'checkAvailability'])
    ->middleware(['auth', 'verified'])
    ->name('tickets.check-availability');

// this are admin routes
Route::prefix('admin')
    ->middleware(['auth', 'verified', 'is_admin'])
    ->group(function () {
        Route::get('settings', [AppSettingsController::class, 'index'])->name('admin.settings');
        Route::put('settings', [AppSettingsController::class, 'store'])->name('admin.settings.update');

        Route::get('notifications', [AppSettingsController::class, 'notifications'])->name('admin.notifications');
        Route::post('notifications', [AppSettingsController::class, 'notificationsStore'])->name('admin.notifications.store');

        Route::get('users', [AppSettingsController::class, 'user'])->name('admin.users');
        Route::post('users', [AppSettingsController::class, 'usersStore'])->name('admin.users.store');
        Route::delete('users/{user}', [AppSettingsController::class, 'usersDestroy'])->name('admin.users.destroy');
        Route::get('prize', [AppSettingsController::class, 'prize'])->name('admin.prize');
        Route::get('cycle', [AppSettingsController::class, 'cycle'])->name('admin.cycle');
        Route::get('dashboard', [AppSettingsController::class, 'dashboard'])->name('admin.dashboard');

        Route::get('payments', [PaymentsController::class, 'adminpayments'])->name('admin.payments');
        Route::put('payments/{id}/status', [PaymentsController::class, 'updateStatus'])->name('payments.updateStatus');

        Route::get('tickets/{ticket}/payment', [PaymentsController::class, 'showForTicket'])
            ->name('admin.tickets.payment');

        Route::post('winners/announce', [WinnerController::class, 'announce']);
    });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/mypayments', [PaymentsController::class, 'mypayments'])->name('mypayments');
    Route::post('/payments', [PaymentsController::class, 'store'])->name('payments.store');
    Route::put('/payments/{id}', [PaymentsController::class, 'update'])->name('payments.update');
    Route::delete('/payments/{id}', [PaymentsController::class, 'delete'])->name('payments.delete');
    Route::get('/recent-activities', [RecentActivityController::class, 'index'])->name('recent-activities.index');

    Route::post('/notifications/{notification}/read', [AppNotificationReadController::class, 'store'])
        ->name('user.notifications.read');
    Route::post('/notifications/read-all', [AppNotificationReadController::class, 'storeAll'])
        ->name('user.notifications.read-all');
});

// this are the normal routes
Route::get('myticket', [TicketController::class, 'tickets'])->middleware(['auth', 'verified'])->name('user.mytickets');
// Route::get('mypayments', [TicketController::class, 'mypayments'])->middleware(['auth', 'verified'])->name('user.mypaymnets');
Route::get('notifications', [TicketController::class, 'notifications'])->middleware(['auth', 'verified'])->name('user.mynotifications');

require __DIR__.'/settings.php';
