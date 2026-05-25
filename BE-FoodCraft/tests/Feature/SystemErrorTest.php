<?php

use App\Models\User;
use App\Models\SystemError;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Register temporary route to trigger a 500 exception
    Route::post('/api/test-trigger-500', function () {
        throw new \RuntimeException('Database connection lost or syntax error.');
    })->middleware('api');
});

test('unhandled 500 exception is automatically logged to system_errors table', function () {
    $user = User::factory()->create(['role' => 'owner']);

    $response = $this->actingAs($user)
        ->postJson('/api/test-trigger-500', [
            'nama' => 'Kue Putu',
            'password' => 'secret123', // should be filtered
        ]);

    $response->assertStatus(500);

    // Verify it is saved in DB
    $this->assertDatabaseHas('system_errors', [
        'user_id' => $user->id,
        'method' => 'POST',
        'exception_class' => \RuntimeException::class,
        'message' => 'Database connection lost or syntax error.',
        'resolved' => false,
    ]);

    $error = SystemError::latest('id')->first();
    expect($error->file)->toContain('SystemErrorTest.php');
    expect($error->line)->toBeGreaterThan(0);
    expect($error->trace)->toBeArray()->not->toBeEmpty();
    expect($error->payload)->toBeArray();
    expect($error->payload['nama'])->toBe('Kue Putu');
    expect($error->payload['password'])->toBe('[FILTERED]');
});

test('super admin can retrieve system errors listing', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    
    // Seed error
    SystemError::create([
        'user_id' => null,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/test',
        'exception_class' => 'ErrorException',
        'message' => 'Undefined variable $x',
        'file' => 'test.php',
        'line' => 10,
        'trace' => ['trace line 1'],
        'payload' => null,
    ]);

    $response = $this->actingAs($superAdmin)
        ->getJson('/api/admin/system-errors');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'data' => [
                'data' => [
                    '*' => [
                        'id',
                        'message',
                        'exception_class',
                        'resolved',
                    ]
                ]
            ]
        ]);
});

test('non-super-admin cannot manage system errors', function () {
    $owner = User::factory()->create(['role' => 'owner']);
    $error = SystemError::create([
        'user_id' => null,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/test',
        'exception_class' => 'ErrorException',
        'message' => 'Undefined variable $x',
        'file' => 'test.php',
        'line' => 10,
        'trace' => ['trace line 1'],
        'payload' => null,
    ]);

    // GET blocked
    $this->actingAs($owner)->getJson('/api/admin/system-errors')->assertStatus(403);
    
    // PUT blocked
    $this->actingAs($owner)->putJson("/api/admin/system-errors/{$error->id}/resolve", ['resolved' => true])->assertStatus(403);
    
    // DELETE blocked
    $this->actingAs($owner)->deleteJson("/api/admin/system-errors/{$error->id}")->assertStatus(403);
});

test('super admin can resolve and delete system errors', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $error = SystemError::create([
        'user_id' => null,
        'ip_address' => '127.0.0.1',
        'method' => 'GET',
        'url' => 'http://localhost/api/test',
        'exception_class' => 'ErrorException',
        'message' => 'Undefined variable $x',
        'file' => 'test.php',
        'line' => 10,
        'trace' => ['trace line 1'],
        'payload' => null,
        'resolved' => false,
    ]);

    // 1. Resolve error
    $response = $this->actingAs($superAdmin)
        ->putJson("/api/admin/system-errors/{$error->id}/resolve", [
            'resolved' => true,
        ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('system_errors', [
        'id' => $error->id,
        'resolved' => true,
    ]);

    // 2. Delete error
    $response = $this->actingAs($superAdmin)
        ->deleteJson("/api/admin/system-errors/{$error->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('system_errors', [
        'id' => $error->id,
    ]);
});
