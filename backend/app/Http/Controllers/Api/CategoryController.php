<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    // GET /api/categories  (publik)
    public function index()
    {
        return Category::withCount('books')->orderBy('name')->get();
    }

    // GET /api/genres  (publik): semua genre + buku-bukunya, dipakai landing page
    public function withBooks()
    {
        return Category::with(['books' => fn ($q) => $q->orderBy('title')])
            ->orderBy('name')
            ->get();
    }

    // POST /api/admin/categories
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ]);

        return response()->json($category, 201);
    }

    // PUT /api/admin/categories/{category}
    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($category->id)],
        ]);

        $category->update([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ]);

        return $category;
    }

    // DELETE /api/admin/categories/{category}
    public function destroy(Category $category)
    {
        $category->delete(); // buku di kategori ini ikut terhapus (cascade)

        return response()->json(['message' => 'Kategori dihapus.']);
    }
}
