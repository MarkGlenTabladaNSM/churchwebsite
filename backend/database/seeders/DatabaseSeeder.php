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
        ]);

        // Treasurer user
        User::create([
            'name' => 'Treasurer User',
            'email' => 'treasurer@church.com',
            'password' => Hash::make('treasurer123'),
            'role' => 'treasurer',
            'api_token' => Str::random(60),
        ]);

        // Pastor user
        User::create([
            'name' => 'Pastor User',
            'email' => 'pastor@church.com',
            'password' => Hash::make('pastor123'),
            'role' => 'pastor',
            'api_token' => Str::random(60),
        ]);

        // Member user
        User::create([
            'name' => 'Member User',
            'email' => 'member@church.com',
            'password' => Hash::make('member123'),
            'role' => 'member',
            'api_token' => Str::random(60),
        ]);
    }
}
