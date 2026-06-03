# Panduan Instalasi Lokal - Frontend FoodCraft (React + TypeScript + Vite)

Dokumen ini berisi panduan langkah demi langkah untuk menginstal dan menjalankan aplikasi frontend **FoodCraft** di lingkungan lokal Anda. Aplikasi ini dibangun menggunakan **React 19**, **Vite**, **TypeScript**, dan **Tailwind CSS**.

---

## 📋 Prasyarat Sistem

Sebelum memulai, pastikan sistem Anda telah terpasang:
1. **Node.js (versi LTS direkomendasikan, minimal versi 18.x)**
2. **NPM** (bawaan dari instalasi Node.js)
3. **Backend FoodCraft yang sedang aktif** berjalan di port `8000` (silakan lihat panduan instalasi di folder `BE-FoodCraft/INSTALLATION.md` untuk menjalankan backend terlebih dahulu).

---

## 🛠️ Langkah-Langkah Instalasi

### 1. Masuk ke Direktori Frontend
Buka terminal baru (jangan menutup terminal server backend), lalu arahkan ke direktori frontend:
```bash
cd FE-FoodCraft
```

### 2. Instal Dependensi Node.js
Unduh dan pasang semua paket pustaka yang diperlukan untuk proyek ini:
```bash
npm install
```

### 3. Buat File Konfigurasi Lingkungan Lokal (`.env`)
*(Langkah opsional tetapi sangat disarankan)*
Secara default, aplikasi frontend dikonfigurasi untuk menghubungkan API ke `http://localhost:8000`. Jika Anda ingin mendefinisikannya secara eksplisit, buat file bernama **`.env`** di root folder `FE-FoodCraft` dan masukkan baris berikut:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Menjalankan Aplikasi di Lingkungan Pengembangan

Setelah instalasi dependensi selesai, jalankan perintah berikut untuk memulai server pengembangan lokal (Vite Dev Server):

```bash
npm run dev
```

Terminal akan menampilkan URL server pengembangan, biasanya:
```text
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Buka peramban (browser) Anda dan akses alamat **`http://localhost:5173`**.

---

## 🔑 Cara Masuk Ke Aplikasi (Login)

Gunakan kredensial admin bawaan dari backend untuk masuk ke dalam dasbor:
* **Halaman Login**: `http://localhost:5173/login`
* **Email**: `admin@gmail.com`
* **Password**: `admin123`

Aplikasi ini menggunakan sliding panel modern, sehingga Anda dapat berpindah antara layar **Login** dan **Register** dengan lancar menggunakan tombol pengalih yang ada di halaman tersebut.

---

## ⚙️ Perintah Tambahan

* **Build Aplikasi untuk Produksi**:
  Menghasilkan kode HTML, CSS, dan JS yang telah dioptimalkan dan diminifikasi di dalam folder `dist/` untuk deployment ke server produksi.
  ```bash
  npm run build
  ```
* **Pratinjau Hasil Build Produksi**:
  Menjalankan server lokal untuk menguji performa aplikasi hasil build produksi sebelum dirilis.
  ```bash
  npm run preview
  ```
* **Linting Code**:
  Memeriksa kualitas kode TypeScript dan React terhadap aturan eslint:
  ```bash
  npm run lint
  ```
