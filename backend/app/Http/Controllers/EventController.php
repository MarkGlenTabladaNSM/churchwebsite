<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index() {
        return response()->json(Event::latest('date')->get());
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'image' => 'nullable|image|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $imagePath = url('/storage/' . $path);
        }

        $event = Event::create([
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'image' => $imagePath,
            'created_by' => $request->user()->id
        ]);

        return response()->json($event, 201);
    }

    public function update(Request $request, Event $event) {
        $event->update($request->only(['title', 'description', 'date']));
        return response()->json($event);
    }

    public function destroy(Event $event) {
        $event->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
