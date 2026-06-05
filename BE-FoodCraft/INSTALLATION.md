# Panduan Instalasi Lokal - Backend FoodCraft (Laravel API)

Dokumen ini berisi panduan langkah demi langkah untuk menginstal dan menjalankan server backend **FoodCraft** di lingkungan lokal Anda. Backend ini menggunakan framework **Laravel 12** dan menyediakan RESTful API untuk aplikasi frontend.

---

## 📋 Prasyarat Sistem

Sebelum memulai, pastikan sistem Anda telah terpasang:
1. **PHP >= 8.2** (Lengkap dengan ekstensi: `openssl`, `pdo`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `sqlite3` atau `mysql` dll.)
2. **Composer (versi 2.x)**
3. **Node.js & NPM** (Direkomendasikan versi LTS, minimal versi 18.x)
4. **Database Server**: MySQL (XAMPP / Laragon) atau SQLite.

---

## 🛠️ Langkah-Langkah Instalasi

### 1. Masuk ke Direktori Backend
Buka terminal / Command Prompt / PowerShell, lalu arahkan ke direktori backend:
```bash
cd BE-FoodCraft
```

### 2. Salin File Konfigurasi Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env` untuk konfigurasi lokal Anda:
* **Linux/macOS**:
  ```bash
  cp .env.example .env
  ```
* **Windows (Command Prompt)**:
  ```cmd
  copy .env.example .env
  ```
* **Windows (PowerShell)**:
  ```powershell
  copy .env.example .env
  ```

### 3. Instal Dependensi PHP
Jalankan Composer untuk mengunduh dan menginstal pustaka yang dibutuhkan:
```bash
composer install
```

### 4. Buat Application Key
Generate key enkripsi unik untuk keamanan aplikasi Laravel:
```bash
php artisan key:generate
```

### 5. Konfigurasi Database di File `.env`
Buka file `.env` yang baru dibuat menggunakan editor teks (VS Code, Notepad, dll) lalu pilih salah satu metode database di bawah ini:

#### 💡 Pilihan A: Menggunakan MySQL (Rekomendasi / Default)
1. Aktifkan MySQL di control panel server lokal Anda (misal: XAMPP, Laragon, dll).
2. Buat database baru kosong bernama **`be_foodcraft`** melalui phpMyAdmin atau perkakas pengelola database lainnya.
3. Sesuaikan konfigurasi database berikut pada file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=be_foodcraft
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Kosongkan `DB_PASSWORD` jika Anda menggunakan XAMPP default tanpa password).*

#### 💡 Pilihan B: Menggunakan SQLite (Lebih Mudah Tanpa Setup Server Database)
1. Buat file database kosong di dalam direktori `database/`:
   * **Linux/macOS/Git Bash**:
     ```bash
     touch database/database.sqlite
     ```
   * **Windows (PowerShell)**:
     ```powershell
     New-Item -Path database\database.sqlite -ItemType File
     ```
2. Ubah konfigurasi database berikut pada file `.env`:
   ```env
   DB_CONNECTION=sqlite
   ```
   *(Beri tanda komentar atau hapus baris `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` jika menggunakan SQLite).*

---

### 6. Jalankan Migrasi Database dan Seed Data
Jalankan migrasi untuk membuat tabel-tabel di database serta mengisi data awal (akun admin bawaan):
```bash
php artisan migrate --seed
```

#### 🔑 Akun Admin Bawaan (Default Credentials)
Setelah seeder selesai dijalankan, Anda dapat menggunakan akun admin berikut untuk login:
* **Email**: `admin@gmail.com`
* **Password**: `admin123`
* **Role**: `Super Admin`

---

### 7. Generate Dokumentasi API (Swagger)
Jelajahi dan uji API endpoint yang tersedia dengan menghasilkan dokumentasi Swagger Swagger UI:
```bash
php artisan l5-swagger:generate
```
Dokumentasi API akan tersedia di: `http://localhost:8000/api/documentation` setelah server dijalankan.

---

### 8. Jalankan Server Backend Lokal
Mulai server lokal Laravel Anda:
```bash
php artisan serve
```
Secara default, server akan berjalan pada alamat **`http://localhost:8000`** atau **`http://127.0.0.1:8000`**.

> ⚠️ **PENTING**: Jangan menutup jendela terminal/command prompt ini agar server backend tetap berjalan.

---

## ⚡ Perintah Penting Lainnya

* **Menjalankan Tes Unit (Unit Testing)**:
  ```bash
  composer test
  ```
* **Menjalankan Queue Listener** (jika ada sistem antrean/background job):
  ```bash
  php artisan queue:listen
  ```
* **Membersihkan Cache Aplikasi**:
  ```bash
  php artisan config:clear
  php artisan cache:clear
  ```
