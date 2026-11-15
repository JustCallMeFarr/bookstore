<?php

use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReadController;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Facades\Route;

/*
| Semua route di sini otomatis berawalan /api
*/

// ---------- Publik ----------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/genres', [CategoryController::class, 'withBooks']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::post('/messages', [MessageController::class, 'store']);

// ---------- Harus login (token Sanctum) ----------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/books/{book}/read', [ReadController::class, 'show']); // baca online

    // Keranjang belanja
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{cart}', [CartController::class, 'update']);
    Route::delete('/cart/{cart}', [CartController::class, 'destroy']);

    // Checkout dan pesanan saya
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}/cancel', [OrderController::class, 'cancel']);

    // ---------- Khusus admin ----------
    Route::middleware(AdminOnly::class)->prefix('admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::post('/books', [BookController::class, 'store']);
        Route::match(['put', 'post'], '/books/{book}', [BookController::class, 'update']);
        Route::delete('/books/{book}', [BookController::class, 'destroy']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::get('/messages', [MessageController::class, 'index']);
        Route::put('/messages/{message}/read', [MessageController::class, 'markRead']);
    });
});
