<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="FoodCraft BE API Documentation",
 *     version="1.0.0",
 *     description="API documentation for Sistem Manajemen Produksi UMKM Makanan (FoodCraft) - Backend Service",
 *     @OA\Contact(
 *         email="support@foodcraft.com",
 *         name="FoodCraft Support Team"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="/api",
 *     description="Default API Prefix Gateway"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter your Bearer Token (obtained from /login) to authorize request execution."
 * )
 */
class SwaggerController extends Controller
{
    /**
     * @OA\Post(
     *     path="/register",
     *     summary="Register a new user",
     *     tags={"Auth & Profile"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","password_confirmation"},
     *             @OA\Property(property="name", type="string", example="Budi Owner"),
     *             @OA\Property(property="email", type="string", format="email", example="budi@foodcraft.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123"),
     *             @OA\Property(property="role", type="string", enum={"owner","staff","super_admin"}, example="owner")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User registered successfully"),
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="token", type="string", example="1|aBcDeFg...")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function register() {}

    /**
     * @OA\Post(
     *     path="/login",
     *     summary="User Login",
     *     tags={"Auth & Profile"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="owner@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="token", type="string", example="2|xYzAbCd...")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Invalid credentials")
     * )
     */
    public function login() {}

    /**
     * @OA\Post(
     *     path="/logout",
     *     summary="User Logout",
     *     tags={"Auth & Profile"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logged out successfully",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Logged out successfully"))
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function logout() {}

    /**
     * @OA\Get(
     *     path="/profile",
     *     summary="Get authenticated user profile",
     *     tags={"Auth & Profile"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Authenticated user data retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function profile() {}

    /**
     * @OA\Post(
     *     path="/profile",
     *     summary="Update authenticated user profile (with avatar support)",
     *     tags={"Auth & Profile"},
     *     security={{"bearerAuth":{}}},
     *     description="To upload a file and update fields, use a multipart/form-data request with `_method` set to `PUT`.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"_method"},
     *                 @OA\Property(property="_method", type="string", example="PUT", description="Method spoofing to support PUT requests in file uploads"),
     *                 @OA\Property(property="name", type="string", example="Budi Baru"),
     *                 @OA\Property(property="email", type="string", format="email", example="newemail@foodcraft.com"),
     *                 @OA\Property(property="avatar", type="string", format="binary", description="Image file: JPG, JPEG, PNG (max 2MB)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User profile updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User profile updated successfully"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation errors"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function updateProfile() {}

    /**
     * @OA\Get(
     *     path="/admin/dashboard",
     *     summary="Super Admin Dashboard SaaS Metrics",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard statistics successfully retrieved",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Welcome Super Admin Dashboard"),
     *             @OA\Property(property="metrics", type="object",
     *                 @OA\Property(property="total_users", type="integer", example=25),
     *                 @OA\Property(property="total_users_growth", type="number", format="float", example=64.29),
     *                 @OA\Property(property="total_umkms", type="integer", example=8),
     *                 @OA\Property(property="total_umkm_trend", type="string", example="up"),
     *                 @OA\Property(property="active_users_24h", type="integer", example=3)
     *             ),
     *             @OA\Property(property="system_health", type="object",
     *                 @OA\Property(property="avg_latency_ms", type="integer", example=142),
     *                 @OA\Property(property="success_rate_percent", type="number", format="float", example=98.5)
     *             )
     *         )
     *     ),
     *     @OA\Response(response=403, description="Forbidden - Admin access required")
     * )
     */
    public function adminDashboard() {}

    /**
     * @OA\Get(
     *     path="/admin/users",
     *     summary="List all registered owners/users",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successful users retrieval",
     *         @OA\JsonContent(type="array", @OA\Items(type="object"))
     *     )
     * )
     */
    public function adminUsers() {}

    /**
     * @OA\Put(
     *     path="/admin/users/{id}",
     *     summary="Update owner/user account (Super Admin only)",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Owner Name Update"),
     *             @OA\Property(property="email", type="string", format="email", example="updated@example.com")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Owner updated successfully")
     * )
     */
    public function adminUpdateUser() {}

    /**
     * @OA\Delete(
     *     path="/admin/users/{id}",
     *     summary="Delete user/owner (Super Admin only)",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Owner deleted successfully")
     * )
     */
    public function adminDeleteUser() {}

    /**
     * @OA\Get(
     *     path="/admin/activity-logs",
     *     summary="Retrieve Admin Login & Activity Logs",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Logs list retrieved")
     * )
     */
    public function adminActivityLogs() {}

    /**
     * @OA\Get(
     *     path="/admin/api-logs",
     *     summary="Retrieve API Request logs for tracking server load/activity",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="method", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="status_code", in="query", required=false, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Logs retrieved successfully")
     * )
     */
    public function adminApiLogs() {}

    /**
     * @OA\Get(
     *     path="/admin/system-errors",
     *     summary="Retrieve logged system internal errors (500)",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="resolved", in="query", required=false, @OA\Schema(type="integer", enum={0,1})),
     *     @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="System errors fetched successfully")
     * )
     */
    public function adminSystemErrors() {}

    /**
     * @OA\Put(
     *     path="/admin/system-errors/{id}/resolve",
     *     summary="Mark system error resolved",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"resolved"},
     *             @OA\Property(property="resolved", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Error marked as resolved successfully")
     * )
     */
    public function adminResolveSystemError() {}

    /**
     * @OA\Delete(
     *     path="/admin/system-errors/{id}",
     *     summary="Delete error log record",
     *     tags={"Super Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Error log deleted successfully")
     * )
     */
    public function adminDestroySystemError() {}

    /**
     * @OA\Get(
     *     path="/owner/dashboard",
     *     summary="Get Owner dashboard context metrics",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Owner dashboard context statistics")
     * )
     */
    public function ownerDashboard() {}

    /**
     * @OA\Post(
     *     path="/owner/umkm",
     *     summary="Initialize UMKM business details",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Bakso Super"),
     *             @OA\Property(property="description", type="string", example="Industri bakso rumahan"),
     *             @OA\Property(property="address", type="string", example="Jl. Kamboja No. 5"),
     *             @OA\Property(property="phone", type="string", example="08123456789")
     *         )
     *     ),
     *     @OA\Response(response=201, description="UMKM created successfully")
     * )
     */
    public function ownerCreateUmkm() {}

    /**
     * @OA\Get(
     *     path="/owner/umkm",
     *     summary="Show UMKM profile details",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="UMKM details fetched")
     * )
     */
    public function ownerShowUmkm() {}

    /**
     * @OA\Post(
     *     path="/owner/umkm/update",
     *     summary="Update UMKM profile (supports logo file upload)",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     description="To upload a file and update fields, use a multipart/form-data request with `_method` set to `PUT` on `/api/owner/umkm`.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"_method"},
     *                 @OA\Property(property="_method", type="string", example="PUT"),
     *                 @OA\Property(property="name", type="string", example="Bakso Super Update"),
     *                 @OA\Property(property="description", type="string", example="Deskripsi update"),
     *                 @OA\Property(property="address", type="string", example="Alamat update"),
     *                 @OA\Property(property="phone", type="string", example="08210000000"),
     *                 @OA\Property(property="profile", type="string", format="binary", description="Logo/profile photo: JPG, JPEG, PNG (max 2MB)")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=200, description="UMKM updated successfully")
     * )
     */
    public function ownerUpdateUmkm() {}

    /**
     * @OA\Post(
     *     path="/owner/staff",
     *     summary="Create staff employee account for UMKM",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string", example="Staff Doni"),
     *             @OA\Property(property="email", type="string", format="email", example="doni@staff.com"),
     *             @OA\Property(property="password", type="string", example="doni123")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Staff created successfully")
     * )
     */
    public function ownerCreateStaff() {}

    /**
     * @OA\Get(
     *     path="/owner/staff",
     *     summary="List all staff members of Owner's UMKM",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Staff list retrieved successfully")
     * )
     */
    public function ownerIndexStaff() {}

    /**
     * @OA\Put(
     *     path="/owner/staff/{id}",
     *     summary="Update staff employee details",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Staff Name Updated"),
     *             @OA\Property(property="email", type="string", format="email", example="doni_new@staff.com")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Staff updated successfully")
     * )
     */
    public function ownerUpdateStaff() {}

    /**
     * @OA\Delete(
     *     path="/owner/staff/{id}",
     *     summary="Remove/Delete staff employee",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Staff deleted successfully")
     * )
     */
    public function ownerDeleteStaff() {}

    /**
     * @OA\Get(
     *     path="/owner/activity-logs",
     *     summary="Get login logs and activity logs of the Owner's UMKM",
     *     tags={"Owner - UMKM & Staff"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Logs retrieved successfully")
     * )
     */
    public function ownerActivityLogs() {}

    /**
     * @OA\Get(
     *     path="/owner/bahan-baku",
     *     summary="List all Bahan Baku (Raw Materials)",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Bahan Baku list fetched")
     * )
     */
    public function ownerIndexBahanBaku() {}

    /**
     * @OA\Post(
     *     path="/owner/bahan-baku",
     *     summary="Register a new Bahan Baku",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nama","stok_riil","satuan"},
     *             @OA\Property(property="nama", type="string", example="Tepung Terigu"),
     *             @OA\Property(property="stok_riil", type="number", format="float", example=50.0),
     *             @OA\Property(property="satuan", type="string", example="kg")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Bahan baku created successfully")
     * )
     */
    public function ownerStoreBahanBaku() {}

    /**
     * @OA\Get(
     *     path="/owner/bahan-baku/{id}",
     *     summary="Get details of one Bahan Baku",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Bahan baku detail retrieved")
     * )
     */
    public function ownerShowBahanBaku() {}

    /**
     * @OA\Put(
     *     path="/owner/bahan-baku/{id}",
     *     summary="Update Bahan Baku details/stok",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nama", type="string", example="Tepung Terigu Segitiga Biru"),
     *             @OA\Property(property="stok_riil", type="number", format="float", example=55.0),
     *             @OA\Property(property="satuan", type="string", example="kg")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Bahan baku updated successfully")
     * )
     */
    public function ownerUpdateBahanBaku() {}

    /**
     * @OA\Delete(
     *     path="/owner/bahan-baku/{id}",
     *     summary="Delete a Bahan Baku record",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Bahan baku deleted successfully")
     * )
     */
    public function ownerDestroyBahanBaku() {}

    /**
     * @OA\Get(
     *     path="/owner/produk",
     *     summary="List all Produk",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Produk list retrieved")
     * )
     */
    public function ownerIndexProduk() {}

    /**
     * @OA\Post(
     *     path="/owner/produk",
     *     summary="Register a new Produk",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nama","harga","durasi_menit"},
     *             @OA\Property(property="nama", type="string", example="Bakso Sapi Isi Keju"),
     *             @OA\Property(property="harga", type="integer", example=25000),
     *             @OA\Property(property="durasi_menit", type="integer", example=30)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Produk created successfully")
     * )
     */
    public function ownerStoreProduk() {}

    /**
     * @OA\Get(
     *     path="/owner/produk/{id}",
     *     summary="Get details of a specific Produk including recipe ingredients",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Produk detail with recipe list")
     * )
     */
    public function ownerShowProduk() {}

    /**
     * @OA\Put(
     *     path="/owner/produk/{id}",
     *     summary="Update Produk details",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nama", type="string", example="Bakso Sapi Keju Jumbo"),
     *             @OA\Property(property="harga", type="integer", example=28000),
     *             @OA\Property(property="durasi_menit", type="integer", example=35)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Produk updated successfully")
     * )
     */
    public function ownerUpdateProduk() {}

    /**
     * @OA\Delete(
     *     path="/owner/produk/{id}",
     *     summary="Delete a Produk record",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Produk deleted successfully")
     * )
     */
    public function ownerDestroyProduk() {}

    /**
     * @OA\Get(
     *     path="/owner/kapasitas",
     *     summary="Retrieve UMKM capacity constraint details",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="UMKM capacity returned")
     * )
     */
    public function ownerShowKapasitas() {}

    /**
     * @OA\Post(
     *     path="/owner/kapasitas",
     *     summary="Set/Upsert UMKM daily capacity limit (in minutes)",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"kapasitas_menit_harian"},
     *             @OA\Property(property="kapasitas_menit_harian", type="integer", example=480)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Kapasitas updated successfully")
     * )
     */
    public function ownerUpsertKapasitas() {}

    /**
     * @OA\Post(
     *     path="/owner/produk/{produk_id}/resep",
     *     summary="Add a recipe ingredient (Bahan Baku) mapping to a Produk",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="produk_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"bahan_baku_id","jumlah_butuh"},
     *             @OA\Property(property="bahan_baku_id", type="integer", example=1),
     *             @OA\Property(property="jumlah_butuh", type="number", format="float", example=0.25)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Recipe item added successfully")
     * )
     */
    public function ownerStoreResep() {}

    /**
     * @OA\Put(
     *     path="/owner/resep/{id}",
     *     summary="Update required quantity of a recipe ingredient",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"jumlah_butuh"},
     *             @OA\Property(property="jumlah_butuh", type="number", format="float", example=0.35)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Recipe item updated successfully")
     * )
     */
    public function ownerUpdateResep() {}

    /**
     * @OA\Delete(
     *     path="/owner/resep/{id}",
     *     summary="Remove recipe ingredient from Produk",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Recipe item deleted successfully")
     * )
     */
    public function ownerDestroyResep() {}

    /**
     * @OA\Get(
     *     path="/owner/dasbor-analitik",
     *     summary="Owner Business Intelligence Dashboard & Analytical Reports",
     *     tags={"Owner - Master Data"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="periode", in="query", required=false, description="Format YYYY-MM", @OA\Schema(type="string", example="2026-05")),
     *     @OA\Response(
     *         response=200,
     *         description="Report data fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="periode", type="string", example="2026-05"),
     *             @OA\Property(property="performa_pesanan", type="object"),
     *             @OA\Property(property="ketepatan_waktu_persen", type="number"),
     *             @OA\Property(property="utilisasi_kapasitas_persen", type="number"),
     *             @OA\Property(property="top_produk", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function ownerDasborAnalitik() {}

    /**
     * @OA\Get(
     *     path="/staff/dashboard",
     *     summary="Staff Dashboard Welcome Screen with UMKM contexts",
     *     tags={"Staff - Access"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Welcome data retrieved",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Welcome Staff Dashboard"),
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="umkm_name", type="string", example="Bakso Super"),
     *             @OA\Property(property="umkm_avatar", type="string", example="umkm_profiles/avatar.png"),
     *             @OA\Property(property="umkm_profile", type="string", example="umkm_profiles/avatar.png")
     *         )
     *     )
     * )
     */
    public function staffDashboard() {}

    /**
     * @OA\Get(
     *     path="/staff/bahan-baku",
     *     summary="Read-only list of Bahan Baku (Staff)",
     *     tags={"Staff - Access"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Bahan Baku list")
     * )
     */
    public function staffBahanBaku() {}

    /**
     * @OA\Get(
     *     path="/staff/bahan-baku/{id}",
     *     summary="Read-only details of one Bahan Baku (Staff)",
     *     tags={"Staff - Access"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Bahan baku detail")
     * )
     */
    public function staffShowBahanBaku() {}

    /**
     * @OA\Get(
     *     path="/staff/produk",
     *     summary="Read-only list of Products (Staff)",
     *     tags={"Staff - Access"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Products list")
     * )
     */
    public function staffProduk() {}

    /**
     * @OA\Get(
     *     path="/staff/produk/{id}",
     *     summary="Read-only details of Product (Staff)",
     *     tags={"Staff - Access"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Product detail")
     * )
     */
    public function staffShowProduk() {}

    /**
     * @OA\Get(
     *     path="/staff/kapasitas",
     *     summary="Read-only Capacity settings of the UMKM (Staff)",
     *     tags={"Staff - Access"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Capacity settings")
     * )
     */
    public function staffKapasitas() {}

    /**
     * @OA\Get(
     *     path="/staff/activity-logs",
     *     summary="Read-only login and activity logs of this staff member",
     *     tags={"Staff - Access"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Activity logs list")
     * )
     */
    public function staffActivityLogs() {}

    /**
     * @OA\Get(
     *     path="/pesanan",
     *     summary="List all Order Queue (Auto-sorted by priority & nearest deadline)",
     *     tags={"Pesanan & Penjadwalan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Order queue list")
     * )
     */
    public function indexPesanan() {}

    /**
     * @OA\Post(
     *     path="/pesanan",
     *     summary="Input a new Order (Kasir/Staff/Owner)",
     *     tags={"Pesanan & Penjadwalan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"pelanggan","tenggat_waktu","items"},
     *             @OA\Property(property="pelanggan", type="string", example="Ibu Susi"),
     *             @OA\Property(property="tenggat_waktu", type="string", format="date", example="2026-06-05"),
     *             @OA\Property(property="items", type="array", @OA\Items(
     *                 type="object",
     *                 required={"produk_id","kuantitas"},
     *                 @OA\Property(property="produk_id", type="integer", example=1),
     *                 @OA\Property(property="kuantitas", type="integer", example=50)
     *             ))
     *         )
     *     ),
     *     @OA\Response(response=201, description="Order registered successfully")
     * )
     */
    public function storePesanan() {}

    /**
     * @OA\Get(
     *     path="/pesanan/{id}",
     *     summary="Get details of a specific Order with ordered items",
     *     tags={"Pesanan & Penjadwalan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Order invoice and details")
     * )
     */
    public function showPesanan() {}

    /**
     * @OA\Put(
     *     path="/pesanan/{id}/status",
     *     summary="Update progress status of a Pesanan",
     *     tags={"Pesanan & Penjadwalan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"pending","diproses","selesai","dibatalkan"}, example="diproses")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Status updated successfully")
     * )
     */
    public function updatePesananStatus() {}

    /**
     * @OA\Post(
     *     path="/owner/pesanan/{id}/jadwalkan",
     *     summary="Jadwalkan Order to Capacity Engine & block materials (Owner only)",
     *     tags={"Pesanan & Penjadwalan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(
     *         response=200,
     *         description="Production scheduled successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Pesanan berhasil dijadwalkan"),
     *             @OA\Property(property="tanggal_produksi", type="string", example="2026-05-30"),
     *             @OA\Property(property="terlambat", type="boolean", example=false)
     *         )
     *     )
     * )
     */
    public function scheduleOrder() {}

    /**
     * @OA\Get(
     *     path="/staff/jadwal-produksi",
     *     summary="List scheduled recipes to make in kitchen today",
     *     tags={"Pesanan & Penjadwalan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="tanggal", in="query", required=false, description="Format YYYY-MM-DD", @OA\Schema(type="string", example="2026-05-30")),
     *     @OA\Response(response=200, description="Scheduled production list returned")
     * )
     */
    public function indexJadwal() {}

    /**
     * @OA\Post(
     *     path="/staff/jadwal-produksi/{id}/selesai",
     *     summary="Mark cooking schedule as finished (reduces real stock)",
     *     tags={"Pesanan & Penjadwalan"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Production completed and raw materials reduced successfully")
     * )
     */
    public function completeJadwal() {}
}
