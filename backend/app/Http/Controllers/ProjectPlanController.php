<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProjectPlanController extends Controller
{
    public function index()
    {
        $plans = \App\Models\ProjectPlan::orderBy('created_at', 'desc')->get();
        return response()->json($plans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'target_amount' => 'required|numeric|min:1',
        ]);

        $plan = \App\Models\ProjectPlan::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'target_amount' => $validated['target_amount'],
            'current_amount' => 0,
        ]);

        return response()->json($plan, 201);
    }

    public function addAmount(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $plan = \App\Models\ProjectPlan::findOrFail($id);
        $plan->current_amount += $validated['amount'];
        $plan->save();

        return response()->json($plan);
    }
}
