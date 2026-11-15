REVISI GALERI BOOKSTORE - HAPUS LABEL GENRE SAJA

Perubahan:
- Tulisan judul genre di atas setiap kelompok buku dihilangkan.
- Susunan kelompok/posisi buku tetap seperti desain sebelumnya.
- Cover buku tetap ditampilkan dan tetap bisa diklik.
- Menu genre dan pencarian tetap tersedia.
- Seeder berisi tambahan buku contoh dan cover SVG baru.

Pemasangan:
1. Ekstrak isi ZIP ke folder utama project bookstore (folder yang berisi folder frontend dan backend), izinkan file ditimpa.
2. Jalankan seeder dari backend:
   cd ~/Dokumen/ujk/bookstore/backend
   php artisan db:seed
3. Pastikan server frontend dan backend masih berjalan, lalu refresh browser dengan Ctrl+Shift+R.

Jangan jalankan migrate:fresh. Perintah db:seed tidak menghapus tabel.
