## 🛡️ Modul Tambahan: Global Exception Handler & Standardized API Error Response

Aplikasi telah dikonfigurasi untuk menangani error secara global di `bootstrap/app.php` khusus untuk request API (`/api/*` atau request yang memiliki header `Accept: application/json`). Hal ini mencegah frontend mengalami crash akibat menerima halaman HTML error dari Laravel.

### 📋 Struktur Response JSON Error Standard

Semua error yang terjadi di server akan mengembalikan format JSON yang konsisten:

```json
{
  "status": "error",
  "message": "Pesan deskripsi error di sini",
  "errors": null
}
```

_Kecuali_ untuk **Validation Error (HTTP 422)**, yang mana property `errors` berisi daftar input/field yang tidak valid:

```json
{
  "status": "error",
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### 🚦 HTTP Status Code yang Didukung Secara Global

| Status Code                   | Exception                                             | Deskripsi                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **401 Unauthorized**          | `AuthenticationException`                             | Token habis / user belum login.                                                                                                                 |
| **403 Forbidden**             | `AccessDeniedHttpException`, `AuthorizationException` | Role tidak memiliki hak akses ke endpoint ini.                                                                                                  |
| **404 Not Found**             | `ModelNotFoundException`, `NotFoundHttpException`     | Model database tidak ditemukan atau endpoint URL salah.                                                                                         |
| **422 Unprocessable Content** | `ValidationException`                                 | Input form tidak lolos validasi Laravel.                                                                                                        |
| **500 Internal Server Error** | `Throwable` (General Exception)                       | Error server internal (DB Error, Syntax error, dll). Jika `APP_DEBUG=true`, field `errors` akan berisi stack trace untuk mempermudah debugging. |
