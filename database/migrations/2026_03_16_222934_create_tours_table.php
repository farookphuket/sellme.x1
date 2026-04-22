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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string("image")->nullable();
            $table->string("title");
            $table->text("description");
            $table->decimal("price",10,2);
            $table->timestamps();
        });


        /*
         * pip table to link tour to create user
         */
        Schema::create('tour_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId("tour_id")->constrained()
            ->onDelete('cascade');

            $table->foreignId("user_id")->constrained()
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
        Schema::dropIfExists('tour_user');
    }
};
