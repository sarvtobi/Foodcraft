<?php

use App\Models\User;
use App\Models\Umkm;
use App\Models\BahanBaku;
use App\Models\Pesanan;
use App\Models\JadwalProduksi;
use App\Models\RiwayatKeterlambatan;
use App\Models\PengaturanKapasitas;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dasbor analitik mengembalikan struktur dan metrik yang akurat', function () {
    $owner = User::factory()->create(['role' => 'owner']);
    $umkm  = Umkm::create(['name' => 'UMKM Analitik', 'owner_id' => $owner->id]);
    PengaturanKapasitas::create([
        'umkm_id'             => $umkm->id,
        'kapasitas_harian_menit' => 480,
        'hari_operasi'        => ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"],
    ]);

    // Bahan baku sehat
    BahanBaku::create(['umkm_id' => $umkm->id, 'nama' => 'Tepung', 'satuan' => 'kg', 'stok' => 100, 'stok_minimum' => 20]);

    // Pesanan selesai tepat waktu
    Pesanan::create([
        'umkm_id'          => $umkm->id,
        'pelanggan'        => 'P1',
        'tenggat_waktu'    => Carbon::now()->addDays(2),
        'status'           => 'selesai',
        'diselesaikan_pada'=> Carbon::now(),
    ]);

    // Pesanan selesai terlambat
    $p2 = Pesanan::create([
        'umkm_id'          => $umkm->id,
        'pelanggan'        => 'P2',
        'tenggat_waktu'    => Carbon::now()->subDays(2),
        'status'           => 'selesai',
        'diselesaikan_pada'=> Carbon::now(),
    ]);
    RiwayatKeterlambatan::create([
        'umkm_id'          => $umkm->id,
        'pesanan_id'       => $p2->id,
        'tenggat_waktu'    => $p2->tenggat_waktu,
        'diselesaikan_pada'=> Carbon::now(),
        'selisih_hari'     => 2,
    ]);

    // Pesanan diproses
    Pesanan::create([
        'umkm_id'       => $umkm->id,
        'pelanggan'     => 'P3',
        'tenggat_waktu' => Carbon::now()->addDays(5),
        'status'        => 'diproses',
    ]);

    $response = $this->actingAs($owner)->getJson('/api/owner/dasbor-analitik');

    $response->assertStatus(200);
    $json = $response->json();

    // Periksa status dan struktur utama
    expect($json['status'])->toBe('success');
    expect($json['data'])->toHaveKeys([
        'periode', 'last_updated', 'statistik_utama',
        'grafik_performa', 'ringkasan_produksi', 'notifikasi_stok',
    ]);

    // statistik_utama memiliki 4 kunci
    expect($json['data']['statistik_utama'])->toHaveKeys([
        'total_output', 'tingkat_keterlambatan', 'status_bahan_baku', 'mitra_aktif',
    ]);

    // Grafik performa memiliki 12 bulan
    expect(count($json['data']['grafik_performa']))->toBe(12);

    // Tingkat keterlambatan = 1 telat / 2 selesai = 50%
    expect((float)$json['data']['statistik_utama']['tingkat_keterlambatan']['value'])->toBe(50.0);

    // Status bahan baku = 100% (1 bahan di atas minimum)
    expect((float)$json['data']['statistik_utama']['status_bahan_baku']['value'])->toBe(100.0);
    expect($json['data']['statistik_utama']['status_bahan_baku']['label'])->toBe('Sehat');

    // Mitra aktif = 3 pelanggan unik (P1, P2, P3)
    expect($json['data']['statistik_utama']['mitra_aktif']['value'])->toBe(3);
});
