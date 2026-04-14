<?php

use App\Models\User;
use App\Models\Umkm;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function createKapasitasOwner(): array
{
    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create([
        'name'     => 'UMKM Kapasitas',
        'owner_id' => $owner->id,
    ]);
    $token = $owner->createToken('owner_token')->plainTextToken;

    return [$owner, $umkm, $token];
}

function createKapasitasStaff($umkm_id): array
{
    $staff = User::factory()->create([
        'role'    => 'staff',
        'umkm_id' => $umkm_id,
    ]);
    $token = $staff->createToken('staff_token')->plainTextToken;

    return [$staff, $token];
}

/*
|--------------------------------------------------------------------------
| Tests
|--------------------------------------------------------------------------
*/

test('owner can get default kapasitas if not set', function () {
    [$owner, $umkm, $token] = createKapasitasOwner();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/owner/kapasitas');

    $response->assertStatus(200)
        ->assertJsonPath('kapasitas.kapasitas_harian_menit', 480);
});

test('owner can upsert pengaturan kapasitas', function () {
    [$owner, $umkm, $token] = createKapasitasOwner();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/owner/kapasitas', [
        'kapasitas_harian_menit' => 600, // 10 jam
        'hari_operasi' => ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('kapasitas.kapasitas_harian_menit', 600);

    $this->assertDatabaseHas('pengaturan_kapasitas', [
        'umkm_id' => $umkm->id,
        'kapasitas_harian_menit' => 600,
    ]);
});

test('staff can view kapasitas settings', function () {
    [$owner, $umkm, $ownerToken] = createKapasitasOwner();
    [$staff, $staffToken] = createKapasitasStaff($umkm->id);

    // Bikin setting dulu
    $this->withHeaders([
        'Authorization' => 'Bearer ' . $ownerToken,
    ])->postJson('/api/owner/kapasitas', [
        'kapasitas_harian_menit' => 500,
        'hari_operasi' => ["Sabtu", "Minggu"],
    ]);

    // Staff view
    $response = $this->actingAs($staff)->getJson('/api/staff/kapasitas');

    $response->assertStatus(200)
        ->assertJsonPath('kapasitas.kapasitas_harian_menit', 500);
});

test('staff cannot edit kapasitas', function () {
    [$owner, $umkm, $ownerToken] = createKapasitasOwner();
    [$staff, $staffToken] = createKapasitasStaff($umkm->id);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $staffToken,
    ])->postJson('/api/owner/kapasitas', [
        'kapasitas_harian_menit' => 500,
        'hari_operasi' => ["Senin"],
    ]);

    $response->assertStatus(403);
});

test('produk time added properly on store product', function () {
    [$owner, $umkm, $token] = createKapasitasOwner();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/owner/produk', [
        'nama' => 'Burger',
        'harga' => 20000,
        'waktu_produksi' => 15 // 15 menit
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('produk.waktu_produksi', 15);

    $this->assertDatabaseHas('produks', [
        'nama' => 'Burger',
        'waktu_produksi' => 15
    ]);
});
