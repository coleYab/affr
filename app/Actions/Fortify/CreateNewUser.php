<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\RecentActivity;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => $this->nameRules(),
            'phoneNumber' => $this->phoneNumberRules(),
            'terms' => ['accepted'],
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $this->generateUniqueEmail(),
            'phoneNumber' => $input['phoneNumber'],
            'password' => $input['password'],
        ]);

        RecentActivity::query()->create([
            'userId' => $user->id,
            'type' => 'JOINED',
            'status' => 'success',
            'title_en' => 'Account created',
            'title_am' => null,
            'description_en' => 'Welcome! Your membership is active.',
            'description_am' => null,
            'link' => null,
            'cycle' => null,
            'meta' => null,
            'occurred_at' => now(),
        ]);

        return $user;
    }

    private function generateUniqueEmail(): string
    {
        do {
            $email = sprintf('user_%s@placeholder.local', Str::lower(Str::random(32)));
        } while (User::query()->where('email', $email)->exists());

        return $email;
    }
}
