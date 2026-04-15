# FoodCraft System — Walkthrough API
## 📈 Struktur Modul 5 (Monitoring & Analitik Dashboard)

Modul ini adalah jendela _business intelligence_ Owner UMKM. Melalui modul ini, Owner mengawasi efektivitas pekerja staf dan produktivitas dapur.

| Fitur Kunci | Keterangan |
|-------|------------|
| `Rekam Keterlambatan Real-time` | Di balik layar, saat Staf menekan Selesai, sistem secara instan membandingkan `waktu hari ini` dengan `tenggat_waktu` aslinya. Jika staf nyata terlambat, sebuah baris di _Riwayat Keterlambatan_ akan tercatat! |
| `Dasbor Analitik Agregat` | Mengumpulkan 4 komponen metrik (Pesanan Status, % Ketepatan Waktu Delivery, % Utilisasi Kapasitas Mesin/Dapur, dan Top Selling Produk) di satu GET Endpoint. |

### 📜 API Endpoint (Analitik Dasbor)

| Method | Endpoint | Deskripsi | Proteksi |
|--------|----------|-----------|----------|
| `GET` | `/api/owner/dasbor-analitik?periode=YYYY-MM` | Mencetak metrik bisnis pada bulan yang dipilih. Jika kueri `periode` kosong, defaultnya adalah bulan ini. | `Owner` |

### 🚀 Panduan Postman (Modul 5)

**1. Menampilkan Laporan Bisnis Bulan Berjalan**
Cukup Login sebagai Owner.
**GET** `http://localhost:8000/api/owner/dasbor-analitik`
```json
{
    "periode": "2026-04",
    "performa_pesanan": {
        "total_masuk": 12,
        "selesai": 10,
        "sedang_diproses": 2,
        "dibatalkan": 0,
        "terlambat": 1
    },
    "ketepatan_waktu_persen": 90,
    "utilisasi_kapasitas_persen": 65.5,
    "top_produk": [
        {
            "nama": "Keripik Singkong",
            "total_terjual": "230"
        }
    ]
}
```

> [!TIP]
> Nilai `ketepatan_waktu_persen` yang rendah (contoh <70%) memberitahukan Owner: "Staf bekerja terlalu lambat melebihi deadline!". Sementara nilai `utilisasi_kapasitas_persen` >90% memberitahukan Owner: "Saatnya menambah mesin baru atau kuota tenaga, kita kelimpungan!".
