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
            // Make stock optional and default to 0 if not provided.
            'stock'       => 'sometimes|integer|min:0',
            'image'       => 'nullable|string',
        ]);

        // Set default stock if not provided
        if (!isset($validated['stock'])) {
            $validated['stock'] = 0;
        }

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
            // Make stock optional for updates as well
            'stock'       => 'sometimes|integer|min:0',
            'image'       => 'nullable|string',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    // DELETE /products/{product} - Delete a product
    public function destroy(Product $product)
    {
        // Uncomment or adjust this check if needed.
        // if ($product->orders()->exists()) {
        //     return response()->json([
        //         'error' => 'Product cannot be deleted because it’s already in an order.'
        //     ], 403);
        // }

        $product->delete();
        return response()->json(null, 204);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        $products = Product::where('name', 'LIKE', "%$query%")
            ->orWhere('description', 'LIKE', "%$query%")
            ->get();

        return response()->json($products);
    }
}
