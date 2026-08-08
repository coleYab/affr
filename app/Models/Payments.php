<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    use HasFactory;

    protected $fillable = [
        'userId',
        'userName',
        'userPhone',
        'amount',
        'receiptUrl',
        'requestedTicket',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
