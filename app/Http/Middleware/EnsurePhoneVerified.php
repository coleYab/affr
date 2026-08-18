<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePhoneVerified
{
    /**
     * Users must attach a phone number (via Telegram contact sharing or the
     * manual form) before they can use the application.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user !== null && $user->phoneNumber === null) {
            return redirect()->route('phone.verify');
        }

        return $next($request);
    }
}
