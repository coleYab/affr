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
        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('cycle')->default(1);
            $table->unsignedInteger('days_remaining')->default(14);
            $table->date('draw_date');
            $table->string('prize_name')->default('iPhone 17 Pro');
            $table->string('prize_value')->default('1,199 USD');
            $table->string('prize_image')->nullable();
            $table->json('prize_images')->nullable();
            $table->string('live_stream_url')->nullable();
            $table->boolean('is_live')->default(false);
            $table->boolean('registration_enabled')->default(true);
            $table->boolean('ticket_selection_enabled')->default(true);
            $table->boolean('winner_announcement_mode')->default(false);
            $table->string('next_draw_date_en')->nullable();
            $table->string('next_draw_date_am')->nullable();
            $table->unsignedBigInteger('pot_value')->nullable();
            $table->unsignedInteger('total_members')->nullable();
            $table->unsignedInteger('iphones_delivered')->nullable();
            $table->unsignedInteger('trust_score')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};
