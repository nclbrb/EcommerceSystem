<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class CartController extends Controller
{
    // Add item to cart
    public function addToCart(Request $request)
    {
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1'
    ]);

    $product = Product::findOrFail($request->product_id);

    // Prevent adding to cart if stock is empty
    if ($product->stock <= 0) {
        return response()->json(['error' => 'This product is out of stock'], 400);
    }

    // Prevent adding more than available stock
    if ($product->stock < $request->quantity) {
        return response()->json(['error' => 'Not enough stock available'], 400);
    }

    $cart = Session::get('cart', []);

    $found = false;
    foreach ($cart as &$item) {
        if ($item['product_id'] === $product->id) {
            $newQuantity = $item['quantity'] + $request->quantity;

            if ($newQuantity > $product->stock) {
                return response()->json(['error' => 'Not enough stock available'], 400);
            }

            $item['quantity'] = $newQuantity;
            $item['total_price'] = $item['price'] * $newQuantity;
            $found = true;
            break;
        }
    }

    if (!$found) {
        $cart[] = [
            'product_id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'quantity' => $request->quantity,
            'total_price' => $product->price * $request->quantity
        ];
    }

    Session::put('cart', $cart);

    return response()->json([
        'message' => 'Item added to cart successfully',
        'cart' => array_values($cart)
    ]);
    }


    public function checkout(Request $request)
    {
    $cart = Session::get('cart', []);

    if (empty($cart)) {
        return response()->json(['error' => 'Cart is empty'], 400);
    }

    $userId = Auth::id() ?? 1; // Ensure a valid user ID

    if (!is_numeric($userId)) {
        return response()->json(['error' => 'Invalid user ID'], 400);
    }

    $totalPrice = array_reduce($cart, function ($sum, $item) {
        return $sum + ($item['price'] * $item['quantity']);
    }, 0);

    if (!is_numeric($totalPrice) || $totalPrice <= 0) {
        return response()->json(['error' => 'Invalid total price calculation'], 400);
    }

    try {
        DB::beginTransaction(); 
        $order = Order::create([
            'user_id' => $userId,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'checkout_date' => now()
        ]);

        foreach ($cart as $item) {
            $product = Product::find($item['product_id']);

            if (!$product) {
                DB::rollBack();
                return response()->json(['error' => 'Product not found'], 400);
            }

            if ($product->stock < $item['quantity']) {
                DB::rollBack();
                return response()->json(['error' => 'Stock issue during checkout'], 400);
            }

            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);

            $product->stock -= $item['quantity'];
            $product->save();
        }

        Session::forget('cart'); 

        DB::commit(); 

        return response()->json([
            'message' => 'Checkout successful',
            'order' => $order
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Checkout failed: ' . $e->getMessage()], 500);
    }
    }

    // Search producrs function
    public function searchProducts(Request $request)
{
    $request->validate([
        'query' => 'required|string|min:2'
    ]);

    $query = $request->query('query');

    $products = Product::where('name', 'LIKE', "%{$query}%")
        ->orWhere('description', 'LIKE', "%{$query}%")
        ->get();

    if ($products->isEmpty()) {
        return response()->json(['message' => 'No products found'], 404);
    }

    return response()->json($products);
}


}
