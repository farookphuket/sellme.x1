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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            // ความสัมพันธ์ (Foreign Keys)
            $table->foreignId('tour_id')->constrained('tours')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // ข้อมูลการชำระเงิน
            $table->string('pay_method')->comment('เช่น cash, transfer, credit_card');
            $table->string('paid_status')->default('pending');
            $table->string('pay_on_arrival')->default('None');
            $table->decimal('must_pay_on_departure', 10, 2)->default(0.00);
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->decimal('pay_deposit', 10, 2)->default(0.00);

            $table->decimal('price_per_pax', 10, 2)->default(0.00);
            $table->integer('total_pax')->default(1);



            // ข้อมูลวันเวลาและการเดินทาง
            $table->string('pickup_at')->nullable()->comment('สถานที่รับลูกค้า');
            $table->string('special_request')->comment('เช่น cash, transfer, credit_card');
            $table->date('date_departure')->comment('วันที่ออกเดินทาง');
            $table->dateTime('date_confirmed')->nullable()->comment('วันที่ยืนยันการจอง');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
