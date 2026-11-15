<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // GET /api/books?q=kata&category_id=1&per_page=12  (publik)
    public function index(Request $request)
    {
        $query = Book::with('category')->orderBy('title');

        if ($q = $request->query('q')) {
            $query->where(function ($w) use ($q) {
                $w->where('title', 'like', "%{$q}%")
                  ->orWhere('author', 'like', "%{$q}%");
            });
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // kalau per_page dikirim -> paginasi, kalau tidak -> semua data
        if ($perPage = $request->query('per_page')) {
            return $query->paginate((int) $perPage);
        }

        return $query->get();
    }

    // GET /api/books/{book}  (publik)
    public function show(Book $book)
    {
        return $book->load('category');
    }

    // POST /api/admin/books
    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data = $this->handleCover($request, $data);

        $book = Book::create($data);

        return response()->json($book->load('category'), 201);
    }

    // PUT atau POST /api/admin/books/{book}  (POST dipakai kalau upload file)
    public function update(Request $request, Book $book)
    {
        $data = $this->validated($request);
        $data = $this->handleCover($request, $data);

        $book->update($data);

        return $book->load('category');
    }

    // DELETE /api/admin/books/{book}
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(['message' => 'Buku dihapus.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:150',
            'synopsis'    => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'ebook_file'  => 'nullable|string|max:255',
            'cover'       => 'nullable|string|max:255',          // URL cover
            'cover_file'  => 'nullable|image|max:2048',          // atau upload gambar (maks 2 MB)
        ]);
    }

    // Kalau ada file cover diupload, simpan ke storage/app/public/covers dan pakai path-nya
    private function handleCover(Request $request, array $data): array
    {
        if ($request->hasFile('cover_file')) {
            $path = $request->file('cover_file')->store('covers', 'public');
            $data['cover'] = 'storage/' . $path;
        }
        unset($data['cover_file']);

        return $data;
    }
}
