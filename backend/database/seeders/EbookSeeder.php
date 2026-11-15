<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

// Seeder AMAN: hanya mengisi kolom ebook_file. Tidak menghapus atau mengubah data lain.
// Jalankan: php artisan db:seed --class=EbookSeeder
//
//  - 2 buku sampel asli (domain publik) memakai file teks di storage/app/ebooks
//  - SEMUA buku lain yang belum punya ebook_file diisi "demo" (isi lorem ipsum otomatis)
// Buku yang ebook_file-nya sudah kamu isi sendiri tidak diubah.
class EbookSeeder extends Seeder
{
    public function run(): void
    {
        $samples = [
            "Alice's Adventures in Wonderland" => 'ebooks/alices-adventures-in-wonderland.txt',
            'The Art of War'                   => 'ebooks/the-art-of-war.txt',
        ];

        foreach ($samples as $title => $file) {
            $updated = Book::where('title', $title)->update(['ebook_file' => $file]);
            $this->command->info(($updated ? 'OK     ' : 'TIDAK DITEMUKAN ') . $title);
        }

        $demo = Book::where(function ($q) {
            $q->whereNull('ebook_file')->orWhere('ebook_file', '');
        })->update(['ebook_file' => 'demo']);

        $this->command->info("{$demo} buku lain diisi ebook contoh (lorem ipsum).");
    }
}
