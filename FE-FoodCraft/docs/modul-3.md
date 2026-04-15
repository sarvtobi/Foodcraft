# FoodCraft System — Walkthrough API

## 🏗️ Struktur Modul 3 (Manajemen Pesanan Masuk & Prioritas)

Pesanan masuk (_Order_) merupakan nyawa UMKM. Modul ini secara otomatis mengatur manajemen pesanan beserta produk-produk yang dibeli. Selain itu, Modul ini secara **otomatis** melabeli sebuah antrean pesanan menggunakan **Aturan Prioritas** khusus.

| Tabel           | Keterangan                                                                                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pesanans`      | Informasi umum pelanggan, `tenggat_waktu`, `status` (_pending_, _diproses_, dll), dan perhitungan total transaksi. Selain itu, field `prioritas` dibuat otomatis. |
| `pesanan_items` | Produk-produk yang dimasukkan ke dalam pesanan (beserta `kuantitas` & `harga_satuan` saat dibeli).                                                                |

> [!TIP]
> **Prioritization Rule** (Berlaku Otomatis Saat Order Masuk):
>
> - Jika deadline/tenggat waktu **<= 2 hari** ➔ Prioritas otomotis **Tinggi**
> - Jika deadline/tenggat waktu **<= 7 hari** ➔ Prioritas otomotis **Sedang**
> - Jika deadline/tenggat waktu **> 7 hari** ➔ Prioritas otomotis **Rendah**
>   Sistem secara otomatis mengatur urutan endpoint melihat pesanan berdasarkan yang _Tinggi_ dan _Tenggat Waktu_ terdekat.

---

## 📜 API Endpoints: Pesanan (Akses Staff & Owner)

Seluruh titik endpoint ini berada di bawah proteksi _middleware_: `role:owner,staff` (Keduanya dapat berinteraksi dengan API yang sama).

| Method | Endpoint                   | Field Wajib / Deskripsi                                                                                                                                                                                                            |
| ------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/pesanan`             | Menerima daftar seluruh order yang ada dari pelanggan (Diurutkan secara otomatis dari Prioritas Tertinggi & Terdekat).                                                                                                             |
| `GET`  | `/api/pesanan/{id}`        | Melihat detail satu struk pesanan lengkap dengan daftar item pesanan.                                                                                                                                                              |
| `POST` | `/api/pesanan`             | Menginput order baru. Parameter (JSON): `pelanggan`, `tenggat_waktu` (Tanggal, cth: `2026-05-18`), `items` (Array object: `[{"produk_id": 1, "kuantitas": 2}]`). _Sistem mengkalkulasi harga subtotal & prioritas secara rahasia!_ |
| `PUT`  | `/api/pesanan/{id}/status` | Mengubah progress pengerjaan pesanan. Parameter: `status` (`pending`, `diproses`, `selesai`, `dibatalkan`).                                                                                                                        |

---

## 🚀 Panduan Uji Coba Postman (Modul 3)

### 1. Memasukkan / Membuat Pesanan (Oleh Kasir/Staff)

Saat pelanggan datang dan berencana mengambil kue di minggu depan (misal: 10 Mei). Otomatis harganya dikali sistem dan ditetapkan berprioritas "Sedang" / "Rendah".

**POST** `http://localhost:8000/api/pesanan`

```json
{
  "pelanggan": "Ibu Tita",
  "tenggat_waktu": "2026-05-10",
  "items": [
    {
      "produk_id": 1,
      "kuantitas": 50
    },
    {
      "produk_id": 2,
      "kuantitas": 15
    }
  ]
}
```

### 2. Memeriksa Daftar Antrean Dapur

Dapur dapat memanggil GET Data Pesanan untuk mengecek tabel _To-Do_.

**GET** `http://localhost:8000/api/pesanan`
**Response:** (Kue pesanan _Ibu Tita_, dll.. akan otomatis di-sorting berdasarkan prioritas waktu yang paling mepet agar koki UMKM bisa memprioritaskan ini).

### 3. Eksekusi Produksi (Perubahan Status)

Staff/Pemilik menandai bahwa kue Ibu Tita sedang dimasak!

**PUT** `http://localhost:8000/api/pesanan/1/status`

```json
{
  "status": "diproses"
}
```
