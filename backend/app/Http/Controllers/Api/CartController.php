<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Cart;
use Illuminate\Http\Request;

// Keranjang belanja milik user yang sedang login.
// Satu baris tabel carts = satu buku + jumlahnya (qty).
class CartController extends Controller
{
    // GET /api/cart
    public function index(Request $request)
    {
        return response()->json($this->payload($request));
    }

    // POST /api/cart  {book_id, qty?}
    public function store(Request $request)
    {
        $data = $request->validate([
            'book_id' => 'required|exists:books,id',
            'qty'     => 'nullable|integer|min:1',
        ]);

        $book = Book::findOrFail($data['book_id']);

        if ($book->stock < 1) {
            return response()->json(['message' => 'Stok buku ini habis.'], 422);
        }

        // Buku sudah ada di keranjang? Tambahkan jumlahnya. Belum? Buat baris baru.
        $cart = Cart::firstOrNew([
            'user_id' => $request->user()->id,
            'book_id' => $book->id,
        ]);

        $wanted = ($cart->exists ? $cart->qty : 0) + ($data['qty'] ?? 1);
        $cart->qty = min($wanted, $book->stock); // tidak boleh melebihi stok
        $cart->save();

        $message = $wanted > $book->stock
            ? "Jumlah dibatasi sesuai stok ({$book->stock})."
            : 'Ditambahkan ke keranjang.';

        return response()->json($this->payload($request) + ['message' => $message], 201);
    }

    // PUT /api/cart/{cart}  {qty}
    public function update(Request $request, Cart $cart)
    {
        $this->authorizeOwner($request, $cart);

        $data = $request->validate(['qty' => 'required|integer|min:1']);

        $cart->update(['qty' => min($data['qty'], max($cart->book->stock, 1))]);

        return response()->json($this->payload($request));
    }

    // DELETE /api/cart/{cart}
    public function destroy(Request $request, Cart $cart)
    {
        $this->authorizeOwner($request, $cart);

        $cart->delete();

        return response()->json($this->payload($request));
    }

    // Keranjang orang lain tidak boleh disentuh
    private function authorizeOwner(Request $request, Cart $cart): void
    {
        abort_if($cart->user_id !== $request->user()->id, 403, 'Bukan keranjang kamu.');
    }

    // Isi keranjang + total, dipakai semua respons di atas
    private function payload(Request $request): array
    {
        $carts = Cart::with('book')
            ->where('user_id', $request->user()->id)
            ->orderBy('id')
            ->get();

        $items = $carts->map(fn ($c) => [
            'id'       => $c->id,
            'qty'      => $c->qty,
            'subtotal' => $c->qty * $c->book->price,
            'book'     => [
                'id'        => $c->book->id,
                'title'     => $c->book->title,
                'author'    => $c->book->author,
                'price'     => $c->book->price,
                'stock'     => $c->book->stock,
                'cover_url' => $c->book->cover_url,
            ],
        ])->values();

        return [
            'items' => $items,
            'count' => (int) $carts->sum('qty'),
            'total' => (int) $items->sum('subtotal'),
        ];
    }
}
