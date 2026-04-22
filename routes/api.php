<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\TourController as Tour;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;



Route::apiResource('tours',Tour::class);

Route::apiResource('customers',CustomerController::class);

Route::post('/login',[AuthController::class,'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// routes/api.php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
});
