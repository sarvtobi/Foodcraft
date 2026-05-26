<?php

use App\Models\User;
use App\Models\Umkm;
use App\Models\ApiRequestLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

uses(RefreshDatabase::class);

test('super admin can retrieve dashboard metrics with correct JSON structure', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/dashboard');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'message',
            'user',
            'metrics' => [
                'total_users',
                'total_users_growth',
                'total_umkms',
                'total_umkm_trend',
                'active_users_24h',
            ],
            'system_health' => [
                'avg_latency_ms',
                'success_rate_percent',
            ],
        ]);
});

test('non-super-admin is unauthorized to access dashboard metrics', function () {
    $owner = User::factory()->create(['role' => 'owner']);
    $staff = User::factory()->create(['role' => 'staff']);

    // Owner blocked
    $this->actingAs($owner)
        ->getJson('/api/admin/dashboard')
        ->assertStatus(403);

    // Staff blocked
    $this->actingAs($staff)
        ->getJson('/api/admin/dashboard')
        ->assertStatus(403);

    // Guest blocked (RoleMiddleware returns 403 Forbidden for null user role)
    $this->getJson('/api/admin/dashboard')
        ->assertStatus(403);
});

test('growth metrics are calculated correctly', function () {
    Carbon::setTestNow('2026-05-15 12:00:00');

    // Super admin created before this month
    $superAdmin = User::factory()->create([
        'role' => 'super_admin',
        'created_at' => '2026-04-15 00:00:00',
    ]);

    // 10 users registered before this month
    User::factory()->count(10)->create([
        'created_at' => '2026-04-15 00:00:00',
    ]);

    // 5 new users registered this month
    User::factory()->count(5)->create([
        'created_at' => '2026-05-10 00:00:00',
    ]);

    // UMKM created last month: 3
    for ($i = 0; $i < 3; $i++) {
        $owner = User::factory()->create(['role' => 'owner', 'created_at' => '2026-04-10 00:00:00']);
        Umkm::forceCreate([
            'name' => "UMKM Last Month $i",
            'owner_id' => $owner->id,
            'created_at' => '2026-04-10 00:00:00',
        ]);
    }

    // UMKM created this month: 4
    for ($i = 0; $i < 4; $i++) {
        $owner = User::factory()->create(['role' => 'owner', 'created_at' => '2026-05-05 00:00:00']);
        Umkm::forceCreate([
            'name' => "UMKM This Month $i",
            'owner_id' => $owner->id,
            'created_at' => '2026-05-05 00:00:00',
        ]);
    }

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/dashboard');

    $response->assertStatus(200);
    expect($response->json('metrics.total_users'))->toBe(23); // 1 superAdmin + 10 old users + 5 new users + 3 old owners + 4 new owners
    // total users before this month: 1 (admin) + 10 (old users) + 3 (old owners) = 14
    // total users now: 23
    // growth: ((23 - 14) / 14) * 100 = 64.29%
    expect($response->json('metrics.total_users_growth'))->toEqual(64.29);
    expect($response->json('metrics.total_umkms'))->toBe(7);
    expect($response->json('metrics.total_umkm_trend'))->toBe('up');

    // Clean up test time
    Carbon::setTestNow();
});

test('growth metrics trend down if current month registrations are fewer than previous', function () {
    Carbon::setTestNow('2026-05-15 12:00:00');

    $superAdmin = User::factory()->create([
        'role' => 'super_admin',
        'created_at' => '2026-04-15 00:00:00',
    ]);

    // UMKM created last month: 5
    for ($i = 0; $i < 5; $i++) {
        $owner = User::factory()->create(['role' => 'owner', 'created_at' => '2026-04-10 00:00:00']);
        Umkm::forceCreate([
            'name' => "UMKM Last Month $i",
            'owner_id' => $owner->id,
            'created_at' => '2026-04-10 00:00:00',
        ]);
    }

    // UMKM created this month: 2
    for ($i = 0; $i < 2; $i++) {
        $owner = User::factory()->create(['role' => 'owner', 'created_at' => '2026-05-05 00:00:00']);
        Umkm::forceCreate([
            'name' => "UMKM This Month $i",
            'owner_id' => $owner->id,
            'created_at' => '2026-05-05 00:00:00',
        ]);
    }

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/dashboard');

    $response->assertStatus(200);
    expect($response->json('metrics.total_umkm_trend'))->toBe('down');

    // Clean up test time
    Carbon::setTestNow();
});

test('system health metrics and user activity are calculated correctly from request logs', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    // Set time to now
    Carbon::setTestNow(now());

    // 1 request log 2 days ago (should be excluded from 24h metrics)
    ApiRequestLog::create([
        'user_id' => $userA->id,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/old',
        'payload' => null,
        'status_code' => 500,
        'duration_ms' => 1000,
        'created_at' => now()->subDays(2),
    ]);

    // 3 request logs in last 24 hours:
    // Log 1: userA, status 200, duration 100ms
    ApiRequestLog::create([
        'user_id' => $userA->id,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/test1',
        'payload' => null,
        'status_code' => 200,
        'duration_ms' => 100,
        'created_at' => now()->subHours(2),
    ]);

    // Log 2: userB, status 500, duration 200ms
    ApiRequestLog::create([
        'user_id' => $userB->id,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/test2',
        'payload' => null,
        'status_code' => 500,
        'duration_ms' => 200,
        'created_at' => now()->subHours(5),
    ]);

    // Log 3: userA, status 201, duration 150ms
    ApiRequestLog::create([
        'user_id' => $userA->id,
        'ip_address' => '127.0.0.1',
        'method' => 'POST',
        'url' => 'http://localhost/api/test3',
        'payload' => null,
        'status_code' => 201,
        'duration_ms' => 150,
        'created_at' => now()->subHours(10),
    ]);

    // Totals for last 24h:
    // avg duration: (100 + 200 + 150) / 3 = 150.00ms
    // success rate: 2 out of 3 (200, 201 are < 500; 500 is not) = 66.67%
    // active users: userA and userB = 2 unique users

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/dashboard');

    $response->assertStatus(200);
    expect($response->json('metrics.active_users_24h'))->toBe(2);
    expect($response->json('system_health.avg_latency_ms'))->toEqual(150);
    expect($response->json('system_health.success_rate_percent'))->toEqual(66.67);

    // Clean up test time
    Carbon::setTestNow();
});

test('system health metrics fall back correctly when there are no logs in last 24 hours', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $userA = User::factory()->create();

    // Set time to now
    Carbon::setTestNow(now());

    // 1 request log 2 days ago (none in last 24h)
    ApiRequestLog::create([
        'user_id' => $userA->id,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/old',
        'payload' => null,
        'status_code' => 200,
        'duration_ms' => 180,
        'created_at' => now()->subDays(2),
    ]);

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/dashboard');

    $response->assertStatus(200);
    expect($response->json('metrics.active_users_24h'))->toBe(0);
    // Should fall back to all-time averages
    expect($response->json('system_health.avg_latency_ms'))->toEqual(180);
    expect($response->json('system_health.success_rate_percent'))->toEqual(100);

    // Clean up test time
    Carbon::setTestNow();
});
