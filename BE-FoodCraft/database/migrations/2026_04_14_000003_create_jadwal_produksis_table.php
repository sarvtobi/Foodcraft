<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_produksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->foreignId('pesanan_id')->constrained('pesanans')->onDelete('cascade');
            $table->date('tanggal_produksi');
            $table->integer('total_waktu_menit');
            $table->enum('status', ['menunggu', 'selesai'])->default('menunggu');
            $table->boolean('terlambat')->default(false); // Flag terlambat dari tenggat_waktu pesanan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_produksis');
    }
};
