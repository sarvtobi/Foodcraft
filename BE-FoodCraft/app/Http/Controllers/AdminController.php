<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Umkm;
use App\Models\ApiRequestLog;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Super Admin Dashboard.
     *
     * GET /api/admin/dashboard
     */
    public function index(Request $request)
    {
        // 1. Growth & Trend Analytics (Tren Pertumbuhan)
        $totalUsersNow = User::count();
        $startOfThisMonth = now()->startOfMonth();

        $totalUsersBeforeThisMonth = User::where('created_at', '<', $startOfThisMonth)->count();
        if ($totalUsersBeforeThisMonth > 0) {
            $totalUsersGrowth = round((($totalUsersNow - $totalUsersBeforeThisMonth) / $totalUsersBeforeThisMonth) * 100, 2);
        } else {
            $totalUsersGrowth = $totalUsersNow > 0 ? 100.00 : 0.00;
        }

        $totalUmkmsNow = Umkm::count();

        $umkmCreatedThisMonth = Umkm::where('created_at', '>=', $startOfThisMonth)->count();
        $startOfLastMonth = now()->subMonth()->startOfMonth();
        $endOfLastMonth = now()->subMonth()->endOfMonth();
        $umkmCreatedLastMonth = Umkm::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $totalUmkmTrend = $umkmCreatedThisMonth >= $umkmCreatedLastMonth ? 'up' : 'down';

        // 2. System Health & Performance (Kesehatan Sistem)
        $last24Hours = now()->subDay();

        // Rata-rata latency (duration_ms) 24 jam terakhir. Jika kosong, fallback ke all-time, jika kosong lagi, 0.
        $avgLatencyMs = ApiRequestLog::where('created_at', '>=', $last24Hours)->avg('duration_ms');
        if ($avgLatencyMs === null) {
            $avgLatencyMs = ApiRequestLog::avg('duration_ms') ?? 0;
        }
        $avgLatencyMs = round((float) $avgLatencyMs, 2);

        // Success rate 24 jam terakhir (status_code < 500)
        $totalRequests24h = ApiRequestLog::where('created_at', '>=', $last24Hours)->count();
        if ($totalRequests24h > 0) {
            $successRequests24h = ApiRequestLog::where('created_at', '>=', $last24Hours)
                ->where('status_code', '<', 500)
                ->count();
            $successRatePercent = round(($successRequests24h / $totalRequests24h) * 100, 2);
        } else {
            // Fallback ke all-time
            $totalRequestsAll = ApiRequestLog::count();
            if ($totalRequestsAll > 0) {
                $successRequestsAll = ApiRequestLog::where('status_code', '<', 500)->count();
                $successRatePercent = round(($successRequestsAll / $totalRequestsAll) * 100, 2);
            } else {
                $successRatePercent = 100.00;
            }
        }

        // 3. User Activity Overview (Ringkasan Aktivitas)
        $activeUsers24h = ApiRequestLog::where('created_at', '>=', $last24Hours)
            ->whereNotNull('user_id')
            ->distinct()
            ->count('user_id');

        return response()->json([
            'status'  => 'success',
            'message' => 'Welcome Super Admin Dashboard',
            'user'    => $request->user(),
            'metrics' => [
                'total_users'        => $totalUsersNow,
                'total_users_growth' => $totalUsersGrowth,
                'total_umkms'        => $totalUmkmsNow,
                'total_umkm_trend'   => $totalUmkmTrend,
                'active_users_24h'   => $activeUsers24h,
            ],
            'system_health' => [
                'avg_latency_ms'       => $avgLatencyMs,
                'success_rate_percent' => $successRatePercent,
            ],
        ], 200);
    }

    /**
     * Super Admin melihat daftar seluruh user.
     *
     * GET /api/admin/users
     */
    public function indexUsers(Request $request)
    {
        $users = User::all();
        
        return response()->json([
            'message' => 'Users retrieved successfully',
            'users'   => $users,
        ], 200);
    }

    /**
     * Super Admin mengupdate data owner.
     *
     * PUT /api/admin/users/{id}
     */
    public function updateOwner(Request $request, $id)
    {
        $owner = User::where('id', $id)->where('role', User::ROLE_OWNER)->first();

        if (!$owner) {
            return response()->json([
                'message' => 'Owner not found',
            ], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $owner->id,
            'password' => 'sometimes|string|min:6',
        ]);

        $owner->update($validated);

        return response()->json([
            'message' => 'Owner updated successfully',
            'owner'   => $owner,
        ], 200);
    }

    /**
     * Super Admin menghapus data owner.
     *
     * DELETE /api/admin/users/{id}
     */
    public function deleteOwner(Request $request, $id)
    {
        $owner = User::where('id', $id)->where('role', User::ROLE_OWNER)->first();

        if (!$owner) {
            return response()->json([
                'message' => 'Owner not found',
            ], 404);
        }

        $owner->delete();

        return response()->json([
            'message' => 'Owner deleted successfully',
        ], 200);
    }
}
