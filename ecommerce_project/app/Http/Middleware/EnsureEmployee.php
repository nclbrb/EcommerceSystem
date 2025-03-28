<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmployee
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the authenticated user has the employee role
        if ($request->user() && $request->user()->role === 'employee') {
            return $next($request);
        }
        
        return response()->json(['error' => 'Unauthorized. Employees only.'], 403);
    }
}