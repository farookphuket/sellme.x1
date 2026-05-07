<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

use App\Models\Tour;
use Carbon\Carbon;

class TourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


$tours = [];
        $now = Carbon::now();

        for ($i = 1; $i <= 200; $i++) {
            $randomDays = rand(1, 5);
            $price = rand(1500, 15000) + 0.75;

            // สุ่มรูปภาพ
            $images = [
                'https://www.phiphi-tour.com/img-tour/tour-phiphi-beyond-cruise/tour-phiphi-beyond-cruise01.jpg',
                'https://www.phiphi-tour.com/img-tour/tour-phiphi-bamboo-seastar/tour-phiphi-bamboo-seastar01.jpg'
            ];

            $tours[] = [
                'image'       => $images[array_rand($images)],
                'title'       => "แพ็คเกจทัวร์สุดพิเศษ รายการที่ $i ($randomDays วัน " . ($randomDays - 1) . " คืน)",
                'description' => "สัมผัสประสบการณ์การท่องเที่ยวที่เหนือระดับในรายการที่ $i กับโปรแกรมท่องเที่ยวทะเลอันดามันยอดฮิต นำท่านชมความงามของปะการังน้ำตื้นและฝูงปลาหลากสีสัน บริการพร้อมอาหารกลางวันแบบบุฟเฟต์ริมหาด รถรับส่งจากโรงแรมที่พัก และทีมงานไกด์มืออาชีพที่พร้อมดูแลท่านตลอดการเดินทาง",
                'price'       => $price,
                'created_at'  => $now->copy()->addHours($i), // ให้เวลาต่างกันเพื่อเทส Pagination
                'updated_at'  => $now->copy()->addHours($i),
            ];

            // เพื่อประสิทธิภาพ: Insert ทีละ 50 รายการ
            if (count($tours) == 50) {
                Tour::insert($tours);
                $tours = [];
            }
        }

        // Insert ส่วนที่เหลือ
        if (!empty($tours)) {
            Tour::insert($tours);
        }





        // call to get content from TourList.sqlite
        Model::unguard();
        $path = "DB/TourList.sqlite";

        if (file_exists(base_path($path))) {
            DB::unprepared(file_get_contents(base_path($path)));
            $this->command->info("Tour List has been Created from file " . $path);
        } else {
            $this->command->error("File not found: " . $path);
        }
        Model::reguard();

    }
}
