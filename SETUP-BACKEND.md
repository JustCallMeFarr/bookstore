# Setup Backend (Laravel API)

Folder `backend-overlay/` berisi semua kode khusus proyek BookStore. Folder `backend/` (Laravel utuh) dibuat di laptopmu, lalu isi overlay ditimpakan ke dalamnya.

Syarat: PHP 8.2+, Composer, MySQL (XAMPP/Laragon boleh).

## Langkah (dari folder `bookstore/`)

```bash
# 1. Buat project Laravel baru
composer create-project laravel/laravel backend

# 2. Pasang API + Sanctum (jawab "yes" kalau ditanya migrate)
cd backend
php artisan install:api

# 3. Timpakan file proyek ke dalam Laravel
#    Mac/Linux/Git Bash:
cp -r ../backend-overlay/* .
#    Windows CMD:  xcopy ..\backend-overlay . /E /Y
```

## 4. Atur database di `backend/.env`

Buat dulu database kosong bernama `bookstore` (lewat phpMyAdmin), lalu ubah:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bookstore
DB_USERNAME=root
DB_PASSWORD=
```

## 5. Migrasi, seeder, jalankan

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve        # API di http://127.0.0.1:8000/api
```

## Akun contoh (dari seeder)

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@bookstore.test | admin12345 |
| User  | user@bookstore.test  | user12345  |

## Cek cepat API

```bash
curl http://127.0.0.1:8000/api/genres
curl -X POST http://127.0.0.1:8000/api/login -H "Accept: application/json" -H "Content-Type: application/json" -d '{"email":"admin@bookstore.test","password":"admin12345"}'
```

Kalau ada error saat langkah ini, salin pesan errornya ke aku.
