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
        Schema::create('game_instances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->boolean("is_public")->default(true);
            $table->boolean("is_active")->default(true);
            $table->foreignUuid("game_id")->constrained('games')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_instances');
    }
};
