<?php

use App\Http\Controllers\TelegramBotController;
use Illuminate\Support\Facades\Route;

Route::prefix('bot')->group(function () {
    Route::post('/ticket/availability', [TelegramBotController::class, 'checkAvailability']);
    Route::post('/ticket/reserve', [TelegramBotController::class, 'reserveTicket']);
    Route::post('/ticket/upload-receipt', [TelegramBotController::class, 'uploadReceipt']);
});
