<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use App\Http\Middleware\CheckRole;

class AuthController extends Controller
{
    //
public function login(Request $request)
    {
        // 1. Validate ข้อมูลที่รับมาจาก Next.js
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $message = "";

        // 2. ตรวจสอบ Credentials
        if (!Auth::attempt($request->only('email', 'password'))) {
            $message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
            return response()->json([
                'status' => 'error',
                'message' => $message
            ], 401);
        }

        // 3. ดึงข้อมูล User พร้อมกับ Role (Eager Loading)
        //$user = User::with('role')->where('email', $request->email)->firstOrFail();
        $user = User::with('roles')->where('email', $request->email)->firstOrFail();
        $roles = $user->roles->pluck('name')->toArray();
        $token = "";
        $url = "/no";

        if(Auth::attempt($request->only('email','password')))
        {
            /** @var \App\Models\User $user **/
            $user = Auth::user();
            $url = CheckRole::class;
            $token = $user->createToken('auth_token')->plainTextToken;
            $message = 'ลอคอินสำเร็จ';
        }
        /*
        $data = [
            "user" => $user,
            "roles" => $roles,
            "token" => $token
        ];
        dd($data);
        $token = "";

         */

        // 5. ส่งข้อมูลกลับไปให้ Frontend
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()->name, // ส่งชื่อ Role ไป (root, account, customer ฯลฯ)
                    //'display_role' => $user->role->display_name // ชื่อภาษาไทยสำหรับแสดงผล
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        // ลบ Token ปัจจุบันทิ้ง
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'ออกจากระบบเรียบร้อยแล้ว'
        ]);
    }
}
