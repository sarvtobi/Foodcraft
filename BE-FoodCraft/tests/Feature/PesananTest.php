<?php

use App\Models\User;
use App\Models\Umkm;
use App\Models\Produk;
use App\Models\Pesanan;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function createPesananOwner(): array
{
    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create([
        'name'     => 'UMKM Pesanan',
        'owner_id' => $owner->id,
    ]);
    $token = $owner->createToken('owner_token')->plainTextToken;

    return [$owner, $umkm, $token];
}

function createPesananStaff($umkm_id): array
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
| Pesanan Tests
|--------------------------------------------------------------------------
*/

test('owner can create pesanan and auto calculate subtotal and priority', function () {
    [$owner, $umkm, $token] = createPesananOwner();
    
    // Bikin produk
    $produk = Produk::create([
        'umkm_id' => $umkm->id,
        'nama' => 'Burger',
        'harga' => 30000,
    ]);

    $deadline = Carbon::now()->addDays(5)->toDateString(); // Prioritas sedang

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/pesanan', [
        'pelanggan' => 'Budi',
        'tenggat_waktu' => $deadline,
        'items' => [
            [
                'produk_id' => $produk->id,
                'kuantitas' => 2
            ]
        ]
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('pesanan.pelanggan', 'Budi')
        ->assertJsonPath('pesanan.total_harga', 60000) // 30k * 2
        ->assertJsonPath('pesanan.prioritas', 'sedang');

    $this->assertDatabaseHas('pesanans', [
        'pelanggan' => 'Budi',
        'prioritas' => 'sedang',
        'total_harga' => 60000
    ]);

    $this->assertDatabaseHas('pesanan_items', [
        'produk_id' => $produk->id,
        'kuantitas' => 2,
        'subtotal' => 60000
    ]);
});

test('priority logic works for tinggi and rendah', function () {
    [$owner, $umkm, $token] = createPesananOwner();
    $produk = Produk::create(['umkm_id' => $umkm->id, 'nama' => 'Roti', 'harga' => 10000]);

    // Tinggi: <= 2 days
    $this->actingAs($owner)->postJson('/api/pesanan', [
        'pelanggan' => 'Tinggi',
        'tenggat_waktu' => Carbon::now()->addDays(1)->toDateString(),
        'items' => [['produk_id' => $produk->id, 'kuantitas' => 1]]
    ])->assertJsonPath('pesanan.prioritas', 'tinggi');

    // Rendah: > 7 days
    $this->actingAs($owner)->postJson('/api/pesanan', [
        'pelanggan' => 'Rendah',
        'tenggat_waktu' => Carbon::now()->addDays(10)->toDateString(),
        'items' => [['produk_id' => $produk->id, 'kuantitas' => 1]]
    ])->assertJsonPath('pesanan.prioritas', 'rendah');
});

test('pesanan list is sorted correctly priority then deadline', function () {
    [$owner, $umkm, $token] = createPesananOwner();
    $produk = Produk::create(['umkm_id' => $umkm->id, 'nama' => 'Roti', 'harga' => 10]);

    Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'P1', 'tenggat_waktu' => Carbon::now()->addDays(10)]); // rendah
    Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'P2', 'tenggat_waktu' => Carbon::now()->addDays(1)]);  // tinggi

    $response = $this->actingAs($owner)->getJson('/api/pesanan');

    $response->assertStatus(200);
    $data = $response->json('pesanan');
    
    // First should be P2, second should be P1
    expect($data[0]['pelanggan'])->toBe('P2');
    expect($data[0]['prioritas'])->toBe('tinggi');
    expect($data[1]['pelanggan'])->toBe('P1');
    expect($data[1]['prioritas'])->toBe('rendah');
});

test('staff can create and update pesanan', function () {
    [$owner, $umkm, $ownerToken] = createPesananOwner();
    [$staff, $staffToken] = createPesananStaff($umkm->id);
    
    $produk = Produk::create(['umkm_id' => $umkm->id, 'nama' => 'Ayam', 'harga' => 15000]);

    // Create via staff
    $createResponse = $this->actingAs($staff)->postJson('/api/pesanan', [
        'pelanggan' => 'Andi',
        'tenggat_waktu' => Carbon::now()->addDays(1)->toDateString(),
        'items' => [['produk_id' => $produk->id, 'kuantitas' => 1]]
    ]);

    $createResponse->assertStatus(201);
    $pesananId = $createResponse->json('pesanan.id');

    // Update status via staff
    $updateResponse = $this->actingAs($staff)->putJson("/api/pesanan/{$pesananId}/status", [
        'status' => 'diproses'
    ]);

    $updateResponse->assertStatus(200)
        ->assertJsonPath('pesanan.status', 'diproses');
});

test('cannot create pesanan with products from other umkm', function () {
    [$owner1, $umkm1, $token1] = createPesananOwner();
    [$owner2, $umkm2, $token2] = createPesananOwner();

    $produk2 = Produk::create(['umkm_id' => $umkm2->id, 'nama' => 'Punya Owner 2', 'harga' => 15000]);

    $response = $this->actingAs($owner1)->postJson('/api/pesanan', [
        'pelanggan' => 'Maling',
        'tenggat_waktu' => Carbon::now()->addDays(1)->toDateString(),
        'items' => [['produk_id' => $produk2->id, 'kuantitas' => 1]]
    ]);

    // Assuming we throw \Exception, Laravel error handler might return 500, or we could handle it politely.
    // In our code we throw Exception -> returns 500 in testing
    $response->assertStatus(500);
});
