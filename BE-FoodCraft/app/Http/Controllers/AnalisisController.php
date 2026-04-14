<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\JadwalProduksi;
use App\Models\RiwayatKeterlambatan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AnalisisController extends Controller
{
    /**
     * Menampilkan metrik dasbor.
     * GET /api/owner/dasbor-analitik?periode=YYYY-MM
     */
    public function index(Request $request)
    {
        $umkm = $request->user()->ownedUmkm;

        if (!$umkm) {
            return response()->json(['message' => 'Hanya Owner yang bisa melihat dasbor analitik.'], 403);
        }

        $periode = $request->query('periode', Carbon::now()->format('Y-m'));
        $startOfMonth = Carbon::parse($periode . '-01')->startOfMonth();
        $endOfMonth = Carbon::parse($periode . '-01')->endOfMonth();

        // 1. Performa Pesanan (Status Aggregation)
        $pesanans = Pesanan::where('umkm_id', $umkm->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->get();

        $totalMasuk = $pesanans->count();
        $totalSelesai = $pesanans->where('status', 'selesai')->count();
        
        // Sedang diproses atau dijadwalkan
        $totalDiproses = $pesanans->where('status', 'diproses')->count();
        
        $totalBatal = $pesanans->where('status', 'dibatalkan')->count();

        // Riwayat Keterlambatan bulan ini
        $totalTelat = RiwayatKeterlambatan::where('umkm_id', $umkm->id)
            ->whereBetween('diselesaikan_pada', [$startOfMonth, $endOfMonth])
            ->count();

        // 2. Metrik Ketepatan Waktu (OTD %)
        // Dihitung berdasarkan pesanan yg selesai bulan ini.
        $pesanansSelesaiBulanIni = Pesanan::where('umkm_id', $umkm->id)
            ->where('status', 'selesai')
            ->whereBetween('diselesaikan_pada', [$startOfMonth, $endOfMonth])
            ->count();

        $persentaseKetepatanWaktu = 100;
        if ($pesanansSelesaiBulanIni > 0) {
            $pesananTepatWaktu = $pesanansSelesaiBulanIni - $totalTelat;
            $persentaseKetepatanWaktu = round(($pesananTepatWaktu / $pesanansSelesaiBulanIni) * 100, 2);
        } else if ($totalTelat > 0) {
             // Edge case if somehow things don't align
            $persentaseKetepatanWaktu = 0;
        }

        // 3. Utilisasi Kapasitas Harian (% Kapasitas)
        // Hitung total menit jadwal yang ada di bulan ini.
        $totalMenitTerjadwal = JadwalProduksi::where('umkm_id', $umkm->id)
            ->whereBetween('tanggal_produksi', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->sum('total_waktu_menit');

        $kapasitasSetting = $umkm->pengaturanKapasitas;
        $maxKapasitasHarian = $kapasitasSetting ? $kapasitasSetting->kapasitas_harian_menit : 480;
        $hariOperasi = $kapasitasSetting ? $kapasitasSetting->hari_operasi : ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        
        // Hitung total hari kerja operasi di bulan tersebut
        $jumlahHariKerja = 0;
        $mapDays = [0 => 'Minggu', 1 => 'Senin', 2 => 'Selasa', 3 => 'Rabu', 4 => 'Kamis', 5 => 'Jumat', 6 => 'Sabtu'];
        
        $tanggalPengecekan = $startOfMonth->copy();
        while ($tanggalPengecekan->lte($endOfMonth)) {
            $namaHari = $mapDays[$tanggalPengecekan->dayOfWeek];
            if (in_array($namaHari, $hariOperasi)) {
                // If it's a future date, it's still available capacity.
                // We'll calculate utilization based on the entire month's capacity.
                $jumlahHariKerja++;
            }
            $tanggalPengecekan->addDay();
        }

        $totalKapasitasBulanIni = $jumlahHariKerja * $maxKapasitasHarian;
        $utilisasiKapasitas = 0;
        if ($totalKapasitasBulanIni > 0) {
            $utilisasiKapasitas = round(($totalMenitTerjadwal / $totalKapasitasBulanIni) * 100, 2);
        }

        // 4. Produk Terfavorit (Top Selling)
        $topProduk = \Illuminate\Support\Facades\DB::table('pesanan_items')
            ->join('pesanans', 'pesanan_items.pesanan_id', '=', 'pesanans.id')
            ->join('produks', 'pesanan_items.produk_id', '=', 'produks.id')
            ->where('pesanans.umkm_id', $umkm->id)
            ->whereBetween('pesanans.created_at', [$startOfMonth, $endOfMonth])
            ->select('produks.nama', \Illuminate\Support\Facades\DB::raw('SUM(pesanan_items.kuantitas) as total_terjual'))
            ->groupBy('produks.id', 'produks.nama')
            ->orderByDesc('total_terjual')
            ->limit(5)
            ->get();

        return response()->json([
            'periode' => $periode,
            'performa_pesanan' => [
                'total_masuk' => $totalMasuk,
                'selesai' => $totalSelesai,
                'sedang_diproses' => $totalDiproses,
                'dibatalkan' => $totalBatal,
                'terlambat' => $totalTelat,
            ],
            'ketepatan_waktu_persen' => $persentaseKetepatanWaktu,
            'utilisasi_kapasitas_persen' => $utilisasiKapasitas,
            'top_produk' => $topProduk
        ], 200);
    }
}
