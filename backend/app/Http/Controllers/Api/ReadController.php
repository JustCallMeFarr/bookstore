<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Support\DemoBook;
use Illuminate\Http\Request;

class ReadController extends Controller
{
    // GET /api/books/{book}/read  (harus login)
    // Mengirim isi buku untuk halaman "Baca online".
    public function show(Request $request, Book $book)
    {
        if (!$book->ebook_file) {
            return response()->json(['message' => 'Buku ini belum punya versi baca online.'], 404);
        }

        // TODO (tahap pesanan): hanya user yang sudah membeli buku ini
        // (orders.type = 'read' dan payment_status = 'paid') yang boleh membaca.
        // Untuk sekarang, semua user yang sudah login boleh membaca.

        $meta = $book->only(['id', 'title', 'author']);

        // ebook_file = "demo" -> isi contoh (lorem ipsum) dibuat otomatis, beda tiap buku
        if ($book->ebook_file === 'demo') {
            return response()->json([
                'book'    => $meta,
                'type'    => 'text',
                'content' => DemoBook::generate($book->id, $book->title, $book->author),
            ]);
        }

        // Kalau isinya berupa link (misal PDF di internet), kirim link-nya saja
        if (str_starts_with($book->ebook_file, 'http')) {
            return response()->json(['book' => $meta, 'type' => 'url', 'url' => $book->ebook_file]);
        }

        // Kalau berupa file teks di storage/app/ebooks/
        // basename() mencegah orang meminta file di luar folder ebooks
        $path = storage_path('app/ebooks/' . basename($book->ebook_file));

        if (!is_file($path)) {
            return response()->json(['message' => 'File buku tidak ditemukan di server.'], 404);
        }

        return response()->json([
            'book'    => $meta,
            'type'    => 'text',
            'content' => file_get_contents($path),
        ]);
    }
}
