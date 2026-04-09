<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SystemLogController;
use App\Http\Controllers\ProjectPlanController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/project-plans', [ProjectPlanController::class, 'index']);

// Protected routes
Route::middleware('token.auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::put('/users/{user}', [UserController::class, 'updateRole']);
        Route::get('/logs', [SystemLogController::class, 'index']);
        
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);
        
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);
    });
    
    // Treasurer & Admin routes
    Route::group(['middleware' => ['role:admin,treasurer']], function () {
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::get('/transactions/balance', [TransactionController::class, 'balance']);
    });

    // Treasurer only routes
    Route::middleware('role:treasurer')->group(function () {
        Route::post('/project-plans', [ProjectPlanController::class, 'store']);
        Route::put('/project-plans/{id}/add-amount', [ProjectPlanController::class, 'addAmount']);
    });
});
