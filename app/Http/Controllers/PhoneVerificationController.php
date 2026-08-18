<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PhoneVerificationController extends Controller
{
    /**
     * Show the phone verification screen. Users can share their Telegram
     * contact, or enter a phone number manually, before using the app.
     */
    public function show(): Response
    {
        return Inertia::render('phone-verify');
    }

    /**
     * Attach a phone number entered manually as a fallback for users who are
     * not inside Telegram.
     */
    public function store(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'phoneNumber' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'phoneNumber')->ignore($user->getKey()),
            ],
        ]);

        $phoneNumber = $this->normalizePhone($validated['phoneNumber']);

        if ($phoneNumber === '') {
            throw ValidationException::withMessages([
                'phoneNumber' => 'Please enter a valid phone number.',
            ]);
        }

        $inUse = User::query()
            ->where('phoneNumber', $phoneNumber)
            ->whereKeyNot($user->getKey())
            ->exists();

        if ($inUse) {
            throw ValidationException::withMessages([
                'phoneNumber' => 'This phone number is already linked to another account.',
            ]);
        }

        $user->phoneNumber = $phoneNumber;
        $user->save();

        return redirect()->route('dashboard')->with('status', 'Phone number saved.');
    }

    private function normalizePhone(string $phone): string
    {
        $normalized = preg_replace('/[\s\-()]+/', '', $phone);

        return is_string($normalized) ? $normalized : '';
    }
}
