<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    protected $table = 'app_settings';

    protected $fillable = [
        'cycle',
        'days_remaining',
        'draw_date',
        'prize_name',
        'prize_value',
        'prize_image',
        'prize_images',
        'live_stream_url',
        'is_live',
        'registration_enabled',
        'ticket_selection_enabled',
        'winner_announcement_mode',
        'next_draw_date_en',
        'next_draw_date_am',
        'pot_value',
        'total_members',
        'cars_delivered',
        'trust_score',
    ];

    protected $casts = [
        'cycle' => 'integer',
        'days_remaining' => 'integer',
        'draw_date' => 'date',
        'prize_images' => 'array',
        'is_live' => 'boolean',
        'registration_enabled' => 'boolean',
        'ticket_selection_enabled' => 'boolean',
        'winner_announcement_mode' => 'boolean',
        'pot_value' => 'integer',
        'total_members' => 'integer',
        'cars_delivered' => 'integer',
        'trust_score' => 'integer',
    ];
}
