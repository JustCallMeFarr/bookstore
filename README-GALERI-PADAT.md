REVISI GALERI PADAT BOOKSTORE

Perubahan:
- Semua cover diratakan ke satu galeri tanpa label genre.
- Galeri tidak memiliki scrollbar internal; seluruh cover diatur agar muat dalam bingkai.
- Ukuran cover dihitung ulang otomatis mengikuti jumlah buku dan ukuran area.
- Efek zoom kursor, pencarian, menu filter genre, dan modal detail buku tetap ada.
- Seeder berisi 100 buku contoh dan file cover SVG yang sesuai.

Pemasangan:
1. Ekstrak ZIP ini ke folder utama project (folder yang berisi frontend dan backend), izinkan file ditimpa.
2. Jalankan: cd ~/Dokumen/ujk/bookstore/backend
3. Jalankan: php artisan db:seed
4. Refresh browser dengan Ctrl+Shift+R.

Jangan jalankan migrate:fresh. Seeder memakai updateOrCreate untuk buku, sehingga tidak menghapus data buku yang sudah ada.
