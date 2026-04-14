<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\PesananItem;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PesananController extends Controller
{
    /**
     * List all orders for the UMKM, sorted by Priority (tinggi > sedang > rendah)
     * and closest deadline first. 
     */
    public function index(Request $request)
    {
        $umkm = $request->user()->umkm ?? $request->user()->ownedUmkm;

        if (!$umkm) {
            return response()->json(['message' => 'UMKM not found'], 404);
        }

        // Mapping prioritas for sorting: tinggi=1, sedang=2, rendah=3
        // We will use raw order by field to accomplish this since it's enum or strings
        $pesanans = Pesanan::with('items.produk')
            ->where('umkm_id', $umkm->id)
            ->orderByRaw("
                CASE prioritas 
                    WHEN 'tinggi' THEN 1 
                    WHEN 'sedang' THEN 2 
                    WHEN 'rendah' THEN 3 
                    ELSE 4 
                END
            ")
            ->orderBy('tenggat_waktu', 'asc')
            ->get();

        return response()->json([
            'message' => 'Pesanan retrieved successfully',
            'pesanan' => $pesanans,
        ], 200);
    }

    /**
     * Create a new order with multiple items.
     */
    public function store(Request $request)
    {
        $umkm = $request->user()->umkm ?? $request->user()->ownedUmkm;

        if (!$umkm) {
            return response()->json(['message' => 'UMKM not found'], 404);
        }

        $validated = $request->validate([
            'pelanggan'     => 'required|string|max:255',
            'tenggat_waktu' => 'required|date',
            'items'         => 'required|array|min:1',
            'items.*.produk_id' => 'required|exists:produks,id',
            'items.*.kuantitas' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated, $umkm) {
            // Create the order container first
            $pesanan = Pesanan::create([
                'umkm_id'       => $umkm->id,
                'pelanggan'     => $validated['pelanggan'],
                'tenggat_waktu' => $validated['tenggat_waktu'],
                'status'        => 'pending',
                // Priority is auto-calculated by the model hook!
            ]);

            $total_harga = 0;

            foreach ($validated['items'] as $itemData) {
                // Ensure product belongs to UMKM
                $produk = Produk::where('id', $itemData['produk_id'])
                    ->where('umkm_id', $umkm->id)
                    ->first();

                if (!$produk) {
                    throw new \Exception("Produk dengan ID {$itemData['produk_id']} tidak valid atau bukan milik UMKM ini.");
                }

                $subtotal = $produk->harga * $itemData['kuantitas'];
                $total_harga += $subtotal;

                PesananItem::create([
                    'pesanan_id'   => $pesanan->id,
                    'produk_id'    => $produk->id,
                    'kuantitas'    => $itemData['kuantitas'],
                    'harga_satuan' => $produk->harga, // snapshot price
                    'subtotal'     => $subtotal,
                ]);
            }

            // Update sum total
            $pesanan->update(['total_harga' => $total_harga]);
            $pesanan->load('items.produk');

            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'pesanan' => $pesanan,
            ], 201);
        });
    }

    /**
     * Show order details
     */
    public function show(Request $request, $id)
    {
        $umkm = $request->user()->umkm ?? $request->user()->ownedUmkm;

        $pesanan = Pesanan::with('items.produk')
            ->where('id', $id)
            ->where('umkm_id', $umkm->id ?? null)
            ->first();

        if (!$pesanan) {
            return response()->json(['message' => 'Pesanan not found'], 404);
        }

        return response()->json([
            'message' => 'Pesanan retrieved successfully',
            'pesanan' => $pesanan,
        ], 200);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $umkm = $request->user()->umkm ?? $request->user()->ownedUmkm;

        $pesanan = Pesanan::where('id', $id)
            ->where('umkm_id', $umkm->id ?? null)
            ->first();

        if (!$pesanan) {
            return response()->json(['message' => 'Pesanan not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,diproses,selesai,dibatalkan'
        ]);

        $pesanan->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui',
            'pesanan' => $pesanan,
        ], 200);
    }
}
