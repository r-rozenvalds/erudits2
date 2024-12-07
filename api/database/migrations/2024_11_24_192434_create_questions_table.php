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
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string("title")->index();
            $table->boolean("is_text_answer")->default(false);
            $table->integer("points")->default(0);
            $table->foreignUuid("round_id")->constrained('rounds')->onDelete('cascade');
            $table->string("guidelines")->nullable();
            $table->string("image_url")->nullabe();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
