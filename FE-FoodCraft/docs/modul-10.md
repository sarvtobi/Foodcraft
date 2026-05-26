## 🖼️ Pengaturan Foto Profil & Avatar (User & UMKM)

Sistem kini mendukung unggah foto/gambar untuk **Avatar Pengguna (User)** dan **Profil UMKM** dengan validasi ketat di sisi server.

### 🔒 Aturan Validasi File Gambar (Sama untuk User & UMKM)
* **Tipe File**: Hanya menerima file gambar dengan ekstensi/mime type: **JPG, JPEG, PNG**.
* **Ukuran Maksimum**: **2MB (2048 KB)**.

---

### 1. Unggah / Perbarui Avatar User

Gunakan endpoint ini untuk mengunggah file gambar avatar pengguna yang terautentikasi.

* **Method**: `POST` (menggunakan method spoofing `_method=PUT` jika dikirim via `multipart/form-data`)
* **Endpoint**: `/api/profile`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: multipart/form-data`
* **Request Body**:
  * `_method`: `PUT` (Wajib untuk mensimulasikan PUT request di Laravel saat mengirim file)
  * `avatar`: `[File gambar]` (JPEG/JPG/PNG, Max 2MB)
  * `name` (opsional): `string`
  * `email` (opsional): `string`

#### **Contoh Response JSON (HTTP 200 OK)**:
```json
{
  "message": "User profile updated successfully",
  "user": {
    "id": 2,
    "name": "Owner UMKM",
    "email": "owner@example.com",
    "avatar": "avatars/aBcDeFgHiJkLmNoP.png",
    "role": "owner",
    "created_at": "2026-05-26T06:19:20.000000Z",
    "updated_at": "2026-05-26T06:21:00.000000Z"
  }
}
```

---

### 2. Unggah / Perbarui Profil UMKM

Gunakan endpoint ini untuk mengunggah foto profil dari UMKM milik Owner.

* **Method**: `POST` (menggunakan method spoofing `_method=PUT` jika dikirim via `multipart/form-data`)
* **Endpoint**: `/api/owner/umkm`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: multipart/form-data`
* **Request Body**:
  * `_method`: `PUT` (Wajib untuk mensimulasikan PUT request di Laravel saat mengirim file)
  * `profile`: `[File gambar]` (JPEG/JPG/PNG, Max 2MB)
  * `name` (opsional): `string`
  * `description` (opsional): `string`
  * `address` (opsional): `string`
  * `phone` (opsional): `string`

#### **Contoh Response JSON (HTTP 200 OK)**:
```json
{
  "message": "UMKM updated successfully",
  "umkm": {
    "id": 1,
    "name": "Pabrik Bakso Super",
    "description": "Produsen bakso sapi higienis",
    "address": "Jl. Raya Industri No. 10",
    "phone": "08123456789",
    "owner_id": 2,
    "profile": "umkm_profiles/xYzAbCdEfGhIjKlM.jpg",
    "created_at": "2026-05-26T06:19:20.000000Z",
    "updated_at": "2026-05-26T06:21:05.000000Z"
  }
}
```

> [!NOTE]
> File yang diunggah akan secara otomatis disimpan di direktori `storage/app/public` (subfolder `avatars/` dan `umkm_profiles/`). Jalur penyimpanan di atas dapat diakses secara publik melalui URL: `http://localhost:8000/storage/<nama_path>`.





