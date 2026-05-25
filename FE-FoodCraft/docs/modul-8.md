## 🪲 Sistem Monitoring Error (Opsi B: Database-Backed)

Sistem ini menangkap secara otomatis setiap error server internal (HTTP 500) yang terjadi pada API `/api/*` dan menyimpannya ke tabel `system_errors`. Sistem ini juga menyediakan fitur bagi Super Admin untuk menandai bug sebagai *Resolved* atau menghapus log error.

### 🗄️ Skema Database (`system_errors`)

| Nama Kolom | Tipe Data | Deskripsi |
|------------|-----------|-----------|
| `id` | BigInt (PK) | Auto-increment primary key. |
| `user_id` | BigInt (FK, Nullable) | Menghubungkan ke user yang mengalami error (jika tamu/guest, bernilai `NULL`). |
| `ip_address` | String | Alamat IP pembuat request saat error terjadi. |
| `method` | String | HTTP Method (GET, POST, PUT, DELETE). |
| `url` | Text | URL lengkap request yang diakses saat error terjadi. |
| `exception_class`| String | Nama class exception PHP yang memicu error (cth: `Illuminate\Database\QueryException`). |
| `message` | Text | Pesan error deskriptif yang dilemparkan server. |
| `file` | String | Path file PHP tempat error terjadi. |
| `line` | Integer | Nomor baris kode PHP tempat error terjadi. |
| `trace` | JSON | Stack trace error (disimpan hingga 15 baris untuk menghemat ruang). |
| `payload` | JSON (Nullable) | Data input/body yang dikirimkan saat error terjadi (telah disaring/redact). |
| `resolved` | Boolean | Status penyelesaian bug (`true` jika sudah di-resolve oleh Admin, default `false`). |
| `created_at` | Timestamp | Waktu log error dicatat. |

### 🔒 Perlindungan Data & Keamanan
Sama seperti pada Logging API Request, payload request yang memicu error disaring secara ketat untuk menyembunyikan parameter sensitif (seperti password dan token) menjadi `"[FILTERED]"`.

---

### 📜 API Endpoints: Monitoring & Manajemen Bug (Akses Super Admin)

Endpoint ini dibatasi secara ketat hanya untuk user dengan role `super_admin`.

#### 1. Ambil Daftar Log Error (Paginated & Filterable)
* **Method**: `GET`
* **Endpoint**: `/api/admin/system-errors`
* **Query Parameters**:
  * `page`: integer (default: 1)
  * `resolved`: boolean (`0` atau `1`)
  * `search`: string (pencarian berdasarkan pesan error, nama file, URL, IP address, nama user, atau email)

#### **Contoh Response JSON (HTTP 200 OK)**:
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 2,
        "ip_address": "127.0.0.1",
        "method": "POST",
        "url": "http://localhost/api/owner/produk",
        "exception_class": "Illuminate\\Database\\QueryException",
        "message": "SQLSTATE[HY000]: General error: 1364 Field 'harga' doesn't have a default value",
        "file": "C:\\BE-FoodCraft\\app\\Http\\Controllers\\ProdukController.php",
        "line": 45,
        "trace": [
          "Illuminate\\Database\\Connection->runQueryCallback() at line 760",
          "Illuminate\\Database\\Connection->run() at line 715"
        ],
        "payload": {
          "nama": "Kue Putu"
        },
        "resolved": false,
        "created_at": "2026-05-26T01:25:00.000000Z",
        "user": {
          "id": 2,
          "name": "Budi Owner",
          "email": "budi@foodcraft.com",
          "role": "owner"
        }
      }
    ],
    "total": 1
  }
}
```

#### 2. Menandai Status Error (Resolve)
* **Method**: `PUT`
* **Endpoint**: `/api/admin/system-errors/{id}/resolve`
* **Request Body**:
  ```json
  {
    "resolved": true
  }
  ```

#### **Contoh Response JSON (HTTP 200 OK)**:
```json
{
  "status": "success",
  "message": "Error marked as resolved successfully."
}
```

#### 3. Menghapus Log Error
* **Method**: `DELETE`
* **Endpoint**: `/api/admin/system-errors/{id}`

#### **Contoh Response JSON (HTTP 200 OK)**:
```json
{
  "status": "success",
  "message": "Error log deleted successfully."
}
```
