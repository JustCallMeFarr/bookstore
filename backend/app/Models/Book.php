<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    protected $fillable = [
        'category_id', 'title', 'author', 'synopsis',
        'cover', 'price', 'stock', 'ebook_file',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
    ];

    // Ikut dikirim ke JSON: alamat lengkap cover
    protected $appends = ['cover_url'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Cover bisa berupa URL penuh (http...) atau path relatif (covers/x.svg, storage/...)
    public function getCoverUrlAttribute(): ?string
    {
        if (!$this->cover) {
            return null;
        }
        if (str_starts_with($this->cover, 'http')) {
            return $this->cover;
        }
        return url(ltrim($this->cover, '/'));
    }
}
