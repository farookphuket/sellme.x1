<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;
    protected $fillable = [
        'tour_id', 'customer_id', 'user_id', 'pay_method', 'paid_status',
        'pay_on_arrival', 'pay_deposit', 'pickup_at',
        'price_per_pax','total_pax','total_price','must_pay_on_departure',
        'special_request','date_departure', 'date_confirmed'
    ];

    // การจองนี้เป็นของ Tour ไหน
    public function tour() {
        return $this->belongsTo(Tour::class);
    }

    // การจองนี้เป็นของ Customer ท่านใด
    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    // การจองนี้เป็นของ User ท่านใด
    public function user() {
        return $this->belongsTo(User::class);
    }
}
