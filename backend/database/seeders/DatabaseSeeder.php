<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@church.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'api_token' => Str::random(60),
            'bio' => 'Church Administrator overseeing all operations.',
        ]);

        // Treasurer user
        User::create([
            'name' => 'John Treasurer',
            'email' => 'treasurer@church.com',
            'password' => Hash::make('treasurer123'),
            'role' => 'treasurer',
            'api_token' => Str::random(60),
            'bio' => 'Managing church finances with integrity.',
            'facebook_url' => 'https://facebook.com/johntreasurer',
            'telegram_url' => 'https://t.me/johntreasurer',
        ]);

        // Pastor user
        User::create([
            'name' => 'Pastor Sam',
            'email' => 'pastor@church.com',
            'password' => Hash::make('pastor123'),
            'role' => 'pastor',
            'api_token' => Str::random(60),
            'bio' => 'Dedicated to spiritual growth and community care.',
            'twitter_url' => 'https://twitter.com/pastorsam',
            'facebook_url' => 'https://facebook.com/pastorsam',
        ]);

        // Member user
        User::create([
            'name' => 'Alice Member',
            'email' => 'member@church.com',
            'password' => Hash::make('member123'),
            'role' => 'member',
            'api_token' => Str::random(60),
            'bio' => 'Active choir member and youth mentor.',
            'facebook_url' => 'https://facebook.com/alicemember',
            'telegram_url' => 'https://t.me/alicemember',
            'twitter_url' => 'https://twitter.com/alicemember',
        ]);
    }
}
