<?php

use App\Models\User;
use App\Models\Umkm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('user can upload avatar successfully', function () {
    Storage::fake('public');

    $user = User::factory()->create(['role' => 'owner']);
    $token = $user->createToken('test_token')->plainTextToken;

    $file = UploadedFile::fake()->image('avatar.png');

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/profile', [
            '_method' => 'PUT',
            'avatar' => $file,
        ]);

    $response->assertStatus(200);
    $user->refresh();

    expect($user->avatar)->not->toBeNull();
    Storage::disk('public')->assertExists($user->avatar);
});

test('user avatar upload fails with invalid file type', function () {
    Storage::fake('public');

    $user = User::factory()->create(['role' => 'owner']);
    $token = $user->createToken('test_token')->plainTextToken;

    $file = UploadedFile::fake()->create('document.pdf', 100);

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/profile', [
            '_method' => 'PUT',
            'avatar' => $file,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['avatar']);
});

test('user avatar upload fails with file size exceeding 2MB', function () {
    Storage::fake('public');

    $user = User::factory()->create(['role' => 'owner']);
    $token = $user->createToken('test_token')->plainTextToken;

    // 2049 KB is more than 2MB (2048 KB)
    $file = UploadedFile::fake()->image('avatar.png')->size(2049);

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/profile', [
            '_method' => 'PUT',
            'avatar' => $file,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['avatar']);
});

test('owner can upload UMKM profile successfully', function () {
    Storage::fake('public');

    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create([
        'name' => 'UMKM Test',
        'description' => 'Test Desc',
        'address' => 'Test Address',
        'phone' => '08123456789',
        'owner_id' => $owner->id,
    ]);
    $token = $owner->createToken('test_token')->plainTextToken;

    $file = UploadedFile::fake()->image('profile.jpg');

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/owner/umkm', [
            '_method' => 'PUT',
            'profile' => $file,
        ]);

    $response->assertStatus(200);
    $umkm->refresh();

    expect($umkm->profile)->not->toBeNull();
    Storage::disk('public')->assertExists($umkm->profile);
});

test('UMKM profile upload fails with invalid file type', function () {
    Storage::fake('public');

    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create([
        'name' => 'UMKM Test',
        'description' => 'Test Desc',
        'address' => 'Test Address',
        'phone' => '08123456789',
        'owner_id' => $owner->id,
    ]);
    $token = $owner->createToken('test_token')->plainTextToken;

    $file = UploadedFile::fake()->create('text.txt', 50);

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/owner/umkm', [
            '_method' => 'PUT',
            'profile' => $file,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['profile']);
});

test('UMKM profile upload fails with file size exceeding 2MB', function () {
    Storage::fake('public');

    $owner = User::factory()->create(['role' => 'owner']);
    $umkm = Umkm::create([
        'name' => 'UMKM Test',
        'description' => 'Test Desc',
        'address' => 'Test Address',
        'phone' => '08123456789',
        'owner_id' => $owner->id,
    ]);
    $token = $owner->createToken('test_token')->plainTextToken;

    $file = UploadedFile::fake()->image('profile.jpg')->size(2049);

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/owner/umkm', [
            '_method' => 'PUT',
            'profile' => $file,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['profile']);
});
