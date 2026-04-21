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
use App\Http\Controllers\PrayerRequestController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/project-plans', [ProjectPlanController::class, 'index']);
Route::get('/members', [UserController::class, 'directory']);

// Prayer Requests
Route::get('/prayer-requests', [PrayerRequestController::class, 'index']);
Route::post('/prayer-requests/{id}/pray', [PrayerRequestController::class, 'incrementPray']);

// Protected routes
Route::middleware('token.auth')->group(function () {
    Route::post('/prayer-requests', [PrayerRequestController::class, 'store']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'updateRole']);
        Route::get('/logs', [SystemLogController::class, 'index']);
    });
    
    // Admin & Pastor routes
    Route::middleware('role:admin,pastor')->group(function () {
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);
        
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);
    });
    
    // Transaction Read Access (Admin, Treasurer, Pastor)
    Route::group(['middleware' => ['role:admin,treasurer,pastor']], function () {
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::get('/transactions/balance', [TransactionController::class, 'balance']);
    });

    // Treasurer & Admin routes (Write)
    Route::group(['middleware' => ['role:admin,treasurer']], function () {
        Route::post('/transactions', [TransactionController::class, 'store']);
    });

    // Project Plans management routes
    Route::middleware('role:treasurer,admin,pastor')->group(function () {
        Route::post('/project-plans', [ProjectPlanController::class, 'store']);
        Route::put('/project-plans/{id}/add-amount', [ProjectPlanController::class, 'addAmount']);
    });
});
