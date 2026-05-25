<?php

use App\Models\User;
use App\Models\ApiRequestLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest request is logged with null user_id and sensitive data filtered', function () {
    // Send public login request (fails authentication but still logs the request)
    $response = $this->postJson('/api/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'secret123',
    ]);

    $response->assertStatus(401);

    // Verify it is logged in DB
    $this->assertDatabaseHas('api_request_logs', [
        'user_id' => null,
        'method' => 'POST',
        'status_code' => 401,
    ]);

    // Check payload is scrubbed
    $log = ApiRequestLog::latest('id')->first();
    expect($log->payload)->toBeArray();
    expect($log->payload['email'])->toBe('nonexistent@example.com');
    expect($log->payload['password'])->toBe('[FILTERED]');
});

test('authenticated request logs user_id', function () {
    $user = User::factory()->create(['role' => 'owner']);
    
    $response = $this->actingAs($user)
        ->getJson('/api/profile');

    $response->assertStatus(200);

    $this->assertDatabaseHas('api_request_logs', [
        'user_id' => $user->id,
        'method' => 'GET',
        'status_code' => 200,
    ]);
});

test('super admin can retrieve api request logs', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    
    // Seed some logs
    ApiRequestLog::create([
        'user_id' => null,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/test-endpoint',
        'payload' => null,
        'status_code' => 200,
        'duration_ms' => 45,
    ]);

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/api-logs');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'data' => [
                'current_page',
                'data' => [
                    '*' => [
                        'id',
                        'user_id',
                        'ip_address',
                        'method',
                        'url',
                        'payload',
                        'status_code',
                        'duration_ms',
                        'created_at',
                    ]
                ]
            ]
        ]);
});

test('non-super-admin cannot retrieve api request logs', function () {
    $owner = User::factory()->create(['role' => 'owner']);
    $staff = User::factory()->create(['role' => 'staff']);

    // Owner blocked
    $response = $this->actingAs($owner)
        ->getJson('/api/admin/api-logs');
    $response->assertStatus(403);

    // Staff blocked
    $response = $this->actingAs($staff)
        ->getJson('/api/admin/api-logs');
    $response->assertStatus(403);
});

test('logs listing can be filtered by method, status_code, and search', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $user = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);

    // Log 1: GET 200 by John Doe
    ApiRequestLog::create([
        'user_id' => $user->id,
        'ip_address' => '192.168.1.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/owner/bahan-baku',
        'payload' => null,
        'status_code' => 200,
        'duration_ms' => 15,
    ]);

    // Log 2: POST 422 by guest
    ApiRequestLog::create([
        'user_id' => null,
        'ip_address' => '127.0.0.1',
        'method' => 'POST',
        'url' => 'http://localhost/api/owner/produk',
        'payload' => ['nama' => ''],
        'status_code' => 422,
        'duration_ms' => 30,
    ]);

    // Filter by Method
    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/api-logs?method=POST');
    $response->assertStatus(200);
    expect($response->json('data.data'))->toHaveCount(1);
    expect($response->json('data.data.0.method'))->toBe('POST');

    // Filter by Status Code
    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/api-logs?status_code=200');
    $response->assertStatus(200);
    expect($response->json('data.data'))->toHaveCount(1);
    expect($response->json('data.data.0.status_code'))->toBe(200);

    // Filter by Search (User Name)
    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/api-logs?search=John');
    $response->assertStatus(200);
    expect($response->json('data.data'))->toHaveCount(1);
    expect($response->json('data.data.0.user.name'))->toBe('John Doe');

    // Filter by Search (IP)
    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/api-logs?search=192.168.1.1');
    $response->assertStatus(200);
    expect($response->json('data.data'))->toHaveCount(1);
});
