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
        Schema::create('histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid("player_id")->constrained('players')->onDelete('cascade')->nullable();
            $table->foreignUuid("instance_id")->constrained('game_instances')->onDelete('cascade')->nullable();
            $table->foreignUuid("question_id")->constrained('questions')->onDelete('cascade')->nullable();
            $table->foreignUuid("answer_id")->constrained('answers')->onDelete('cascade')->nullable();
            $table->foreignUuid("round_id")->constrained('rounds')->onDelete('cascade')->nullable();
            $table->string('action')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histories');
    }
};
