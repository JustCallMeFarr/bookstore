<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type', 10)->default('delivery');          // delivery | read
            $table->unsignedBigInteger('total')->default(0);
            $table->string('status', 20)->default('pending');          // pending | processed | shipped | done | cancelled
            $table->text('address')->nullable();                       // hanya untuk type=delivery
            $table->string('payment_status', 20)->default('unpaid');   // unpaid | paid | failed
            $table->string('midtrans_order_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
