<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riwayat_keterlambatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->foreignId('pesanan_id')->constrained('pesanans')->onDelete('cascade');
            $table->date('tenggat_waktu');
            $table->timestamp('diselesaikan_pada');
            $table->integer('selisih_hari');
            $table->text('alasan_opsional')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_keterlambatans');
    }
};
