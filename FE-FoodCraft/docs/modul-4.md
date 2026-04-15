# FoodCraft System — Walkthrough API

## ⚙️ Struktur Modul 4 (Mesin Penjadwalan & Realisasi Stok)

Modul ini adalah jantung utama aplikasi FoodCraft yang membantu UMKM mengatur waktu produksi (_Capacity Engine_) dan mencegah kebocoran antrean bahan baku.

| Konsep Kunci          | Keterangan                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Capacity Constraint` | Sistem melacak total waktu dari sebuah pesanan. Jika jadwal hari ini sudah "penuh" melebih batas UMKM, sistem melempar pembuatan produk di hari esoknya.                  |
| `Stok Dialokasikan`   | Kolom baru di `bahan_bakus`. Ketika jadwal di-ACC, estimasi bahan baku masuk ke sini sehingga sistem tidak menganggap bahan ini "Bebas" untuk resep pesanan baru lainnya. |
| `Jadwal Produksi`     | Tabel `jadwal_produksis` yang menyimpan tanggal masak untuk antrean resep. Terdapat flag `terlambat` jika jadwal melewati tenggat waktu.                                  |

> [!WARNING]  
> Jika Kapasitas hari ini penuh dan sistem menjadwalkan ke hari esok yang teryata sudah melewati aturan deadline pelanggan (`tenggat_waktu`), Jadwal **Tetap dibuat** namun sistem akan merespon flag `terlambat: true`. Hal ini disengaja agar Owner/Staff tidak kaget dan bisa mengambil aksi preventif (tambah SDM, dsb).

### 📜 API Endpoints (Eksekusi Mesin)

| Method | Endpoint                                  | Field Wajib / Deskripsi                                                                                                                                   | Proteksi Role  |
| ------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `POST` | `/api/owner/pesanan/{id}/jadwalkan`       | **[ENGINE]** Mengaktivasi perhitungan jadwal & mengurangi stok bebas (_booking material_). Response JSON akan sangat informatif kapan jadwal ditempatkan. | `Owner`        |
| `GET`  | `/api/staff/jadwal-produksi`              | Menampilkan jadwal hari ini (bisa difilter via `?tanggal=YYYY-MM-DD`).                                                                                    | `Staff, Owner` |
| `POST` | `/api/staff/jadwal-produksi/{id}/selesai` | Staff menandai makanan ini selesai dimasak! Pada detik ini juga, sistem mengurangi/memotong **Stok Riil / Aktual** di database.                           | `Staff, Owner` |

### 🚀 Panduan Postman (Modul 4)

**1. Lempar Pesanan Ke Penjadwalan (Owner)**
Setelah melihat order, owner klik ACC:
`POST http://localhost:8000/api/owner/pesanan/1/jadwalkan`

**2. Staff Melihat Pekerjaan Dapur Hari Ini**
Tablet dapur Dapur membuka list jadwal untuk hari ini (-atau besok `?tanggal=yyyy-mm-dd`):
`GET http://localhost:8000/api/staff/jadwal-produksi`

**3. Pesanan Selesai Digoreng/Dikemas!**
`POST http://localhost:8000/api/staff/jadwal-produksi/1/selesai`  
Response: _"Produksi selesai. Stok bahan baku telah dipotong."_
