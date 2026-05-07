<?php

namespace App\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Customer;


class Controllers extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $tours to load in the booking form


        // return booking with tour with customer last add first



    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {


        // validate
        /*
         *
        'name' => 'required',
        'last_name => 'required ,
        'nick_name' ,
        'hotel' ,
        'room_number' ,
         * */

        // validate
        /*
        'tour_id', 'customer_id', 'pay_method', 'paid_status',
        'pay_on_arrival', 'pay_deposit', 'pickup_at',
        'date_departure', 'date_confirmed'
         */


        // create new customer,new booking

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //สำหรับแก้ไขข้อมูล ลูกค้าสามารถเลือกจองทัวร์อื่นได้จาก list box


        // return ข้อมูลการจองของลูกค้า $id นี้ และ show จำนวน bookings ในวันที่ $id นี้จอง

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {


        // validate พร้อม แก้ไข
        /*
         *
        'name' ,
        'last_name' ,
        'nick_name' ,
        'hotel' ,
        'room_number' ,
         * */

        // validate พร้อมแก้ไข
        /*
        'tour_id', 'customer_id', 'pay_method', 'paid_status',
        'pay_on_arrival', 'pay_deposit', 'pickup_at',
        'date_departure', 'date_confirmed'
         */

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // ลบข้อมูลการจอง $id


        // ลบลูกค้า $id

        // ส่งข้อความกลับไปเมื่อลบเรียบร้อย
    }
}
