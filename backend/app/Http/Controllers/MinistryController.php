<?php

namespace App\Http\Controllers;

use App\Models\Ministry;
use Illuminate\Http\Request;

class MinistryController extends Controller
{
    public function index()
    {
        return Ministry::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'leader_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'image_url' => 'nullable|url',
        ]);

        return Ministry::create($validated);
    }

    public function show(Ministry $ministry)
    {
        return $ministry;
    }

    public function update(Request $request, Ministry $ministry)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'leader_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'image_url' => 'nullable|url',
        ]);

        $ministry->update($validated);
        return $ministry;
    }

    public function destroy(Ministry $ministry)
    {
        $ministry->delete();
        return response()->noContent();
    }
}
