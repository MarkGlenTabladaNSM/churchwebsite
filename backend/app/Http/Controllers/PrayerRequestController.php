<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PrayerRequest;

class PrayerRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = null;
        
        // Let's manually check for token if auth is not populated
        if ($request->bearerToken()) {
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

        $user = null;
        if ($request->bearerToken()) {
            $user = \App\Models\User::where('api_token', $request->bearerToken())->first();
        }

        $prayerRequest = PrayerRequest::create([
            'user_id' => $user ? $user->id : null,
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
