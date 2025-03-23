<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

// Product Routes (CRUD)
Route::apiResource('products', ProductController::class);

// Order Routes
Route::get('orders', [OrderController::class, 'index']); // List all orders
Route::get('orders/{order}', [OrderController::class, 'show']); // View order details
Route::get('orders/filter/{date}', [OrderController::class, 'filterByDate']); // Filter orders by date
