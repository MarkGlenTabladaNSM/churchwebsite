<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index() {
        return response()->json(Transaction::latest('date')->get());
    }

    public function store(Request $request) {
        $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric',
            'description' => 'required|string',
            'date' => 'required|date'
        ]);

        $transaction = Transaction::create([
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
            'date' => $request->date,
            'user_id' => Auth::id()
        ]);

        return response()->json($transaction, 201);
    }

    public function balance() {
        $income = Transaction::where('type', 'income')->sum('amount');
        $expenses = Transaction::where('type', 'expense')->sum('amount');
        
        return response()->json([
            'income' => $income,
            'expenses' => $expenses,
            'balance' => $income - $expenses
        ]);
    }
}
