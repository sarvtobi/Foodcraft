<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ApiRequestLog;

class ApiRequestLogMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/admin/api-logs*')) {
            return $next($request);
        }

        $startTime = microtime(true);

        $response = $next($request);

        $durationMs = (int) round((microtime(true) - $startTime) * 1000);

        try {
            $this->logRequest($request, $response, $durationMs);
        } catch (\Throwable $e) {
            // Prevent log writing errors from crashing the main request flow
            logger()->error('Failed to log API Request: ' . $e->getMessage(), [
                'exception' => $e
            ]);
        }

        return $response;
    }

    /**
     * Log the request data to the database.
     */
    protected function logRequest(Request $request, Response $response, int $durationMs): void
    {
        $payload = $this->sanitizePayload($request->all());

        ApiRequestLog::create([
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip() ?? 'unknown',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'payload' => empty($payload) ? null : $payload,
            'status_code' => $response->getStatusCode(),
            'duration_ms' => $durationMs,
        ]);
    }

    /**
     * Sanitize sensitive inputs from request payload.
     */
    protected function sanitizePayload(array $payload): array
    {
        $sensitiveKeys = [
            'password',
            'password_confirmation',
            'token',
            'new_password',
            'current_password',
            'credit_card',
            'access_token',
        ];

        return $this->maskSensitiveData($payload, $sensitiveKeys);
    }

    /**
     * Recursive function to mask sensitive keys in nested arrays.
     */
    protected function maskSensitiveData(array $data, array $sensitiveKeys): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->maskSensitiveData($value, $sensitiveKeys);
            } elseif (in_array(strtolower($key), $sensitiveKeys, true)) {
                $data[$key] = '[FILTERED]';
            } elseif ($value instanceof \Illuminate\Http\UploadedFile) {
                $data[$key] = '[FILE: ' . $value->getClientOriginalName() . ' (' . round($value->getSize() / 1024, 2) . ' KB)]';
            }
        }

        return $data;
    }
}
