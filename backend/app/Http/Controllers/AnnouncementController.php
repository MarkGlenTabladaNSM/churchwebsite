<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index() {
        return response()->json(Announcement::latest('date')->get());
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'date' => 'required|date'
        ]);

        $announcement = Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'date' => $request->date,
            'created_by' => $request->user()->id
        ]);

        return response()->json($announcement, 201);
    }

    public function update(Request $request, Announcement $announcement) {
        $announcement->update($request->only(['title', 'content', 'date']));
        return response()->json($announcement);
    }

    public function destroy(Announcement $announcement) {
        $announcement->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
