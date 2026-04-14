<?php

namespace App\Http\Controllers;

use App\Models\PengaturanKapasitas;
use Illuminate\Http\Request;

class KapasitasController extends Controller
{
    /**
     * Get UMKM Capacity settings (For Owner & Staff)
     */
    public function show(Request $request)
    {
        $umkm = $request->user()->umkm ?? $request->user()->ownedUmkm;

        if (!$umkm) {
            return response()->json(['message' => 'UMKM not found'], 404);
        }

        $kapasitas = $umkm->pengaturanKapasitas;

        if (!$kapasitas) {
            // Default capacity if not set yet
            return response()->json([
                'message'   => 'Pengaturan Kapasitas retrieved',
                'kapasitas' => [
                    'kapasitas_harian_menit' => 480, // 8 hours default
                    'hari_operasi' => ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
                ]
            ], 200);
        }

        return response()->json([
            'message'   => 'Pengaturan Kapasitas retrieved',
            'kapasitas' => $kapasitas,
        ], 200);
    }

    /**
     * Upsert Capacity settings (Owner only)
     */
    public function upsert(Request $request)
    {
        $umkm = $request->user()->ownedUmkm;

        if (!$umkm) {
            return response()->json(['message' => 'You must create a UMKM first'], 403);
        }

        $validated = $request->validate([
            'kapasitas_harian_menit' => 'required|integer|min:1',
            'hari_operasi'           => 'required|array',
            'hari_operasi.*'         => 'string',
        ]);

        $kapasitas = PengaturanKapasitas::updateOrCreate(
            ['umkm_id' => $umkm->id],
            [
                'kapasitas_harian_menit' => $validated['kapasitas_harian_menit'],
                'hari_operasi'           => $validated['hari_operasi'],
            ]
        );

        return response()->json([
            'message'   => 'Pengaturan kapasitas berhasil disimpan',
            'kapasitas' => $kapasitas,
        ], 200);
    }
}
