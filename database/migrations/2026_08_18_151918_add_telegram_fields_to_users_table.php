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
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('telegram_id')->nullable()->unique()->after('phoneNumber');
            $table->string('telegram_username')->nullable()->after('telegram_id');
            $table->text('telegram_photo_url')->nullable()->after('telegram_username');
            $table->string('language_code', 10)->nullable()->after('telegram_photo_url');
            $table->timestamp('last_seen_at')->nullable()->after('language_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['telegram_id']);
            $table->dropColumn([
                'telegram_id',
                'telegram_username',
                'telegram_photo_url',
                'language_code',
                'last_seen_at',
            ]);
        });
    }
};
