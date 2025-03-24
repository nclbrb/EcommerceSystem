<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'stock', 'image'];

    public function orderDetails(): BelongsToMany
    {
        return $this->belongsToMany(OrderDetail::class, 'product_id');
    }
}
