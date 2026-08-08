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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // User relationship
            $table->foreignId('userId')->constrained('users')->onDelete('cascade');

            // Payment details
            $table->string('userName');
            $table->string('userPhone');
            $table->decimal('amount', 10, 2);
            $table->string('receiptUrl');
            $table->integer('requestedTicket');

            // Status (PENDING, APPROVED, REJECTED)
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])->default('PENDING');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
