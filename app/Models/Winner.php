<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Winner extends Model
{
    /** @use HasFactory<\Database\Factories\WinnerFactory> */
    use HasFactory;

    protected $fillable = [
        'cycle',
        'place',
        'user_id',
        'ticket_id',
        'prize_name',
        'prize_amount',
        'announced_at',
    ];

    protected function casts(): array
    {
        return [
            'cycle' => 'integer',
            'place' => 'integer',
            'prize_amount' => 'integer',
            'announced_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
