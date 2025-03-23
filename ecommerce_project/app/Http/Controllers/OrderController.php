<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // List all checkout transactions
    public function index()
    {
        $orders = Order::with('orderDetails.product')->get();
        return response()->json($orders);
    }

    // View details of a specific checkout
    public function show(Order $order)
    {
        return response()->json($order->load('orderDetails.product'));
    }

    // Filter checkouts by date
    public function filterByDate($date)
    {
        $orders = Order::whereDate('created_at', $date)->with('orderDetails.product')->get();
        return response()->json($orders);
    }
}
