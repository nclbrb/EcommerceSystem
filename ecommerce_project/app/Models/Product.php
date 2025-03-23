<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image'
    ];

    // If your product is linked to orders, you might have a relationship.
    // Adjust this relationship as needed.
    public function orders()
    {
        return $this->belongsToMany(Order::class);
    }
}
