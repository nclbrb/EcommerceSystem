<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;


// Product Routes (CRUD)
Route::apiResource('products', ProductController::class);

// Order Routes
Route::get('orders', [OrderController::class, 'index']); // List all orders
Route::get('orders/{id}', [OrderController::class, 'show']); // View order details
Route::get('orders/filter/{date}', [OrderController::class, 'filterByDate']); // Filter orders by date

Route::post('cart/add', [CartController::class, 'addToCart']);  // Add to cart
Route::get('cart', [CartController::class, 'viewCart']);        // View cart items
Route::post('cart/checkout', [CartController::class, 'checkout']);  // Checkout process
Route::get('/search-products', [CartController::class, 'searchProducts']);