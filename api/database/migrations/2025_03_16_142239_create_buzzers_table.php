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
        Schema::create('buzzers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid("player_id")->constrained('players')->onDelete('cascade');
            $table->foreignUuid("instance_id")->constrained('game_instances')->onDelete('cascade');
            $table->dateTime("buzzed_at");
            $table->boolean("active")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buzzers');
    }
};
