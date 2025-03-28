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
            'image'       => 'nullable|image|max:2048', // Validate the image file if provided
        ]);

        // Check if an image file was uploaded
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Generate a unique file name (using current timestamp)
            $filename = time() . '_' . $file->getClientOriginalName();
            // Move the file to public/images directory
            $file->move(public_path('images'), $filename);
            // Store the file path relative to public folder
            $validated['image'] = '/images/' . $filename;
        } else {
            // Set default image path if no file is uploaded
            $validated['image'] = '/images/default.png';
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
            'stock'       => 'sometimes|required|integer|min:0',
            'image'       => 'nullable|image|max:2048', // Validate the image file if provided
        ]);

        // Check if a new image file is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image file if it exists and is not the default image
            if ($product->image && $product->image != '/images/default.png') {
                $oldImagePath = public_path($product->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images'), $filename);
            $validated['image'] = '/images/' . $filename;
        }

        $product->update($validated);
        return response()->json($product);
    }

    // DELETE /products/{product} - Delete a product
    public function destroy(Product $product)
    {
        // Optionally prevent deletion if product is associated with any orders
        // if ($product->orders()->exists()) {
        //     return response()->json([
        //         'error' => 'Product cannot be deleted because it’s already in an order.'
        //     ], 403);
        // }

        // Delete the image file if exists and it's not the default image
        if ($product->image && $product->image != '/images/default.png') {
            $imagePath = public_path($product->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $product->delete();
        return response()->json(null, 204);
    }

    // GET /products/search - Search for products by name or description
    public function search(Request $request)
    {
        $query = $request->input('query');

        $products = Product::where('name', 'LIKE', "%$query%")
            ->orWhere('description', 'LIKE', "%$query%")
            ->get();

        return response()->json($products);
    }
}
