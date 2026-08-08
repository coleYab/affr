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
        Schema::create('recent_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            $table->string('type');
            $table->string('status')->nullable();
            $table->string('title_en');
            $table->string('title_am')->nullable();
            $table->text('description_en');
            $table->text('description_am')->nullable();
            $table->string('link')->nullable();
            $table->unsignedInteger('cycle')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('occurred_at')->useCurrent();
            $table->timestamps();

            $table->index(['userId', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recent_activities');
    }
};
