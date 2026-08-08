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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            // Ticket number (1 - 5000)
            $table->integer('ticketNumber')->unique();

            // Owner (nullable until sold)
            $table->foreignId('userId')->nullable()->constrained('users')->onDelete('set null');

            // Related payment (nullable)
            $table->foreignId('paymentId')->nullable();

            // Ticket status
            $table->enum('status', ['AVAILABLE', 'RESERVED', 'SOLD'])->default('AVAILABLE');

            $table->timestamp('reservedAt')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
