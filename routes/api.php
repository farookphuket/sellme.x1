<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\TourController as Tour;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;



Route::apiResource('tours',Tour::class);

Route::apiResource('customers',CustomerController::class);

/*
 * edit the user system
 */
Route::apiResource('users', UserController::class);

Route::middleware('auth:sanctum')->apiResource('bookings',BookingController::class);

Route::apiResource('roles', RoleController::class);

Route::patch('/users/{user}/toggle', [UserController::class, 'toggleStatus']);

Route::post('/login',[AuthController::class,'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// --------------------------------------------------
// Customer Routes (สำหรับลูกค้าทั่วไปและผู้ใช้ระบบ)
// --------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // ดึงข้อมูลโปรไฟล์ของตัวเอง (ที่ใช้ใน CustomerLayout)
    Route::get('/user-profile', [AuthController::class, 'profile']);

    // ดูรายการจองเฉพาะของตัวเอง (My Bookings)
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);

    // ดูรายละเอียดการจองเฉพาะรายการ (ต้องเช็คความเป็นเจ้าของใน Controller ด้วย)
    Route::get('/my-bookings/{id}', [BookingController::class, 'showMyBooking']);

    // ลูกค้าทำการจองทัวร์ใหม่
    Route::post('/bookings/checkout', [BookingController::class, 'store']);

});



// routes/api.php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
});
