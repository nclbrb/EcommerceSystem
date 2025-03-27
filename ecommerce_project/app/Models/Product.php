<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'price', 'stock', 'image'];

    // A product can have many order details.
    public function orderDetails(): HasMany
    {
         return $this->hasMany(OrderDetail::class);
    }
}
