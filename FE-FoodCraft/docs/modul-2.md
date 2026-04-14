# FoodCraft System — Walkthrough API (Modul 2)

---

## 🏗️ Struktur Modul 2 (Kapasitas Produksi)

Agar mesin bisa menolak atau menerima order harian, sistem harus tahu waktu batas operasi harian UMKM. Pendekatan kapasitas di modul ini bersifat spesifik ke basis **Waktu (Menit)**.

| Penambahan Data | Target Tabel | Keterangan |
|-----------------|--------------|------------|
| **Kapasitas Harian UMKM** | `pengaturan_kapasitas` | Relasi `1-to-1` dengan UMKM. Menentukan berapa lama UMKM operasi setiap harinya (misal: `480` menit / 8 jam). |
| **Waktu Produksi Produk** | `produks` | Menambahkan kolom `waktu_produksi` (dalam hitungan menit per satuan barang) di tabel produk. |

---

## 📜 API Endpoints: Kapasitas Produksi (Modul 2)

### Akses Owner (`role: owner`)

#### Pengaturan Kapasitas Dapur / Pabrik UMKM
| Method | Endpoint | Field Wajib / Deskripsi |
|--------|----------|-------------------------|
| `GET`  | `/api/owner/kapasitas` | Melihat profil setting kapasitas pabrik/dapur saat ini (mengembalikan `480` menit default jika belum diatur). |
| `POST` | `/api/owner/kapasitas` | Memperbarui atau membuat setting kapasitas (Metode **Upsert**). Menerima `kapasitas_harian_menit` (int) dan `hari_operasi` (array of string, misal `["Senin", "Rabu"]`). |

#### Penambahan parameter pada Produk
Saat menggunakan endpoint `POST /api/owner/produk` atau `PUT /api/owner/produk/{id}` dari Modul 1, sekarang Anda bisa mengirim parameter tambahan:
- `waktu_produksi`: Porsi waktu yang disita (dalam **menit**) untuk membuat 1 menu ini (default: 0).

---

### Akses Staff (`role: staff`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET`  | `/api/staff/kapasitas` | Melihat informasi operasional harian UMKM (Read Only) |

---

## 🚀 Panduan Uji Coba Postman (Modul 2)

### 1. Owner Menetapkan Jam Kerja Pabrik
Masuk sebagai Owner, atur kapasitas pabrik Anda (contoh kerja dari pagi hingga sore memakan waktu total 700 menit per hari, bekerja dari Senin s/d Sabtu).

**POST** `http://localhost:8000/api/owner/kapasitas`
```json
{
  "kapasitas_harian_menit": 700,
  "hari_operasi": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
}
```

### 2. Owner Menetapkan Waktu Produksi Produk Baru
Masuk sebagai Owner, tambahkan menu baru dan berapa lama (menit) yang diperlukan untuk membuat 1 porsinya.

**POST** `http://localhost:8000/api/owner/produk`
```json
{
  "nama": "Kue Lapis Legit",
  "deskripsi": "Kue lapis spesial mentega premium",
  "harga": 80000,
  "waktu_produksi": 45
}
```
*Artinya: Produk ini akan mensyaratkan mesin penjadwalan (*capacity engine*) untuk mendurasi pengerjaannya selama 45 menit per loyang.*

### 3. Staff Melihat Jadwal Harian Pabrik
Staf masuk untuk sekedar melihat informasi hari-hari UMKM.
**GET** `http://localhost:8000/api/staff/kapasitas`
Sistem akan membalas info operasional tanpa memberikan hak edit!
