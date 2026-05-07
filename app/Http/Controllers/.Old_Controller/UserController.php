<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(User::with('roles')->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // เชคว่ามี ชื่อนี้ อีเมลนี้ หรือยังถ้ามีแล้วให้แจ้งกลับไป และไม่สานารถบันทึก ชื่อ หรือ อีเมล ซ้ำได้

        // เชคว่าชื่อต้องไม่ใช่ root,admin

        // หากว่าไม่มีอะไรผิดพลาดให้สร้าง User นี้


        // check ว่า User นี้มี Role อะไรบ้าง ถ้าเลือกมาให้ผูกกับ User นี้


        // ส่งค่า $User::with('roles) นี้กลับไปพร้อมข้อความ Success
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Return this user $id with the role


    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // check if this user $id has role change then update the role
        // and update this user

    }


    public function toggleStatus(User $user) {
        $user->update([
            'is_active' => !$user->is_active
        ]);
        return response()->json(['message' => 'Status updated', 'is_active' => $user->is_active]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // เชคว่า User นี้มี Role อะไรบ้างให้ลบ Role ของ User นี้
        // จากนั้นลบ User นี้
    }
}
