<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Booking::class;
    public function definition(): array
    {
// 1. สุ่มราคาต่อคน และจำนวนคน
        $pricePerPax = $this->faker->randomElement([1200, 1500, 1850, 2500, 3200]);
        $totalPax = $this->faker->numberBetween(1, 8);
        $baseTotal = $pricePerPax * $totalPax;

        // 2. คำนวณค่าธรรมเนียม (ถ้าเป็น credit) และมัดจำ
        $payMethod = $this->faker->randomElement(['cash', 'transfer', 'credit_card']);

        $fee = ($payMethod === 'credit_card') ? ($baseTotal * 0.04) : 0;
        $totalPrice = $baseTotal + $fee;

        // สุ่มว่ามีการจ่ายมัดจำไหม (30% ของรายการทั้งหมดจะมีมัดจำ)
        $hasDeposit = $this->faker->boolean(30);
        $payDeposit = $hasDeposit ? $this->faker->randomElement([500, 1000, 2000]) : 0;

        // ยอดที่เหลือต้องจ่ายหน้างาน
        $mustPayOnDeparture = $totalPrice - $payDeposit;

        return [
// เชื่อมโยง ID อัตโนมัติ (จะสร้างใหม่หรือสุ่มที่มีอยู่แล้วก็ได้)
            'tour_id' => Tour::inRandomOrder()->first()?->id ?? Tour::factory(),
            'customer_id' => Customer::inRandomOrder()->first()?->id ?? Customer::factory(),
'user_id' => function (array $attributes) {
            return \App\Models\Customer::find($attributes['customer_id'])->user_id;
        },
            // ข้อมูลการชำระเงิน
            'pay_method' => $payMethod,
            'paid_status' => $this->faker->randomElement(['pending', 'confirmed', 'completed']),
            'pay_on_arrival' => $mustPayOnDeparture > 0 ? 'Yes' : 'None',
            'must_pay_on_departure' => $mustPayOnDeparture,
            'total_price' => $totalPrice,
            'pay_deposit' => $payDeposit,
            'price_per_pax' => $pricePerPax,
            'total_pax' => $totalPax,

            // ข้อมูลการเดินทาง
            'pickup_at' => $this->faker->company() . " Lobby (Room " . $this->faker->numberBetween(100, 999) . ")",
            'special_request' => $this->faker->randomElement([
                'No spicy food',
                'Vegetarian meals',
                'Need 2 life jackets for children',
                'None',
                'Allergic to seafood'
            ]),
            'date_departure' => Carbon::now()->addDays($this->faker->numberBetween(1, 30))->format('Y-m-d'),
            'date_confirmed' => Carbon::now()->subHours($this->faker->numberBetween(1, 72)),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
