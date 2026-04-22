<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use App\Models\Role;
use Illuminate\Database\Eloquent\Model as Eloquent;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*

        $roles = [
                ['name' => 'root', 'display_name' => 'Super Admin'],
                ['name' => 'boss', 'display_name' => 'The Boss'],
                ['name' => 'booking', 'display_name' => 'Booking Manager'],
                ['name' => 'account', 'display_name' => 'Accountant'],
                ['name' => 'agency', 'display_name' => 'Travel Agency'],
                ['name' => 'customer', 'display_name' => 'Customer'],
                ['name' => 'staff', 'display_name' => 'Staff (Viewer)'],
            ];

            foreach ($roles as $role) {
                Role::create($role);
            }


            // SQLSTATE[23000]: Integrity constraint violation: 19 NOT NULL constraint failed
        */

        // make insert to Roles table
        Eloquent::unguard();
        $path = 'DB/RolesList.sqlite';
        DB::unprepared(@file_get_contents($path));
        $this->command->info("Role has been Created!! from file ".$path);

    }
}
