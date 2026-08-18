<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Additional attributes included when serializing the model.
     *
     * @var list<string>
     */
    protected $appends = ['has_password'];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'is_admin',
        'phoneNumber',
        'password',
        'telegram_id',
        'telegram_username',
        'telegram_photo_url',
        'language_code',
        'last_seen_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_seen_at' => 'datetime',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Whether the account is protected by a password, e.g. created
     * through the classic registration flow instead of Telegram.
     */
    protected function hasPassword(): Attribute
    {
        return Attribute::get(fn () => filled($this->attributes['password'] ?? null));
    }
}
