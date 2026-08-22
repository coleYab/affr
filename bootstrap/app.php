<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\EnsurePhoneVerified;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        /*
         * Telegram Mini Apps run inside the Telegram WebView, which does not
         * always persist or send cookies (especially on iOS). The auth
         * endpoint relies on the HMAC-signed initData payload instead of a
         * CSRF token, so it is exempt from the default CSRF verification.
         */
        $middleware->validateCsrfTokens(except: ['auth/telegram*']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'is_admin' => AdminMiddleware::class,
            'ensure_phone_verified' => EnsurePhoneVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
         * Telegram's WebView is not always reliable with cookies, which can
         * cause CSRF token mismatches (419). Instead of showing the raw
         * "Page Expired" modal, bounce the user back with a friendly message.
         */
        $exceptions->respond(function (Response $response) {
            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'status' => 'The page expired, please try again.',
                ]);
            }

            return $response;
        });
    })->create();
