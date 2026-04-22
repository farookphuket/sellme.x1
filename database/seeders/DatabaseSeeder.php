<?php

namespace Database\Seeders;

// use App\Models\User; // comment out as not use
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


use Illuminate\Support\Facades\DB;        // ✅ เพิ่มการ Import DB
use Illuminate\Database\Eloquent\Model;  // ✅ เพิ่มการ Import สำหรับ Eloquent

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

    //    User::factory()->create([
    //        'name' => 'Test User',
    //        'email' => 'test@example.com',
    //    ]);

        $this->call(
            [
                RoleSeeder::class,
                UserSeeder::class,
                TourSeeder::class,
            ]
        );

          $this->make_pip_table();

    }


    public function make_pip_table(): void
    {

            /* link user to role */
            Model::unguard();
            // $role_file = 'DB/User_Role_link.sqlite';
            $link_files = [
                "role_user" => "DB/User_Role_link.sqlite",
                "tour_user" => "DB/User_Tour_link.sqlite"
            ];

            foreach($link_files as $link_file){

                if (file_exists(base_path($link_file))) {
                    DB::unprepared(file_get_contents($link_file));
                    $this->command->info("link to user has been Created from file " . $link_file."\n");
                } else {
                    $this->command->error("File not found: " . $link_file);
                }
            }

            Model::reguard();

    }
}
