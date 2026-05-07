<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    use HasFactory; // 2. เรียกใช้งาน Trait ภายใน class
    protected $fillable = [
        'user_id',
        'name' ,
        'last_name' ,
        'nick_name' ,
        'email' ,
        'hotel' ,
        'room_number' ,
        'user_id'
    ];


    public function bookings() {
        return $this->hasMany(Booking::class);
    }



    // การจองนี้เป็นของ User ท่านใด
    public function user() {
        return $this->belongsTo(User::class);
    }
}
