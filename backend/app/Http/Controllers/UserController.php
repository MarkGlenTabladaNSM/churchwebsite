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
        $request->validate(['role' => 'required|in:admin,treasurer,member']);
        $user->update(['role' => $request->role]);
        return response()->json($user);
    }
}
