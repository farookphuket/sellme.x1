<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // make user table
        Model::unguard();
        $path = 'DB/UserList.sqlite';
        if(file_exists(base_path($path)))
        {
            DB::unprepared(file_get_contents(base_path($path)));
            $this->command->info("User 19 Mar 2026 has been Created!!");
        }else{
            $this->command->error("Error files not found !! " .$path);
        }
        Model::reguard();
    }
}
