<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    // Status pesanan, berurutan dari awal sampai akhir
    public const STATUSES = ['pending', 'processed', 'shipped', 'done', 'cancelled'];

    protected $fillable = [
        'user_id', 'type', 'total', 'status',
        'address', 'payment_status', 'midtrans_order_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Kembalikan stok semua buku di pesanan ini (dipakai saat pesanan dibatalkan)
    public function restoreStock(): void
    {
        foreach ($this->items()->with('book')->get() as $item) {
            if ($item->book) {
                $item->book->increment('stock', $item->qty);
            }
        }
    }

    // Bentuk JSON yang dikirim ke frontend
    public function toApi(bool $withUser = false): array
    {
        $this->loadMissing('items.book');

        $data = [
            'id'             => $this->id,
            'type'           => $this->type,
            'total'          => (int) $this->total,
            'status'         => $this->status,
            'payment_status' => $this->payment_status,
            'address'        => $this->address,
            'created_at'     => $this->created_at,
            'items'          => $this->items->map(fn ($i) => [
                'id'       => $i->id,
                'qty'      => $i->qty,
                'price'    => $i->price,
                'subtotal' => $i->qty * $i->price,
                'book'     => $i->book ? [
                    'id'        => $i->book->id,
                    'title'     => $i->book->title,
                    'author'    => $i->book->author,
                    'cover_url' => $i->book->cover_url,
                ] : null,
            ])->values(),
        ];

        if ($withUser) {
            $this->loadMissing('user');
            $data['user'] = [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email,
            ];
        }

        return $data;
    }
}
