<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sermon extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'speaker',
        'date',
        'description',
        'video_url',
        'audio_url',
        'notes_url',
        'thumbnail_url',
    ];
}
