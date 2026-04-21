<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PrayerRequest;

class PrayerRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user('sanctum') ?? \Illuminate\Support\Facades\Auth::user(); 
        
        // Let's manually check for token if auth is not populated
        if (!$user && $request->bearerToken()) {
            $user = \App\Models\User::where('api_token', $request->bearerToken())->first();
        }

        $query = PrayerRequest::with('user:id,name,profile_photo')->orderBy('created_at', 'desc');

        if ($user && in_array($user->role, ['admin', 'pastor'])) {
            // Pastors and Admins see all requests
            return response()->json($query->get());
        }

        if ($user) {
            // Logged in user sees public requests + their own private requests
            $query->where(function($q) use ($user) {
                $q->where('is_public', true)
                  ->orWhere('user_id', $user->id);
            });
        } else {
            // Guests only see public requests
            $query->where('is_public', true);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'is_public' => 'boolean',
        ]);

        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user && $request->bearerToken()) {
            $user = \App\Models\User::where('api_token', $request->bearerToken())->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $prayerRequest = PrayerRequest::create([
            'user_id' => $user->id,
            'content' => $request->content,
            'is_public' => $request->has('is_public') ? $request->is_public : true,
        ]);

        $prayerRequest->load('user:id,name,profile_photo');

        return response()->json($prayerRequest, 201);
    }

    public function incrementPray($id)
    {
        $prayerRequest = PrayerRequest::findOrFail($id);
        $prayerRequest->increment('pray_count');
        
        return response()->json([
            'message' => 'Pray count incremented',
            'pray_count' => $prayerRequest->pray_count
        ]);
    }
}
