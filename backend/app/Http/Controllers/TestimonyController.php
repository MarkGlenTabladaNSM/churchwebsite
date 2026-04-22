<?php

namespace App\Http\Controllers;

use App\Models\Testimony;
use Illuminate\Http\Request;

class TestimonyController extends Controller
{
    public function index()
    {
        return Testimony::with('user')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'author_name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $testimony = Testimony::create([
            'user_id' => auth('sanctum')->id(),
            'author_name' => $validated['author_name'],
            'content' => $validated['content'],
        ]);

        return $testimony;
    }

    public function incrementAmen($id)
    {
        $testimony = Testimony::findOrFail($id);
        $testimony->increment('amen_count');
        return $testimony;
    }

    public function destroy(Testimony $testimony)
    {
        $testimony->delete();
        return response()->noContent();
    }
}
