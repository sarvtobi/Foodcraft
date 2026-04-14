<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesanans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->string('pelanggan');
            $table->date('tenggat_waktu');
            $table->enum('status', ['pending', 'diproses', 'selesai', 'dibatalkan'])->default('pending');
            $table->enum('prioritas', ['tinggi', 'sedang', 'rendah'])->default('rendah');
            $table->decimal('total_harga', 15, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('pesanan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')->constrained('pesanans')->onDelete('cascade');
            $table->foreignId('produk_id')->constrained('produks')->onDelete('cascade');
            $table->integer('kuantitas');
            $table->decimal('harga_satuan', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan_items');
        Schema::dropIfExists('pesanans');
    }
};
