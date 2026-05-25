<?php

namespace App\Http\Controllers;

use App\Models\ApiRequestLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiRequestLogController extends Controller
{
    /**
     * Display a listing of API request logs for Super Admin.
     * GET /api/admin/api-logs
     */
    public function index(Request $request): JsonResponse
    {
        $query = ApiRequestLog::with(['user:id,name,email,role'])
            ->latest('id');

        // Filter by Method (e.g. GET, POST, PUT, DELETE)
        if ($request->has('method') && !empty($request->query('method'))) {
            $query->where('method', strtoupper($request->query('method')));
        }

        // Filter by Status Code (e.g. 200, 422, 500)
        if ($request->has('status_code') && !empty($request->query('status_code'))) {
            $query->where('status_code', intval($request->query('status_code')));
        }

        // Filter by Search (IP address, URL, User Name, or User Email)
        if ($request->has('search') && !empty($request->query('search'))) {
            $searchTerm = $request->query('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('ip_address', 'like', "%{$searchTerm}%")
                  ->orWhere('url', 'like', "%{$searchTerm}%")
                  ->orWhereHas('user', function ($uq) use ($searchTerm) {
                      $uq->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('email', 'like', "%{$searchTerm}%");
                  });
            });
        }

        $logs = $query->paginate(15);

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }
}
