<?php

use App\Models\User;
use App\Models\Umkm;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/*
|--------------------------------------------------------------------------
| Helper: create owner with UMKM and token
|--------------------------------------------------------------------------
*/

function createOwnerWithUmkm(): array
{
    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create([
        'name'        => 'UMKM Test',
        'description' => 'Test Description',
        'address'     => 'Jl. Test No. 1',
        'phone'       => '08123456789',
        'owner_id'    => $owner->id,
    ]);
    $token = $owner->createToken('test_token')->plainTextToken;

    return [$owner, $umkm, $token];
}

/*
|--------------------------------------------------------------------------
| Register Tests (owner only)
|--------------------------------------------------------------------------
*/

test('owner can register successfully', function () {
    $response = $this->postJson('/api/register', [
        'name'     => 'Owner User',
        'email'    => 'owner@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email', 'role'],
        ])
        ->assertJson([
            'message' => 'Owner registered successfully',
            'user'    => ['role' => 'owner'],
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'owner@example.com',
        'role'  => 'owner',
    ]);
});

test('register fails with duplicate email', function () {
    User::factory()->create(['email' => 'duplicate@example.com']);

    $response = $this->postJson('/api/register', [
        'name'     => 'Test User',
        'email'    => 'duplicate@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('register fails with password too short', function () {
    $response = $this->postJson('/api/register', [
        'name'     => 'Test User',
        'email'    => 'test@example.com',
        'password' => '123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

/*
|--------------------------------------------------------------------------
| Login Tests
|--------------------------------------------------------------------------
*/

test('user can login with valid credentials', function () {
    User::factory()->create([
        'email'    => 'login@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email'    => 'login@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['message', 'token', 'user'])
        ->assertJson(['message' => 'Login successful']);
});

test('login fails with wrong credentials', function () {
    User::factory()->create([
        'email'    => 'wrong@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email'    => 'wrong@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
        ->assertJson(['message' => 'Invalid login credentials']);
});

/*
|--------------------------------------------------------------------------
| Logout & Profile Tests
|--------------------------------------------------------------------------
*/

test('authenticated user can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson(['message' => 'Logged out successfully']);
});

test('authenticated user can get profile', function () {
    $user = User::factory()->create(['role' => 'owner']);
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/profile');

    $response->assertStatus(200)
        ->assertJsonStructure(['message', 'user' => ['id', 'name', 'email', 'role']]);
});

test('authenticated user can update profile', function () {
    $user = User::factory()->create(['role' => 'staff', 'name' => 'Old Name']);
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->putJson('/api/profile', [
        'name' => 'New Name',
        'password' => 'newpassword123',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'User profile updated successfully',
            'user'    => ['name' => 'New Name'],
        ]);

    $this->assertDatabaseHas('users', [
        'id'   => $user->id,
        'name' => 'New Name',
    ]);
});

test('unauthenticated user cannot get profile', function () {
    $this->getJson('/api/profile')->assertStatus(401);
});

/*
|--------------------------------------------------------------------------
| UMKM Management Tests
|--------------------------------------------------------------------------
*/

test('owner can create a UMKM', function () {
    $owner = User::factory()->create(['role' => 'owner']);
    $token = $owner->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/owner/umkm', [
        'name'        => 'Bakso Pak Joko',
        'description' => 'Warung bakso terbaik',
        'address'     => 'Jl. Merdeka No. 10',
        'phone'       => '081234567890',
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'message' => 'UMKM created successfully',
            'umkm'    => [
                'name'        => 'Bakso Pak Joko',
                'description' => 'Warung bakso terbaik',
            ],
        ]);

    $this->assertDatabaseHas('umkms', [
        'name'        => 'Bakso Pak Joko',
        'description' => 'Warung bakso terbaik',
        'owner_id'    => $owner->id,
    ]);
});

test('owner cannot create second UMKM', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/owner/umkm', [
        'name' => 'Second UMKM',
    ]);

    $response->assertStatus(409)
        ->assertJson(['message' => 'You already have a UMKM registered']);
});

test('owner can view their UMKM', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/owner/umkm');

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'UMKM retrieved successfully',
            'umkm'    => ['name' => 'UMKM Test', 'description' => 'Test Description'],
        ]);
});

test('owner can update their UMKM', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->putJson('/api/owner/umkm', [
        'name'        => 'UMKM Updated',
        'description' => 'New Description',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'UMKM updated successfully',
            'umkm'    => ['name' => 'UMKM Updated', 'description' => 'New Description'],
        ]);

    $this->assertDatabaseHas('umkms', [
        'id'          => $umkm->id,
        'name'        => 'UMKM Updated',
        'description' => 'New Description',
    ]);
});

/*
|--------------------------------------------------------------------------
| Staff Management by Owner Tests
|--------------------------------------------------------------------------
*/

test('owner can create staff for their UMKM', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/owner/staff', [
        'name'     => 'Staff Satu',
        'email'    => 'staff1@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'message' => 'Staff created successfully',
            'staff'   => [
                'role'    => 'staff',
                'umkm_id' => $umkm->id,
            ],
        ]);
});

test('owner cannot create staff without UMKM', function () {
    $owner = User::factory()->create(['role' => 'owner']);
    $token = $owner->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/owner/staff', [
        'name'     => 'Staff',
        'email'    => 'staff@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(403)
        ->assertJson(['message' => 'You must create a UMKM first before adding staff']);
});

test('owner can list all staff', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    User::factory()->create(['role' => 'staff', 'umkm_id' => $umkm->id, 'name' => 'Staff A']);
    User::factory()->create(['role' => 'staff', 'umkm_id' => $umkm->id, 'name' => 'Staff B']);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/owner/staff');

    $response->assertStatus(200)
        ->assertJsonCount(2, 'staffs');
});

test('owner can update staff', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    $staff = User::factory()->create([
        'role'    => 'staff',
        'umkm_id' => $umkm->id,
        'name'   => 'Old Name',
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->putJson("/api/owner/staff/{$staff->id}", [
        'name' => 'New Name',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Staff updated successfully',
            'staff'   => ['name' => 'New Name'],
        ]);
});

test('owner can delete staff', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    $staff = User::factory()->create([
        'role'    => 'staff',
        'umkm_id' => $umkm->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->deleteJson("/api/owner/staff/{$staff->id}");

    $response->assertStatus(200)
        ->assertJson(['message' => 'Staff deleted successfully']);

    $this->assertDatabaseMissing('users', ['id' => $staff->id]);
});

test('owner cannot delete staff from other UMKM', function () {
    [$owner, $umkm, $token] = createOwnerWithUmkm();

    // Create another owner + UMKM + staff
    $otherOwner = User::factory()->create(['role' => 'owner']);
    $otherUmkm = Umkm::create([
        'name'     => 'Other UMKM',
        'owner_id' => $otherOwner->id,
    ]);
    $otherStaff = User::factory()->create([
        'role'    => 'staff',
        'umkm_id' => $otherUmkm->id,
    ]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->deleteJson("/api/owner/staff/{$otherStaff->id}");

    $response->assertStatus(404)
        ->assertJson(['message' => 'Staff not found in your UMKM']);
});

/*
|--------------------------------------------------------------------------
| Admin User Management Tests
|--------------------------------------------------------------------------
*/

test('super_admin can view all users', function () {
    $admin = User::factory()->create(['role' => 'super_admin']);
    $token = $admin->createToken('test_token')->plainTextToken;

    User::factory()->count(3)->create();

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/admin/users');

    $response->assertStatus(200)
        ->assertJsonStructure(['message', 'users']);
        
    expect(count($response->json('users')))->toBeGreaterThanOrEqual(4); // 1 admin + 3 users
});

test('super_admin can update owner', function () {
    $admin = User::factory()->create(['role' => 'super_admin']);
    $owner = User::factory()->create(['role' => 'owner', 'name' => 'Old Owner']);
    $token = $admin->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->putJson("/api/admin/users/{$owner->id}", [
        'name' => 'New Owner Name',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Owner updated successfully',
            'owner'   => ['name' => 'New Owner Name'],
        ]);
        
    $this->assertDatabaseHas('users', [
        'id'   => $owner->id,
        'name' => 'New Owner Name',
    ]);
});

test('super_admin cannot update non-owner user via updateOwner', function () {
    $admin = User::factory()->create(['role' => 'super_admin']);
    $staff = User::factory()->create(['role' => 'staff']);
    $token = $admin->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->putJson("/api/admin/users/{$staff->id}", [
        'name' => 'Hacked Staff',
    ]);

    $response->assertStatus(404)
        ->assertJson(['message' => 'Owner not found']);
});

test('super_admin can delete owner', function () {
    $admin = User::factory()->create(['role' => 'super_admin']);
    $owner = User::factory()->create(['role' => 'owner']);
    $token = $admin->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->deleteJson("/api/admin/users/{$owner->id}");

    $response->assertStatus(200)
        ->assertJson(['message' => 'Owner deleted successfully']);
        
    $this->assertDatabaseMissing('users', ['id' => $owner->id]);
});

/*
|--------------------------------------------------------------------------
| RBAC Tests
|--------------------------------------------------------------------------
*/

test('super_admin can access admin dashboard', function () {
    $user = User::factory()->create(['role' => 'super_admin']);
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/admin/dashboard');

    $response->assertStatus(200)
        ->assertJson(['message' => 'Welcome Super Admin Dashboard']);
});

test('owner cannot access admin dashboard', function () {
    $user = User::factory()->create(['role' => 'owner']);
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/admin/dashboard');

    $response->assertStatus(403);
});

test('staff can access staff dashboard', function () {
    $user = User::factory()->create(['role' => 'staff']);
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/staff/dashboard');

    $response->assertStatus(200)
        ->assertJson(['message' => 'Welcome Staff Dashboard']);
});

test('staff cannot access owner dashboard', function () {
    $user = User::factory()->create(['role' => 'staff']);
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/owner/dashboard');

    $response->assertStatus(403);
});
