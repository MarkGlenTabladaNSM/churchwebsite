<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrayerRequest extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'is_public',
        'pray_count',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'pray_count' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
