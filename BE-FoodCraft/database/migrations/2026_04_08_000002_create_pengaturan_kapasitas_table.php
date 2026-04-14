<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengaturan_kapasitas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->unique()->constrained('umkms')->onDelete('cascade');
            $table->integer('kapasitas_harian_menit')->default(480)->comment('Total kapasitas mesin/pegawai dalam menit per hari');
            $table->json('hari_operasi')->nullable()->comment('Contoh: ["Senin", "Selasa"]');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaturan_kapasitas');
    }
};
