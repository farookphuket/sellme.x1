<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    //
    use HasFactory;
    protected $fillable = ["image","title","description","price"];

    public function bookings() {
        return $this->hasMany(Booking::class);
    }

}
