<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // List all orders with related order details and user data
    public function index()
    {
        // Load both orderDetails.product and user relationship
        $orders = Order::with('orderDetails.product', 'user')->get();
        return response()->json($orders);
    }

    // Show details of a specific order
    public function show(Order $order)
    {
        return response()->json($order->load('orderDetails.product', 'user'));
    }

    // Checkout process
    public function checkout(Request $request)
    {
        $cart = $request->input('cart', []);

        if (empty($cart)) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $total_price = 0;
        DB::beginTransaction();

        try {
            $orderDetails = [];
            foreach ($cart as $item) {
                if (!isset($item['product_id'], $item['quantity'], $item['price'])) {
                    DB::rollBack();
                    return response()->json(['error' => 'Invalid cart data'], 400);
                }
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'error' => "Insufficient stock for {$product->name}"
                    ], 400);
                }
                $total_price += floatval($item['price']) * intval($item['quantity']);
                $orderDetails[] = [
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price']
                ];
                $product->decrement('stock', $item['quantity']);
            }

            $order = Order::create([
                'user_id'       => $request->user()->id,
                'customer_name' => $request->user()->name,
                'total_price'   => $total_price,
                'status'        => 'pending',
                'checkout_date' => now(),
            ]);

            foreach ($orderDetails as &$detail) {
                $detail['order_id'] = $order->id;
            }
            OrderDetail::insert($orderDetails);

            // Refresh the order so that newly inserted details are loaded
            $order->refresh();
            $order->load('orderDetails.product', 'user');

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order'   => $order
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    // Filter orders by date
    public function filterByDate($date)
    {
        $orders = Order::whereDate('created_at', $date)
            ->with('orderDetails.product', 'user')
            ->get();
        return response()->json($orders);
    }
}
