<?php

namespace App\Http\Controllers;

use App\Models\User;
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
        return response()->json([
            'message' => 'Welcome Super Admin Dashboard',
            'user'    => $request->user(),
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
