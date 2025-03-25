<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // List all orders
    public function index()
    {
        $orders = Order::with('orderDetails.product')->get();
        return response()->json($orders);
    }

    // Show details of a specific order
    public function show(Order $order)
    {
        return response()->json($order->load('orderDetails.product'));
    }

    // Checkout process
    public function checkout(Request $request)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $total_price = 0;

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Validate stock
            foreach ($cart as $product_id => $item) {
                $product = Product::findOrFail($product_id);

                if ($product->stock < $item['quantity']) {
                    DB::rollBack(); // Rollback changes if stock is insufficient
                    return response()->json(['error' => "Insufficient stock for {$product->name}"], 400);
                }

                $total_price += $item['price'] * $item['quantity'];
            }

            // Create order
            $order = Order::create([
                'user_id' => $request->user()->id, // Ensure the user is authenticated
                'total_price' => $total_price,
                'status' => 'pending',
                'checkout_date' => now()
            ]);

            // Store order details and deduct stock
            foreach ($cart as $product_id => $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product_id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);

                // Deduct stock
                Product::where('id', $product_id)->decrement('stock', $item['quantity']);
            }

            // Clear cart after successful checkout
            session()->forget('cart');

            DB::commit(); // Commit transaction

            return response()->json(['message' => 'Order placed successfully', 'order' => $order]);

        } catch (\Exception $e) {
            DB::rollBack(); // Rollback changes if an error occurs
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    // Filter orders by date
    public function filterByDate($date)
    {
        $orders = Order::whereDate('created_at', $date)->with('orderDetails.product')->get();
        return response()->json($orders);
    }
}
