<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SystemLog;

class SystemLogController extends Controller
{
    public function index() {
        return response()->json(SystemLog::with('user')->latest()->take(50)->get());
    }
}
