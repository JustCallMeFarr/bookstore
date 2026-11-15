# BookStore

Toko buku online dengan dua peran: **Admin** dan **User**.
Backend Laravel (REST API, Sanctum) + frontend React (Vite) + database **MySQL**.

## Fitur
- User: lihat buku per genre, cari buku, detail buku, keranjang, checkout (bayar di tempat), riwayat dan pembatalan pesanan, baca online, kirim pesan lewat Contact Me.
- Admin: kelola kategori, buku, pesanan (ubah status), lihat pengguna dan pesan masuk, ringkasan dashboard.

## Kebutuhan
PHP 8.3+, Composer, Node.js 18+, MySQL (mis. XAMPP).

## Cara menjalankan

### 1. Database
Buat database kosong bernama `bookstore` (phpMyAdmin atau `CREATE DATABASE bookstore;`).
Atau impor `bookstore.sql` kalau berkas itu ada di repositori, lalu lewati langkah migrate.

### 2. Backend
```
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
`.env.example` sudah memakai MySQL: database `bookstore`, user `root`, password kosong. Sesuaikan kalau berbeda.
API berjalan di http://127.0.0.1:8000.

### 3. Frontend
```
cd frontend
cp .env.example .env
npm install
npm run dev
```
Buka alamat yang muncul (biasanya http://localhost:5173).

## Akun demo
| Peran | Email | Password |
|---|---|---|
| Admin | admin@bookstore.test | admin12345 |
| User | user@bookstore.test | user12345 |

## Struktur tabel (7 tabel)
`users`, `categories`, `books`, `carts`, `orders`, `order_items`, `messages`.
Tabel lain di database (`migrations`, `sessions`, `cache`, `jobs`, dan sebagainya) dibuat otomatis oleh Laravel.

## Catatan
- Pembayaran: pesanan dikonfirmasi dengan bayar di tempat (COD), tanpa payment gateway.
- Baca online terbuka untuk semua pengguna yang sudah login. Dua buku berisi cuplikan nyata, sisanya teks contoh (lorem ipsum).
