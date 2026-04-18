<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index() {
        return response()->json(User::all());
    }

    public function updateRole(Request $request, User $user) {
        $request->validate(['role' => 'required|in:admin,treasurer,pastor,member']);
        $user->update(['role' => $request->role]);
        return response()->json($user);
    }

    public function directory() {
        return response()->json(User::where('role', '!=', 'admin')->get());
    }

    public function updateProfile(Request $request) {
        $user = $request->user();
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'profile_photo' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'telegram_url' => 'nullable|url',
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validatedData);
        return response()->json($user);
    }
}
