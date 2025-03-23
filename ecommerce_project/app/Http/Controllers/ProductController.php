<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET /products - List all products
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // POST /products - Create a new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|string',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    // GET /products/{product} - Show details of a specific product
    public function show(Product $product)
    {
        return response()->json($product);
    }

    // PUT/PATCH /products/{product} - Update a product
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price'       => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
            'image'       => 'nullable|string',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    // DELETE /products/{product} - Delete a product
    public function destroy(Product $product)
    {
        // currently comment to show that you can in fact delete a product
        // Prevent deletion if product is associated with any orders
        // if ($product->orders()->exists()) {
        //     return response()->json([
        //         'error' => 'Product cannot be deleted because it’s already in an order.'
        //     ], 403);
        // }

        $product->delete();
        return response()->json(null, 204);
    }
}
