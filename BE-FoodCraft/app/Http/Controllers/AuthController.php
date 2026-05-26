<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register a new owner.
     *
     * POST /api/register
     * Hanya untuk owner UMKM. Staff didaftarkan oleh owner.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $validated['password'],
            'role'     => User::ROLE_OWNER,
        ]);

        activity('auth')
            ->performedOn($user)
            ->causedBy($user)
            ->withProperties(['ip' => $request->ip()])
            ->event('registered')
            ->log("Owner baru {$user->name} telah mendaftar");

        return response()->json([
            'message' => 'Owner registered successfully',
            'user'    => $user,
        ], 201);
    }

    /**
     * Login user and generate Sanctum token.
     *
     * POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login credentials',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        activity('auth')
            ->performedOn($user)
            ->causedBy($user)
            ->withProperties(['ip' => $request->ip(), 'user_agent' => $request->userAgent()])
            ->event('login')
            ->log("{$user->name} ({$user->role}) berhasil login");

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
        ], 200);
    }

    /**
     * Logout user (revoke current token).
     *
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        activity('auth')
            ->performedOn($user)
            ->causedBy($user)
            ->withProperties(['ip' => $request->ip()])
            ->event('logout')
            ->log("{$user->name} telah logout");

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }

    /**
     * Get authenticated user profile.
     *
     * GET /api/profile
     */
    public function profile(Request $request)
    {
        return response()->json([
            'message' => 'User profile retrieved successfully',
            'user'    => $request->user(),
        ], 200);
    }

    /**
     * Update authenticated user profile.
     *
     * PUT /api/profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'avatar'   => 'sometimes|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User profile updated successfully',
            'user'    => $user,
        ], 200);
    }
}
