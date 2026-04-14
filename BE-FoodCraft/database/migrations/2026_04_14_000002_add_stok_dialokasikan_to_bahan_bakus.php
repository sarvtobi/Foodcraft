<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bahan_bakus', function (Blueprint $table) {
            $table->decimal('stok_dialokasikan', 10, 2)->default(0)->after('stok');
        });
    }

    public function down(): void
    {
        Schema::table('bahan_bakus', function (Blueprint $table) {
            $table->dropColumn('stok_dialokasikan');
        });
    }
};
