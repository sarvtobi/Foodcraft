<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use App\Models\User;

class ActivityLogController extends Controller
{
    /**
     * Super Admin: Lihat riwayat aktivitas login
     * GET /api/admin/activity-logs
     */
    public function adminLoginLogs(Request $request)
    {
        $logs = Activity::with('causer')
            ->where('log_name', 'auth')
            ->where('event', 'login')
            ->latest()
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    /**
     * Owner: Lihat semua aktivitas yang terjadi di UMKM-nya
     * GET /api/owner/activity-logs
     */
    public function ownerLogs(Request $request)
    {
        $user = $request->user();
        
        // Dapatkan UMKM milik Owner
        $umkm = $user->ownedUmkm;
        if (!$umkm) {
            return response()->json(['message' => 'UMKM not found for this owner'], 404);
        }

        // Ambil ID owner dan ID staff UMKM ini
        $causerIds = $umkm->staffs()->pluck('id')->toArray();
        $causerIds[] = $user->id; // tambahkan id owner sendiri

        $logs = Activity::with(['causer', 'subject'])
            ->whereIn('causer_id', $causerIds)
            ->where('causer_type', User::class)
            ->latest()
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    /**
     * Staff: Lihat semua aktivitas yang terjadi di UMKM tempatnya bekerja
     * GET /api/staff/activity-logs
     */
    public function staffLogs(Request $request)
    {
        $user = $request->user();
        
        // Dapatkan UMKM tempat staff bekerja
        $umkm = $user->umkm;
        if (!$umkm) {
            return response()->json(['message' => 'Staff is not assigned to any UMKM'], 404);
        }

        // Ambil ID owner dan ID semua staff di UMKM ini
        $causerIds = $umkm->staffs()->pluck('id')->toArray();
        $causerIds[] = $umkm->owner_id; // tambahkan id owner

        $logs = Activity::with(['causer', 'subject'])
            ->whereIn('causer_id', $causerIds)
            ->where('causer_type', User::class)
            ->latest()
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }
}
