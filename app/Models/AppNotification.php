<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppNotification extends Model
{
    use HasFactory;

    protected $table = 'app_notifications';

    protected $fillable = [
        'target_user_id',
        'title_en',
        'title_am',
        'message_en',
        'message_am',
        'link',
        'is_urgent',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'is_urgent' => 'boolean',
            'sent_at' => 'datetime',
        ];
    }
}
