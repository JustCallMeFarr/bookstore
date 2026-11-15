<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Pesanan milik user yang sedang login.
class OrderController extends Controller
{
    // GET /api/orders: riwayat pesanan saya
    public function index(Request $request)
    {
        return Order::with('items.book')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->get()
            ->map(fn ($order) => $order->toApi());
    }

    // GET /api/orders/{order}
    public function show(Request $request, Order $order)
    {
        $this->authorizeOwner($request, $order);

        return $order->toApi();
    }

    // POST /api/orders: checkout. Isi keranjang diubah jadi pesanan.
    public function store(Request $request)
    {
        $data = $request->validate([
            'recipient' => 'required|string|max:100',
            'phone'     => 'required|string|max:30',
            'address'   => 'required|string|min:10|max:500',
        ]);

        $user = $request->user();

        // Semua langkah di dalam transaction: kalau satu gagal, semuanya dibatalkan
        $order = DB::transaction(function () use ($user, $data) {
            $carts = Cart::where('user_id', $user->id)->get();

            if ($carts->isEmpty()) {
                abort(422, 'Keranjang masih kosong.');
            }

            // 1. Cek stok dan hitung total (baris buku dikunci supaya stok tidak "balapan")
            $total = 0;
            foreach ($carts as $cart) {
                $book = Book::lockForUpdate()->find($cart->book_id);

                if (!$book || $book->stock < $cart->qty) {
                    $left = $book ? $book->stock : 0;
                    $title = $book ? $book->title : 'buku';
                    abort(422, "Stok \"{$title}\" tidak cukup (tersisa {$left}). Ubah jumlahnya di keranjang.");
                }

                $total += $cart->qty * $book->price;
            }

            // 2. Buat pesanan. Pembayaran: bayar di tempat, jadi status bayar "unpaid"
            //    dan otomatis "paid" saat admin menandai pesanan selesai.
            $order = Order::create([
                'user_id'        => $user->id,
                'type'           => 'delivery',
                'total'          => $total,
                'status'         => 'pending',
                'payment_status' => 'unpaid',
                'address'        => "Penerima: {$data['recipient']}\nTelepon: {$data['phone']}\nAlamat: {$data['address']}",
            ]);

            // 3. Salin tiap item keranjang ke order_items (harga dicatat saat ini) lalu kurangi stok
            foreach ($carts as $cart) {
                $book = Book::find($cart->book_id);

                OrderItem::create([
                    'order_id' => $order->id,
                    'book_id'  => $book->id,
                    'qty'      => $cart->qty,
                    'price'    => $book->price,
                ]);

                $book->decrement('stock', $cart->qty);
            }

            // 4. Kosongkan keranjang
            Cart::where('user_id', $user->id)->delete();

            return $order;
        });

        return response()->json($order->toApi(), 201);
    }

    // PUT /api/orders/{order}/cancel: hanya untuk pesanan yang masih "pending"
    public function cancel(Request $request, Order $order)
    {
        $this->authorizeOwner($request, $order);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Pesanan yang sudah diproses tidak bisa dibatalkan.'], 422);
        }

        DB::transaction(function () use ($order) {
            $order->restoreStock();
            $order->update(['status' => 'cancelled']);
        });

        return $order->toApi();
    }

    // Pesanan orang lain tidak boleh dilihat atau diubah
    private function authorizeOwner(Request $request, Order $order): void
    {
        abort_if($order->user_id !== $request->user()->id, 403, 'Bukan pesanan kamu.');
    }
}
