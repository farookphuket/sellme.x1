<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    /*
     *
            $table->string('name');
            $table->string('last_name');
            $table->string('nick_name')->nullable();
            $table->string('email')->nullable();
            $table->string('hotel');
            $table->string('room_number');
     *
     * */
    public function definition(): array
    {
        return [
            //
            // สร้าง User ใหม่พร้อมกับ Customer หรือสุ่มจาก User ที่มีอยู่
            'user_id' => \App\Models\User::factory(),
            'name' => fake()->firstName(), // สุ่มชื่อจริง
            'last_name' => fake()->lastName(), // สุ่มนามสกุล
            'nick_name' => fake()->optional(0.7)->firstName(), // สุ่มชื่อเล่น (มีโอกาส 70% ที่จะมีข้อมูล)
            'email' => fake()->unique()->safeEmail(),
            'hotel' => fake()->randomElement([
                'Laguna Beach Resort',
                'Phuket Marriott Resort',
                'The Ritz-Carlton',
                'Amanpuri',
                'Trisara Phuket',
                'Hilton Arcadia',
                'The Shore at Katathani',
                'Patong Merlin Hotel',
                'InterContinental Phuket',
                'The Ritz-Carlton', 'Hilton Phuket', 'Marriott Resort',  'Banyan Tree'
            ]), // สุ่มชื่อโรงแรมในไทย
            'room_number' => fake()->bothify('###?') // สุ่มเลขห้อง เช่น 102A, 505B, 301
        ];
    }
}
