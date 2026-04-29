<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\JadwalProduksi;
use App\Models\RiwayatKeterlambatan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalisisController extends Controller
{
    /**
     * Menampilkan metrik dasbor baru.
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
        $endOfMonth   = Carbon::parse($periode . '-01')->endOfMonth();

        // ─── Bulan Sebelumnya untuk Tren ───────────────────────────────────────
        $startPrevMonth = $startOfMonth->copy()->subMonth()->startOfMonth();
        $endPrevMonth   = $startOfMonth->copy()->subMonth()->endOfMonth();

        // ======================================================================
        // 1. STATISTIK UTAMA
        // ======================================================================

        // --- Total Output (kuantitas produk yang sudah selesai diproduksi) ---
        $totalOutputBulanIni = DB::table('pesanan_items')
            ->join('pesanans', 'pesanan_items.pesanan_id', '=', 'pesanans.id')
            ->where('pesanans.umkm_id', $umkm->id)
            ->where('pesanans.status', 'selesai')
            ->whereBetween('pesanans.diselesaikan_pada', [$startOfMonth, $endOfMonth])
            ->sum('pesanan_items.kuantitas');

        $totalOutputBulanLalu = DB::table('pesanan_items')
            ->join('pesanans', 'pesanan_items.pesanan_id', '=', 'pesanans.id')
            ->where('pesanans.umkm_id', $umkm->id)
            ->where('pesanans.status', 'selesai')
            ->whereBetween('pesanans.diselesaikan_pada', [$startPrevMonth, $endPrevMonth])
            ->sum('pesanan_items.kuantitas');

        $trendOutput = $totalOutputBulanLalu > 0
            ? round((($totalOutputBulanIni - $totalOutputBulanLalu) / $totalOutputBulanLalu) * 100, 1)
            : 0;

        // --- Tingkat Keterlambatan ---
        $totalSelesaiBulanIni = Pesanan::where('umkm_id', $umkm->id)
            ->where('status', 'selesai')
            ->whereBetween('diselesaikan_pada', [$startOfMonth, $endOfMonth])
            ->count();

        $totalTelatBulanIni = RiwayatKeterlambatan::where('umkm_id', $umkm->id)
            ->whereBetween('diselesaikan_pada', [$startOfMonth, $endOfMonth])
            ->count();

        $tingkatKeterlambatan = $totalSelesaiBulanIni > 0
            ? round(($totalTelatBulanIni / $totalSelesaiBulanIni) * 100, 1)
            : 0;

        $totalSelesaiBulanLalu = Pesanan::where('umkm_id', $umkm->id)
            ->where('status', 'selesai')
            ->whereBetween('diselesaikan_pada', [$startPrevMonth, $endPrevMonth])
            ->count();
        $totalTelatBulanLalu = RiwayatKeterlambatan::where('umkm_id', $umkm->id)
            ->whereBetween('diselesaikan_pada', [$startPrevMonth, $endPrevMonth])
            ->count();
        $tingkatKeterlambatanLalu = $totalSelesaiBulanLalu > 0
            ? round(($totalTelatBulanLalu / $totalSelesaiBulanLalu) * 100, 1)
            : 0;
        $trendKeterlambatan = round($tingkatKeterlambatan - $tingkatKeterlambatanLalu, 1);

        // --- Status Bahan Baku (% bahan yg masih di atas stok minimum) ---
        $totalBahan    = BahanBaku::where('umkm_id', $umkm->id)->count();
        $bahanSehat    = BahanBaku::where('umkm_id', $umkm->id)
            ->whereColumn('stok', '>', 'stok_minimum')
            ->count();
        $persenBahanSehat = $totalBahan > 0 ? round(($bahanSehat / $totalBahan) * 100, 1) : 100;

        if ($persenBahanSehat >= 80) {
            $labelBahan = 'Sehat';
        } elseif ($persenBahanSehat >= 50) {
            $labelBahan = 'Waspada';
        } else {
            $labelBahan = 'Kritis';
        }

        // --- Jumlah Pesanan Aktif (sebagai "Mitra Aktif" konteks UMKM ini = jumlah pelanggan unik) ---
        $mitraAktifBulanIni  = Pesanan::where('umkm_id', $umkm->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->distinct('pelanggan')->count('pelanggan');
        $mitraAktifBulanLalu = Pesanan::where('umkm_id', $umkm->id)
            ->whereBetween('created_at', [$startPrevMonth, $endPrevMonth])
            ->distinct('pelanggan')->count('pelanggan');
        $trendMitra = $mitraAktifBulanIni - $mitraAktifBulanLalu;

        // ======================================================================
        // 2. GRAFIK PERFORMA (Seluruh bulan dalam tahun periode)
        // ======================================================================
        $tahun = substr($periode, 0, 4);
        $namaBulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

        $kapasitasSetting    = $umkm->pengaturanKapasitas;
        $maxKapasitasHarian  = $kapasitasSetting ? $kapasitasSetting->kapasitas_harian_menit : 480;
        $hariOperasi         = $kapasitasSetting
            ? $kapasitasSetting->hari_operasi
            : ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
        $mapDays = [0=>'Minggu',1=>'Senin',2=>'Selasa',3=>'Rabu',4=>'Kamis',5=>'Jumat',6=>'Sabtu'];

        $grafikPerforma = [];
        for ($m = 1; $m <= 12; $m++) {
            $sOM = Carbon::create($tahun, $m, 1)->startOfMonth();
            $eOM = Carbon::create($tahun, $m, 1)->endOfMonth();

            // Efisiensi = ketepatan waktu bulan itu
            $selesaiM = Pesanan::where('umkm_id', $umkm->id)
                ->where('status', 'selesai')
                ->whereBetween('diselesaikan_pada', [$sOM, $eOM])
                ->count();
            $telatM = RiwayatKeterlambatan::where('umkm_id', $umkm->id)
                ->whereBetween('diselesaikan_pada', [$sOM, $eOM])
                ->count();
            $efisiensi = $selesaiM > 0
                ? round((($selesaiM - $telatM) / $selesaiM) * 100, 1)
                : 0;

            // Kapasitas = % utilisasi kapasitas bulan itu
            $menitTerjadwal = JadwalProduksi::where('umkm_id', $umkm->id)
                ->whereBetween('tanggal_produksi', [$sOM->toDateString(), $eOM->toDateString()])
                ->sum('total_waktu_menit');
            $hariKerja = 0;
            $tgl = $sOM->copy();
            while ($tgl->lte($eOM)) {
                if (in_array($mapDays[$tgl->dayOfWeek], $hariOperasi)) $hariKerja++;
                $tgl->addDay();
            }
            $totalKapasitas = $hariKerja * $maxKapasitasHarian;
            $kapasitasPersen = $totalKapasitas > 0
                ? round(($menitTerjadwal / $totalKapasitas) * 100, 1)
                : 0;

            $grafikPerforma[] = [
                'bulan'     => $namaBulan[$m - 1],
                'efisiensi' => $efisiensi,
                'kapasitas' => $kapasitasPersen,
            ];
        }

        // ======================================================================
        // 3. RINGKASAN PRODUKSI (Top 5 Produk vs Target di periode ini)
        // ======================================================================
        $topProduk = DB::table('pesanan_items')
            ->join('pesanans', 'pesanan_items.pesanan_id', '=', 'pesanans.id')
            ->join('produks', 'pesanan_items.produk_id', '=', 'produks.id')
            ->where('pesanans.umkm_id', $umkm->id)
            ->whereBetween('pesanans.created_at', [$startOfMonth, $endOfMonth])
            ->select(
                'produks.nama as produk',
                DB::raw('SUM(pesanan_items.kuantitas) as aktual')
            )
            ->groupBy('produks.id', 'produks.nama')
            ->orderByDesc('aktual')
            ->limit(5)
            ->get();

        // Target = 120% dari aktual (estimasi realistis, bisa diganti kolom target di tabel produk)
        $ringkasanProduksi = $topProduk->map(function ($item) {
            $target   = (int) round($item->aktual * 1.2);
            $progress = $target > 0 ? round(($item->aktual / $target) * 100) : 0;
            return [
                'produk'   => $item->produk,
                'target'   => $target,
                'aktual'   => (int) $item->aktual,
                'satuan'   => 'pcs',
                'progress' => $progress,
            ];
        });

        // ======================================================================
        // 4. NOTIFIKASI STOK (Bahan Baku yang di bawah / mendekati minimum)
        // ======================================================================
        $bahanKritis = BahanBaku::where('umkm_id', $umkm->id)
            ->whereRaw('stok <= stok_minimum * 1.5')
            ->orderByRaw('stok / NULLIF(stok_minimum, 0) ASC')
            ->limit(5)
            ->get();

        $notifikasiStok = $bahanKritis->map(function ($bahan) {
            $limit    = $bahan->stok_minimum > 0 ? $bahan->stok_minimum * 2 : 100;
            $progress = $limit > 0 ? round(($bahan->stok / $limit) * 100) : 100;

            if ($bahan->stok <= $bahan->stok_minimum) {
                $status = 'Kritis';
            } elseif ($bahan->stok <= $bahan->stok_minimum * 1.5) {
                $status = 'Rendah';
            } else {
                $status = 'Sedang';
            }

            return [
                'bahan'    => $bahan->nama,
                'stok'     => (float) $bahan->stok,
                'limit'    => (float) $limit,
                'satuan'   => $bahan->satuan,
                'status'   => $status,
                'progress' => $progress,
            ];
        });

        // ======================================================================
        // RESPONSE
        // ======================================================================
        return response()->json([
            'status' => 'success',
            'data'   => [
                'periode'      => $periode,
                'last_updated' => Carbon::now()->toDateString(),

                'statistik_utama' => [
                    'total_output' => [
                        'value'        => (int) $totalOutputBulanIni,
                        'unit'         => 'Unit',
                        'trend_persen' => $trendOutput,
                        'is_up'        => $trendOutput >= 0,
                    ],
                    'tingkat_keterlambatan' => [
                        'value'        => $tingkatKeterlambatan,
                        'unit'         => '%',
                        'trend_persen' => $trendKeterlambatan,
                        'is_up'        => $trendKeterlambatan > 0, // naik = buruk utk keterlambatan
                    ],
                    'status_bahan_baku' => [
                        'value'        => $persenBahanSehat,
                        'unit'         => '%',
                        'label'        => $labelBahan,
                        'trend_persen' => 0, // bisa dikembangkan dgn data historis stok
                        'is_up'        => $persenBahanSehat >= 80,
                    ],
                    'mitra_aktif' => [
                        'value'       => $mitraAktifBulanIni,
                        'unit'        => 'Pelanggan',
                        'trend_value' => $trendMitra,
                        'is_up'       => $trendMitra >= 0,
                    ],
                ],

                'grafik_performa'   => $grafikPerforma,
                'ringkasan_produksi' => $ringkasanProduksi,
                'notifikasi_stok'   => $notifikasiStok,
            ],
        ], 200);
    }
}
