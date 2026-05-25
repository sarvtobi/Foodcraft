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
        Schema::create('system_errors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->onDelete('set null');
            $table->string('ip_address');
            $table->string('method');
            $table->text('url');
            $table->string('exception_class');
            $table->text('message');
            $table->string('file');
            $table->integer('line');
            $table->json('trace');
            $table->json('payload')->nullable();
            $table->boolean('resolved')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_errors');
    }
};
