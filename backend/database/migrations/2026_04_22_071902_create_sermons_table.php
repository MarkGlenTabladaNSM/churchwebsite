<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sermons', function (Blueprint $name) {
            $name->id();
            $name->string('title');
            $name->string('speaker');
            $name->date('date');
            $name->text('description')->nullable();
            $name->string('video_url')->nullable();
            $name->string('audio_url')->nullable();
            $name->string('notes_url')->nullable();
            $name->string('thumbnail_url')->nullable();
            $name->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sermons');
    }
};
