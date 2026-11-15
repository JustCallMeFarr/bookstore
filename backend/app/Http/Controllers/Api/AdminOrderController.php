<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

// Daftar dan pengelolaan pesanan dari semua user (khusus admin).
class AdminOrderController extends Controller
{
    // GET /api/admin/orders
    public function index()
    {
        return Order::with(['items.book', 'user'])
            ->orderByDesc('id')
            ->get()
            ->map(fn ($order) => $order->toApi(true));
    }

    // PUT /api/admin/orders/{order}/status  {status}
    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(Order::STATUSES)],
        ]);

        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Pesanan yang sudah dibatalkan tidak bisa diubah.'], 422);
        }

        DB::transaction(function () use ($order, $data) {
            // Dibatalkan -> stok buku dikembalikan
            if ($data['status'] === 'cancelled') {
                $order->restoreStock();
            }

            $order->update([
                'status'         => $data['status'],
                // Bayar di tempat: dianggap lunas saat pesanan selesai (barang sudah diterima)
                'payment_status' => $data['status'] === 'done' ? 'paid' : 'unpaid',
            ]);
        });

        return $order->toApi(true);
    }
}
