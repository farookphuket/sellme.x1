<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use App\Models\Booking;
use App\Models\Customer;
use App\Models\Tour;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $tours สำหรับนำไปใช้ในหน้า Booking Form (เช่น Select Box)
        $tours = Tour::all();

        // return ข้อมูลการจองพร้อม Tour และ Customer โดยเอาที่เพิ่มล่าสุดขึ้นก่อน
        $bookings = Booking::with(['tour', 'customer'])->latest()->get();

        return response()->json([
            'tours' => $tours,
            'bookings' => $bookings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate ข้อมูลทั้ง Customer และ Booking
        $validator = Validator::make($request->all(), [
            // Customer Validation
            'customer.name' => 'required|string|max:255',
            'customer.last_name' => 'required|string|max:255',
            'customer.nick_name' => 'nullable|string',
            'customer.email' => 'nullable|string',
            'customer.hotel' => 'nullable|string',
            'customer.room_number' => 'nullable|string',

            // Booking Validation
            'tour_id' => 'required|exists:tours,id',
            'pay_method' => 'required',
            'paid_status' => 'required',
            'pay_on_arrival' => 'nullable',
            'pay_deposit' => 'required|numeric',
            'pickup_at' => 'nullable|string',
            'special_request' => 'nullable|string',
            'date_departure' => 'required|date',
            'date_confirmed' => 'nullable|date',
            'total_price' => 'required|numeric',
            'price_per_pax' => 'required|numeric',
            'total_pax' => 'required|integer',
            'must_pay_on_departure' => 'required|numeric'
        ]);


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // 2. สร้าง New Customer
                $customer = Customer::create($request->only([
                    'name', 'last_name', 'nick_name', 'email', 'hotel', 'room_number'
                ]) + ['user_id' => auth()->id()]);

                // 3. สร้าง New Booking ผูกกับ Customer ID ที่เพิ่งสร้าง
                $booking = Booking::create($request->except([
                    'name', 'last_name', 'nick_name', 'email', 'hotel', 'room_number'
                ]) + [
                    'customer_id' => $customer->id,
                    'user_id' => auth()->id()
                ]);

                return response()->json([
                    'message' => 'Booking created successfully',
                    'data' => $booking->load(['customer', 'tour'])
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create booking', 'error' => $e->getMessage()], 500);
        }
    }



public function myBookings(Request $request)
{
    // ดึง User ที่ล็อกอินอยู่
    $user = $request->user();

    // หา Customer ที่ผูกกับ User นี้
    $customer = Customer::where('user_id', $user->id)->first();

    if ($customer) {
        // ดึงรายการจองที่สัมพันธ์กับ Customer นี้ พร้อมข้อมูลทัวร์
        $bookings = Booking::where('customer_id', $customer->id)
                    ->with('tour')
                    ->orderBy('date_departure', 'desc')
                    ->get();
    } else {
        $bookings = collect();
    }

    return response()->json($bookings);
}




    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // ดึงข้อมูลการจอง $id นี้พร้อมความสัมพันธ์
        $booking = Booking::with(['tour', 'customer'])->find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // นับจำนวน bookings ทั้งหมดในวันที่จองเดียวกัน เพื่อแสดงยอดรวมของวันนั้น[cite: 2]
        $daily_bookings_count = Booking::where('date_departure', $booking->date_departure)->count();

        return response()->json([
            'booking' => $booking,
            'daily_bookings_count' => $daily_bookings_count,
            'tours_list' => Tour::all() // สำหรับให้เลือกเปลี่ยนทัวร์ใน List box
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);
        $customer = Customer::findOrFail($booking->customer_id);

        // Validate ข้อมูล
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'last_name' => 'required',
            'tour_id' => 'required|exists:tours,id',
            'date_departure' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::transaction(function () use ($request, $booking, $customer) {
                // แก้ไขข้อมูลลูกค้า
                $customer->update($request->only([
                    'name', 'last_name', 'nick_name', 'hotel', 'room_number'
                ]));

                // แก้ไขข้อมูลการจอง[cite: 2]
                $booking->update($request->only([
                    'tour_id', 'pay_method', 'paid_status', 'pay_on_arrival',
                    'pay_deposit', 'pickup_at', 'date_departure', 'date_confirmed'
                ]));
            });

            return response()->json([
                'message' => 'Booking updated successfully',
                'data' => $booking->load(['customer', 'tour'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Update failed'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        try {
            DB::transaction(function () use ($booking) {
                $customerId = $booking->customer_id;

                // ลบการจอง $id[cite: 2]
                $booking->delete();

                // ลบลูกค้าที่ผูกกับข้อมูลการจองนี้[cite: 2]
                Customer::where('id', $customerId)->delete();
            });

            return response()->json(['message' => 'Booking and customer deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Delete failed'], 500);
        }
    }
}
