<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecentActivity extends Model
{
    /** @use HasFactory<\Database\Factories\RecentActivityFactory> */
    use HasFactory;

    protected $table = 'recent_activities';

    protected $fillable = [
        'userId',
        'type',
        'status',
        'title_en',
        'title_am',
        'description_en',
        'description_am',
        'link',
        'cycle',
        'meta',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'cycle' => 'integer',
            'meta' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }

    /**
     * @return array{id:int|string, type:string, status:?string, title:array{en:string, am:string}, desc:array{en:string, am:string}, time:string, link:?string, cycle:?int, meta:?array}
     */
    public function toFrontendPayload(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'status' => $this->status,
            'title' => [
                'en' => $this->title_en,
                'am' => $this->title_am ?? $this->title_en,
            ],
            'desc' => [
                'en' => $this->description_en,
                'am' => $this->description_am ?? $this->description_en,
            ],
            'time' => ($this->occurred_at ?? $this->created_at)?->toIso8601String() ?? now()->toIso8601String(),
            'link' => $this->link,
            'cycle' => $this->cycle,
            'meta' => $this->meta,
        ];
    }
}
