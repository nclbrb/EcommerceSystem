<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\EnsureEmployee;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| These routes can be accessed without authentication. Customers can
| browse products and search the catalog.
|
*/

// Browse products
Route::get('products', [ProductController::class, 'index']);

// Search for products
Route::get('search-products', [CartController::class, 'searchProducts']);

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Endpoints for user registration and login to issue Sanctum tokens.
|
*/
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Customer Routes (Authenticated)
|--------------------------------------------------------------------------
|
| These endpoints require users to be authenticated via Sanctum. Customers
| can add items to their cart, view their cart, and perform a checkout.
|
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('cart/add', [CartController::class, 'addToCart']);
    Route::get('cart', [CartController::class, 'viewCart']);
    Route::post('cart/checkout', [CartController::class, 'checkout']);
});

/*
|--------------------------------------------------------------------------
| Employee Routes (Authenticated & Employee Role)
|--------------------------------------------------------------------------
|
| These endpoints are restricted to authenticated users with the employee
| role, enforced by the custom EnsureEmployee middleware. Employees can manage
| products and monitor checkout orders.
|
*/
Route::middleware(['auth:sanctum', EnsureEmployee::class])->group(function () {
    // Product Management (Create, Update, Delete). The index route is public.
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Optionally, if you want employees to also view product details:
    // Route::get('products/{id}', [ProductController::class, 'show']);

    // Checkout Monitoring
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::get('orders/filter/{date}', [OrderController::class, 'filterByDate']);
});