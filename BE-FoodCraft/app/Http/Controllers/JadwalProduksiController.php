<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\JadwalProduksi;
use App\Models\Pesanan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JadwalProduksiController extends Controller
{
    /**
     * Tampilkan jadwal produksi hari ini (Staff & Owner)
     */
    public function index(Request $request)
    {
        $umkm = $request->user()->umkm ?? $request->user()->ownedUmkm;
        
        // Parameter date for filtering, default to today
        $tanggal = $request->query('tanggal', Carbon::today()->toDateString());

        $jadwal = JadwalProduksi::with('pesanan.items.produk')
            ->where('umkm_id', $umkm->id)
            ->whereDate('tanggal_produksi', $tanggal)
            ->get();

        return response()->json([
            'message' => 'Jadwal produksi retrieved',
            'jadwal'  => $jadwal,
        ], 200);
    }

    /**
     * Jadwalkan pesanan (Owner/Sistem)
     * Capacity Constraint Engine & Material Booking
     */
    public function jadwalkan(Request $request, $pesanan_id)
    {
        $umkm = $request->user()->ownedUmkm;

        if (!$umkm) {
            return response()->json(['message' => 'Hanya Owner yang bisa menjadwalkan'], 403);
        }

        $pesanan = Pesanan::with('items.produk.resep')->where('id', $pesanan_id)->where('umkm_id', $umkm->id)->first();
        
        if (!$pesanan) return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        if ($pesanan->status !== 'pending') return response()->json(['message' => 'Pesanan sudah dijadwalkan atau tidak valid'], 400);

        // 1. Hitung Total Waktu
        $totalWaktuMenit = 0;
        foreach ($pesanan->items as $item) {
            $totalWaktuMenit += ($item->produk->waktu_produksi * $item->kuantitas);
        }

        // Jika tidak memakan waktu, fallback
        if ($totalWaktuMenit == 0) {
            $totalWaktuMenit = 1;
        }

        // 2. Cek Stok Bahan Baku (Estimasi ketersediaan)
        $bahanDibutuhkan = []; 
        foreach ($pesanan->items as $item) {
            foreach ($item->produk->resep as $resep) {
                if (!isset($bahanDibutuhkan[$resep->bahan_baku_id])) {
                    $bahanDibutuhkan[$resep->bahan_baku_id] = 0;
                }
                $bahanDibutuhkan[$resep->bahan_baku_id] += ($resep->kuantitas * $item->kuantitas);
            }
        }

        // Validasi ketersediaan stok
        foreach ($bahanDibutuhkan as $bahan_id => $qtyDibutuhkan) {
            $bahan = BahanBaku::find($bahan_id);
            $sisaStokBebas = $bahan->stok - $bahan->stok_dialokasikan;
            if ($sisaStokBebas < $qtyDibutuhkan) {
                return response()->json([
                    'message' => "Stok bahan baku '{$bahan->nama}' tidak mencukupi untuk memenuhi pesanan ini. (Sisa bebas: {$sisaStokBebas}{$bahan->satuan}, Dibutuhkan: {$qtyDibutuhkan}{$bahan->satuan})"
                ], 422);
            }
        }

        // 3. Scheduling (Constraint Engine)
        $kapasitasSetting = $umkm->pengaturanKapasitas;
        $maxKapasitasHarian = $kapasitasSetting ? $kapasitasSetting->kapasitas_harian_menit : 480;
        $hariOperasi = $kapasitasSetting ? $kapasitasSetting->hari_operasi : ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        
        // Translasi hari PHP ke format Indonesia
        $mapDays = [0 => 'Minggu', 1 => 'Senin', 2 => 'Selasa', 3 => 'Rabu', 4 => 'Kamis', 5 => 'Jumat', 6 => 'Sabtu'];

        $tanggalCek = Carbon::today();
        $hariDitemukan = null;

        // Mencari hari dengan slot kosong
        for ($i = 0; $i < 30; $i++) { // Limit pencarian max 30 hari ke depan
            $namaHari = $mapDays[$tanggalCek->dayOfWeek];
            
            if (in_array($namaHari, $hariOperasi)) {
                // Berapa waktu yang sudah kepakai di hari ini?
                $terpakai = JadwalProduksi::where('umkm_id', $umkm->id)
                                ->whereDate('tanggal_produksi', $tanggalCek->toDateString())
                                ->sum('total_waktu_menit');

                $sisaKapasitas = $maxKapasitasHarian - $terpakai;
                
                if ($sisaKapasitas >= $totalWaktuMenit) {
                    $hariDitemukan = $tanggalCek->copy();
                    break;
                }
            }
            $tanggalCek->addDay();
        }

        if (!$hariDitemukan) {
            return response()->json(['message' => 'Tidak dapat menemukan jadwal kosong dalam 30 hari ke depan karena kapasitas penuh.'], 422);
        }

        // Cek apakah tanggal yang didapat melewati tenggat pesanan
        $tenggatWaktu = Carbon::parse($pesanan->tenggat_waktu)->startOfDay();
        $terlambat = $hariDitemukan->greaterThan($tenggatWaktu);

        return DB::transaction(function () use ($umkm, $pesanan, $hariDitemukan, $totalWaktuMenit, $terlambat, $bahanDibutuhkan) {
            // Allocate material
            foreach ($bahanDibutuhkan as $bahan_id => $qtyDibutuhkan) {
                $bahan = BahanBaku::find($bahan_id);
                $bahan->increment('stok_dialokasikan', $qtyDibutuhkan);
            }

            // Create jadwal
            $jadwal = JadwalProduksi::create([
                'umkm_id' => $umkm->id,
                'pesanan_id' => $pesanan->id,
                'tanggal_produksi' => $hariDitemukan->toDateString(),
                'total_waktu_menit' => $totalWaktuMenit,
                'status' => 'menunggu',
                'terlambat' => $terlambat
            ]);

            // Ubah status pesanan
            $pesanan->update(['status' => 'diproses']);

            return response()->json([
                'message' => 'Berhasil dijadwalkan',
                'terlambat' => $terlambat,
                'jadwal' => $jadwal
            ], 200);
        });
    }

    /**
     * Realisasi & Pemotongan Stok Aktual (Staff)
     */
    public function selesai(Request $request, $id)
    {
        $umkm = $request->user()->umkm ?? $request->user()->ownedUmkm;

        $jadwal = JadwalProduksi::with('pesanan.items.produk.resep')
            ->where('id', $id)
            ->where('umkm_id', $umkm->id)
            ->first();

        if (!$jadwal) return response()->json(['message' => 'Jadwal tidak ditemukan'], 404);
        if ($jadwal->status === 'selesai') return response()->json(['message' => 'Jadwal ini sudah diselesaikan'], 400);

        return DB::transaction(function () use ($jadwal) {
            // Hitung bahan yang "dibekukan" sebelumnya
            $bahanDibutuhkan = []; 
            foreach ($jadwal->pesanan->items as $item) {
                foreach ($item->produk->resep as $resep) {
                    if (!isset($bahanDibutuhkan[$resep->bahan_baku_id])) {
                        $bahanDibutuhkan[$resep->bahan_baku_id] = 0;
                    }
                    $bahanDibutuhkan[$resep->bahan_baku_id] += ($resep->kuantitas * $item->kuantitas);
                }
            }

            // Kurangi stok riil & lepaskan stok dialokasikan
            foreach ($bahanDibutuhkan as $bahan_id => $qtyDibutuhkan) {
                $bahan = BahanBaku::find($bahan_id);
                $bahan->stok -= $qtyDibutuhkan;
                $bahan->stok_dialokasikan -= $qtyDibutuhkan;
                
                // Safety net in case of negative values
                if ($bahan->stok < 0) $bahan->stok = 0;
                if ($bahan->stok_dialokasikan < 0) $bahan->stok_dialokasikan = 0;
                
                $bahan->save();
            }

            // Update jadwal & pesanan
            $jadwal->update(['status' => 'selesai']);
            
            $waktuSelesai = Carbon::now();
            $jadwal->pesanan->update([
                'status' => 'selesai',
                'diselesaikan_pada' => $waktuSelesai
            ]);

            // Pengecekan Riwayat Keterlambatan Real-Time
            $tenggatWaktu = Carbon::parse($jadwal->pesanan->tenggat_waktu)->endOfDay();
            if ($waktuSelesai->greaterThan($tenggatWaktu)) {
                $selisihHari = $waktuSelesai->diffInDays($tenggatWaktu);
                // Ensure it counts at least 1 day if it crosses midnight
                if ($selisihHari == 0) $selisihHari = 1;

                \App\Models\RiwayatKeterlambatan::create([
                    // 'umkm_id' => $umkm->id,
                    'pesanan_id' => $jadwal->pesanan->id,
                    'tenggat_waktu' => $jadwal->pesanan->tenggat_waktu,
                    'diselesaikan_pada' => $waktuSelesai,
                    'selisih_hari' => $selisihHari,
                ]);
            }

            return response()->json([
                'message' => 'Produksi selesai. Stok bahan baku telah dipotong.'
            ], 200);
        });
    }
}
