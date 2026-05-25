## 📊 Sistem Logging API Request

Sistem ini merekam secara otomatis setiap aktivitas request HTTP yang masuk ke route API (`/api/*`), kecuali request ke endpoint logs itu sendiri (untuk menghindari noise log).

### 🗄️ Skema Database (`api_request_logs`)

| Nama Kolom | Tipe Data | Deskripsi |
|------------|-----------|-----------|
| `id` | BigInt (PK) | Auto-increment primary key. |
| `user_id` | BigInt (FK, Nullable) | Menghubungkan ke user yang terautentikasi (jika tamu/guest, bernilai `NULL`). |
| `ip_address` | String | Alamat IP pembuat request (misal: `127.0.0.1`). |
| `method` | String | HTTP Method (GET, POST, PUT, DELETE). |
| `url` | Text | URL lengkap request yang diakses. |
| `payload` | JSON (Nullable) | Data input/body yang dikirimkan (telah disaring/redact). |
| `status_code` | Integer | HTTP Status Code respon dari server (contoh: 200, 422, 500). |
| `duration_ms` | Integer | Waktu respon/latency server dalam milidetik (ms). |
| `created_at` | Timestamp | Waktu log dicatat. |

### 🔒 Mekanisme Penyaringan Data Sensitif
Middleware akan otomatis memeriksa data payload dan mengganti value field berikut dengan string `"[FILTERED]"` untuk alasan keamanan sebelum disimpan ke database:
* `password`, `password_confirmation`
* `token`, `access_token`
* `new_password`, `current_password`
* `credit_card`
* Serta menyederhanakan data file upload (`[FILE: namafile.ext (ukuran KB)]`).

---

### 📜 API Endpoint: Monitoring Log Request (Akses Super Admin)

Endpoint ini dibatasi secara ketat hanya untuk user dengan role `super_admin`.

#### 1. Ambil Daftar Log Request
* **Method**: `GET`
* **Endpoint**: `/api/admin/api-logs`
* **Query Parameters (Optional Filters)**:
  * `page`: integer (default: 1)
  * `method`: string (misal: `POST`, `GET`)
  * `status_code`: integer (misal: `200`, `422`, `500`)
  * `search`: string (pencarian berdasarkan URL, IP address, nama user, atau email user)

#### **Contoh Response JSON (HTTP 200 OK)**:
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 2,
        "user_id": 2,
        "ip_address": "127.0.0.1",
        "method": "POST",
        "url": "http://localhost/api/owner/produk",
        "payload": {
          "nama": "Kue Lapis Legit",
          "harga": 80000
        },
        "status_code": 201,
        "duration_ms": 78,
        "created_at": "2026-05-26T00:48:32.000000Z",
        "user": {
          "id": 2,
          "name": "Owner UMKM",
          "email": "owner@example.com",
          "role": "owner"
        }
      }
    ],
    "first_page_url": "http://localhost/api/admin/api-logs?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/admin/api-logs?page=1",
    "next_page_url": null,
    "path": "http://localhost/api/admin/api-logs",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```


