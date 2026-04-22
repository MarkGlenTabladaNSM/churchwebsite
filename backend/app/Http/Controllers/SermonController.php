<?php

namespace App\Http\Controllers;

use App\Models\Sermon;
use Illuminate\Http\Request;

class SermonController extends Controller
{
    public function index()
    {
        return Sermon::orderBy('date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'speaker' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'video_url' => 'nullable|url',
            'audio_url' => 'nullable|url',
            'notes_url' => 'nullable|url',
            'thumbnail_url' => 'nullable|url',
        ]);

        return Sermon::create($validated);
    }

    public function show(Sermon $sermon)
    {
        return $sermon;
    }

    public function update(Request $request, Sermon $sermon)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'speaker' => 'string|max:255',
            'date' => 'date',
            'description' => 'nullable|string',
            'video_url' => 'nullable|url',
            'audio_url' => 'nullable|url',
            'notes_url' => 'nullable|url',
            'thumbnail_url' => 'nullable|url',
        ]);

        $sermon->update($validated);
        return $sermon;
    }

    public function destroy(Sermon $sermon)
    {
        $sermon->delete();
        return response()->noContent();
    }
}
