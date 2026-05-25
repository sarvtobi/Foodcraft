<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

        $middleware->appendToGroup('api', [
            \App\Http\Middleware\ApiRequestLogMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'status' => 'error',
                        'message' => $e->getMessage(),
                        'errors' => $e->errors(),
                    ], 422);
                }

                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Unauthenticated.',
                        'errors' => null,
                    ], 401);
                }

                if ($e instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException || 
                    $e instanceof \Illuminate\Auth\Access\AuthorizationException) {
                    return response()->json([
                        'status' => 'error',
                        'message' => $e->getMessage() ?: 'This action is unauthorized.',
                        'errors' => null,
                    ], 403);
                }

                if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException || 
                    $e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Resource not found.',
                        'errors' => null,
                    ], 404);
                }

                $statusCode = 500;
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                    $statusCode = $e->getStatusCode();
                }

                $message = $e->getMessage() ?: 'Server Error.';
                if ($statusCode === 500 && !config('app.debug')) {
                    $message = 'Server Error.';
                }

                if ($statusCode === 500) {
                    try {
                        $trace = collect($e->getTrace())->take(15)->map(function ($trace) {
                            return ($trace['file'] ?? 'unknown') . ':' . ($trace['line'] ?? 'unknown') . ' (' . ($trace['function'] ?? 'unknown') . ')';
                        })->toArray();

                        $sensitiveKeys = ['password', 'password_confirmation', 'token', 'access_token', 'new_password', 'current_password'];
                        $payload = request()->all();
                        
                        $maskData = function ($data) use (&$maskData, $sensitiveKeys) {
                            if (!is_array($data)) return $data;
                            foreach ($data as $k => $v) {
                                if (is_array($v)) {
                                    $data[$k] = $maskData($v);
                                } elseif (in_array(strtolower($k), $sensitiveKeys, true)) {
                                    $data[$k] = '[FILTERED]';
                                } elseif ($v instanceof \Illuminate\Http\UploadedFile) {
                                    $data[$k] = '[FILE: ' . $v->getClientOriginalName() . ']';
                                }
                            }
                            return $data;
                        };
                        $payload = $maskData($payload);

                        \App\Models\SystemError::create([
                            'user_id' => request()->user()?->id,
                            'ip_address' => request()->ip() ?? 'unknown',
                            'method' => request()->method(),
                            'url' => request()->fullUrl(),
                            'exception_class' => get_class($e),
                            'message' => $e->getMessage() ?: 'No message available',
                            'file' => $e->getFile(),
                            'line' => $e->getLine(),
                            'trace' => $trace,
                            'payload' => empty($payload) ? null : $payload,
                            'resolved' => false,
                        ]);
                    } catch (\Throwable $logError) {
                        logger()->error('Failed to save System Error: ' . $logError->getMessage(), [
                            'original_exception' => $e,
                            'logging_exception' => $logError,
                        ]);
                    }
                }

                $errors = null;
                if (config('app.debug')) {
                    $errors = [
                        'exception' => get_class($e),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => collect($e->getTrace())->take(10)->map(function ($trace) {
                            return ($trace['file'] ?? 'unknown') . ':' . ($trace['line'] ?? 'unknown');
                        })->toArray(),
                    ];
                }

                return response()->json([
                    'status' => 'error',
                    'message' => $message,
                    'errors' => $errors,
                ], $statusCode);
            }
        });
    })->create();
