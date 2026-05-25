<?php

namespace App\Http\Controllers;

use App\Models\SystemError;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemErrorController extends Controller
{
    /**
     * Display a listing of system errors for Super Admin.
     * GET /api/admin/system-errors
     */
    public function index(Request $request): JsonResponse
    {
        $query = SystemError::with(['user:id,name,email,role'])
            ->latest('id');

        // Filter by resolved status
        if ($request->has('resolved') && $request->query('resolved') !== '') {
            $query->where('resolved', filter_var($request->query('resolved'), FILTER_VALIDATE_BOOLEAN));
        }

        // Filter by search query (message, file, url, ip, user name, user email)
        if ($request->has('search') && !empty($request->query('search'))) {
            $searchTerm = $request->query('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('message', 'like', "%{$searchTerm}%")
                  ->orWhere('file', 'like', "%{$searchTerm}%")
                  ->orWhere('url', 'like', "%{$searchTerm}%")
                  ->orWhere('ip_address', 'like', "%{$searchTerm}%")
                  ->orWhereHas('user', function ($uq) use ($searchTerm) {
                      $uq->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('email', 'like', "%{$searchTerm}%");
                  });
            });
        }

        $errors = $query->paginate(15);

        return response()->json([
            'status' => 'success',
            'data'   => $errors,
        ]);
    }

    /**
     * Mark a system error as resolved.
     * PUT /api/admin/system-errors/{id}/resolve
     */
    public function resolve(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'resolved' => 'required|boolean',
        ]);

        $errorLog = SystemError::findOrFail($id);
        $errorLog->update([
            'resolved' => $request->input('resolved'),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Error marked as resolved successfully.',
        ]);
    }

    /**
     * Delete a system error log entry.
     * DELETE /api/admin/system-errors/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $errorLog = SystemError::findOrFail($id);
        $errorLog->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Error log deleted successfully.',
        ]);
    }
}
