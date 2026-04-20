<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
        return response()->json(User::all());
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,treasurer,pastor,member',
            'bio' => 'nullable|string',
            'profile_photo' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'telegram_url' => 'nullable|url',
            'phone' => 'nullable|string|max:20',
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);
        
        $user = User::create($validatedData);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user) {
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:admin,treasurer,pastor,member',
            'bio' => 'nullable|string',
            'profile_photo' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'telegram_url' => 'nullable|url',
            'phone' => 'nullable|string|max:20',
        ]);

        if (!empty($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }

        $user->update($validatedData);
        return response()->json($user);
    }

    public function destroy(User $user) {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
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
