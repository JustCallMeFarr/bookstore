<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('title');
            $table->string('author', 150);
            $table->text('synopsis')->nullable();
            $table->string('cover')->nullable();          // URL atau path file cover
            $table->unsignedInteger('price')->default(0); // Rupiah
            $table->unsignedInteger('stock')->default(0);
            $table->string('ebook_file')->nullable();     // link/URL untuk mode "baca online"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
