<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;


// Registers API endpoints for products (CRUD)
Route::apiResource('products', ProductController::class);
