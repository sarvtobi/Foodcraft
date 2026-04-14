<?php

use App\Models\User;
use App\Models\Umkm;
use App\Models\Pesanan;
use App\Models\JadwalProduksi;
use App\Models\RiwayatKeterlambatan;
use App\Models\PengaturanKapasitas;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dasbor analitik mengembalikan metrik yang akurat', function () {
    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create(['name' => 'UMKM Analitik', 'owner_id' => $owner->id]);
    PengaturanKapasitas::create(['umkm_id' => $umkm->id, 'kapasitas_harian_menit' => 480, 'hari_operasi' => ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]]);
    
    // 1. Pesanan Selesai (Tepat Waktu) -> tgl skrg = dibwah tenggat (misal tenggat besok)
    $p1 = Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'P1', 'tenggat_waktu' => Carbon::now()->addDays(2), 'status' => 'selesai', 'diselesaikan_pada' => Carbon::now()]);
    
    // 2. Pesanan Selesai (Terlambat) -> tenggat sdh lewat
    $p2 = Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'P2', 'tenggat_waktu' => Carbon::now()->subDays(2), 'status' => 'selesai', 'diselesaikan_pada' => Carbon::now()]);
    RiwayatKeterlambatan::create(['umkm_id' => $umkm->id, 'pesanan_id' => $p2->id, 'tenggat_waktu' => $p2->tenggat_waktu, 'diselesaikan_pada' => Carbon::now(), 'selisih_hari' => 2]);

    // 3. Pesanan Diproses
    $p3 = Pesanan::create(['umkm_id' => $umkm->id, 'pelanggan' => 'P3', 'tenggat_waktu' => Carbon::now()->addDays(5), 'status' => 'diproses']);

    // 4. Jadwal Produksi untk utilisasi (terpakai 240 menit)
    JadwalProduksi::create(['umkm_id' => $umkm->id, 'pesanan_id' => $p1->id, 'tanggal_produksi' => Carbon::now()->toDateString(), 'total_waktu_menit' => 240]);

    $response = $this->actingAs($owner)->getJson('/api/owner/dasbor-analitik');

    $response->assertStatus(200);
    $data = $response->json();

    expect($data['performa_pesanan']['total_masuk'])->toBe(3);
    expect($data['performa_pesanan']['selesai'])->toBe(2);
    expect($data['performa_pesanan']['sedang_diproses'])->toBe(1);
    expect($data['performa_pesanan']['terlambat'])->toBe(1);

    // OTD (Ketepatan Waktu): 1 Tepat Waktu / 2 Selesai = 50%
    expect($data['ketepatan_waktu_persen'])->toBe(50);

    // Utilisasi = 240 / (HariBulanIni * 480) * 100
    // Asumsikan bulan ini minimal ada 28 hari kerja karena Senin-Minggu ON
    $expectedKapasitas = Carbon::now()->daysInMonth * 480;
    $expectedUtilisasi = round((240 / $expectedKapasitas) * 100, 2);
    expect($data['utilisasi_kapasitas_persen'])->toBe($expectedUtilisasi);
});
