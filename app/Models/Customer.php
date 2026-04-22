<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $fillable = [
        'name' ,
        'last_name' ,
        'nick_name' ,
        'hotel' ,
        'room_number' ,
    ];
}
