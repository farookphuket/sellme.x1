<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class TourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
