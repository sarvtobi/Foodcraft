<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StaffController extends Controller
{
    /**
     * Staff Dashboard.
     *
     * GET /api/staff/dashboard
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $umkm = $user->umkm;

        return response()->json([
            'message'      => 'Welcome Staff Dashboard',
            'user'         => $user,
            'umkm_name'    => $umkm ? $umkm->name : null,
            'umkm_avatar'  => $umkm ? $umkm->profile : null,
            'umkm_profile' => $umkm ? $umkm->profile : null,
        ], 200);
    }
}
