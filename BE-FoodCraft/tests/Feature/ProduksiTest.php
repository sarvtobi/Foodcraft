<?php

use App\Models\User;
use App\Models\Umkm;
use App\Models\Produk;
use App\Models\BahanBaku;
use App\Models\ResepProduk;
use App\Models\Pesanan;
use App\Models\PesananItem;
use App\Models\PengaturanKapasitas;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function createEngineOwner(): array
{
    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create([
        'name'     => 'UMKM Engine',
        'owner_id' => $owner->id,
    ]);
    
    // Setting kapasitas (e.g. 100 menit perhari agar mudah mensimulasikan kepenuhan)
    PengaturanKapasitas::create([
        'umkm_id' => $umkm->id,
        'kapasitas_harian_menit' => 100,
        'hari_operasi' => ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    ]);

    $token = $owner->createToken('owner_token')->plainTextToken;

    return [$owner, $umkm, $token];
}

function createEngineStaff($umkm_id): array
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
| Engine Tests (Constraint + Realtime Deduction)
|--------------------------------------------------------------------------
*/

test('pesanan dijadwalkan mengurangi stok alokasi dan membuat jadwal', function () {
    [$owner, $umkm, $ownerToken] = createEngineOwner();
    
    // 1. Buat Bahan Baku (Tepung 5000g)
    $tepung = BahanBaku::create(['umkm_id' => $umkm->id, 'nama' => 'Tepung', 'satuan' => 'gram', 'stok' => 5000]);

    // 2. Buat Produk dgn Waktu 30 menit
    $roti = Produk::create(['umkm_id' => $umkm->id, 'nama' => 'Roti', 'harga' => 10000, 'waktu_produksi' => 30]);

    // 3. Buat Resep (1 Roti = 200g Tepung)
    ResepProduk::create(['produk_id' => $roti->id, 'bahan_baku_id' => $tepung->id, 'kuantitas' => 200]);

    // 4. Buat Pesanan (2 Roti) via Controller API
    $pesananResponse = $this->actingAs($owner)->postJson('/api/pesanan', [
        'pelanggan' => 'Andi',
        'tenggat_waktu' => Carbon::now()->addDays(5)->toDateString(),
        'items' => [['produk_id' => $roti->id, 'kuantitas' => 2]]
    ]);
    
    $pesanan_id = $pesananResponse->json('pesanan.id');

    // 5. Trigger Mesin Jadwal
    $jadwalResponse = $this->actingAs($owner)->postJson("/api/owner/pesanan/{$pesanan_id}/jadwalkan");

    $jadwalResponse->assertStatus(200)
        ->assertJsonPath('terlambat', false);

    // Assert: Waktu yg dijadwalkan = 30 * 2 = 60 menit
    $this->assertDatabaseHas('jadwal_produksis', [
        'pesanan_id' => $pesanan_id,
        'total_waktu_menit' => 60,
        'status' => 'menunggu',
    ]);

    // Assert: Bahan baku dialokasikan = 200g * 2 = 400g
    $this->assertDatabaseHas('bahan_bakus', [
        'id' => $tepung->id,
        'stok_dialokasikan' => 400,
        'stok' => 5000 // Stok riil tak berkurang dulu
    ]);
    
    // Assert: Status pesanan menjadi diproses
    $this->assertDatabaseHas('pesanans', [
        'id' => $pesanan_id,
        'status' => 'diproses'
    ]);
});

test('pesanan ditolak jika stok riil tidak memadai', function () {
    [$owner, $umkm, $ownerToken] = createEngineOwner();
    // Stok hanya 100g
    $tepung = BahanBaku::create(['umkm_id' => $umkm->id, 'nama' => 'Tepung', 'satuan' => 'gram', 'stok' => 100]);
    $roti = Produk::create(['umkm_id' => $umkm->id, 'nama' => 'Roti', 'harga' => 10000, 'waktu_produksi' => 30]);
    ResepProduk::create(['produk_id' => $roti->id, 'bahan_baku_id' => $tepung->id, 'kuantitas' => 200]);

    // Pesan 1 Roti (Butuh 200g, Stok 100g)
    $pesanan = Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'Andi', 'tenggat_waktu' => Carbon::now()->addDays(5)->toDateString()]);
    PesananItem::create(['pesanan_id' => $pesanan->id, 'produk_id' => $roti->id, 'kuantitas' => 1, 'harga_satuan' => 10000, 'subtotal' => 10000]);

    $response = $this->actingAs($owner)->postJson("/api/owner/pesanan/{$pesanan->id}/jadwalkan");

    $response->assertStatus(422); // Harus gagal validasi stok
});

test('mesin melempar jadwal keesokan hari jika kapasitas penuh hari ini', function () {
    [$owner, $umkm, $ownerToken] = createEngineOwner();
    $tepung = BahanBaku::create(['umkm_id' => $umkm->id, 'nama' => 'Tepung', 'satuan' => 'gram', 'stok' => 50000]);
    // Waktu produksi 60 menit per pcs. Ingat! Kapasitas UMKM engine ini 100 menit/hari.
    $roti = Produk::create(['umkm_id' => $umkm->id, 'nama' => 'Roti Lama', 'harga' => 10000, 'waktu_produksi' => 60]);
    ResepProduk::create(['produk_id' => $roti->id, 'bahan_baku_id' => $tepung->id, 'kuantitas' => 1]);

    // Pesanan 1 (Butuh 60 menit). Akan dijadwalkan HARI INI
    $pesanan1 = Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'A', 'tenggat_waktu' => Carbon::now()->addDays(2)]);
    PesananItem::create(['pesanan_id' => $pesanan1->id, 'produk_id' => $roti->id, 'kuantitas' => 1, 'harga_satuan' => 100, 'subtotal' => 100]);
    $this->actingAs($owner)->postJson("/api/owner/pesanan/{$pesanan1->id}/jadwalkan")->assertStatus(200);

    // Pesanan 2 (Butuh 60 menit). HARI INI sisa 40 menit, jadi akan DILEMPAR KE BESOK.
    $pesanan2 = Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'B', 'tenggat_waktu' => Carbon::now()->addDays(2)]);
    PesananItem::create(['pesanan_id' => $pesanan2->id, 'produk_id' => $roti->id, 'kuantitas' => 1, 'harga_satuan' => 100, 'subtotal' => 100]);
    
    $jadwalResponse = $this->actingAs($owner)->postJson("/api/owner/pesanan/{$pesanan2->id}/jadwalkan");
    $jadwalResponse->assertStatus(200);
    
    $jadwal1 = App\Models\JadwalProduksi::where('pesanan_id', $pesanan1->id)->first();
    $jadwal2 = App\Models\JadwalProduksi::where('pesanan_id', $pesanan2->id)->first();

    // Pastikan Jadwal 2 terjadi setelah Jadwal 1
    expect($jadwal2->tanggal_produksi)->not->toBe($jadwal1->tanggal_produksi);
    expect(Carbon::parse($jadwal2->tanggal_produksi)->greaterThan(Carbon::parse($jadwal1->tanggal_produksi)))->toBeTrue();
});

test('staff menyelesaikan jadwal akan mengurangi stok riil', function () {
    [$owner, $umkm, $ownerToken] = createEngineOwner();
    [$staff, $staffToken] = createEngineStaff($umkm->id);
    
    $tepung = BahanBaku::create(['umkm_id' => $umkm->id, 'nama' => 'Tepung', 'satuan' => 'gram', 'stok' => 5000, 'stok_dialokasikan' => 400]);
    $roti = Produk::create(['umkm_id' => $umkm->id, 'nama' => 'Roti', 'harga' => 10000, 'waktu_produksi' => 30]);
    ResepProduk::create(['produk_id' => $roti->id, 'bahan_baku_id' => $tepung->id, 'kuantitas' => 200]);

    $pesanan = Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'Andi', 'tenggat_waktu' => Carbon::now()->addDays(5)->toDateString()]);
    PesananItem::create(['pesanan_id' => $pesanan->id, 'produk_id' => $roti->id, 'kuantitas' => 2, 'harga_satuan' => 10, 'subtotal' => 20]);
    
    $jadwal = App\Models\JadwalProduksi::create([
        'umkm_id' => $umkm->id,
        'pesanan_id' => $pesanan->id,
        'tanggal_produksi' => Carbon::now()->toDateString(),
        'total_waktu_menit' => 60,
    ]);

    // Staff melihat daftar jadwal hari ini
    $listResponse = $this->actingAs($staff)->getJson('/api/staff/jadwal-produksi');
    $listResponse->assertStatus(200)->assertJsonPath('jadwal.0.pesanan_id', $pesanan->id);

    // Staff Selesaikan
    $selesaiResponse = $this->actingAs($staff)->postJson("/api/staff/jadwal-produksi/{$jadwal->id}/selesai");
    $selesaiResponse->assertStatus(200);

    // Cek Database (Stok harus terpotong -400 dan dialokasikan kembali turun -400)
    $this->assertDatabaseHas('bahan_bakus', [
        'id' => $tepung->id,
        'stok' => 4600,
        'stok_dialokasikan' => 0
    ]);

    $this->assertDatabaseHas('jadwal_produksis', [
        'id' => $jadwal->id,
        'status' => 'selesai'
    ]);
});
