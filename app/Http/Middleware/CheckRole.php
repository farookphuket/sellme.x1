<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

// 1. เช็กว่า Login หรือยัง
        if (!Auth::check()) {
            return response()->json(['message' => 'กรุณาเข้าสู่ระบบ'], 401);
        }

        // 2. ดึง Role ของ User ปัจจุบัน (สมมติว่า User hasOne Role)
        $user = Auth::user();
        $roles = $user->roles->pluck('name')->toArray();
        $isAcceptUrl = "/login";
        foreach($roles as $role) {
            switch ($role) {
                case 'root':
                    # code...
                    $isAcceptUrl = '/admin/dashboard';
                    break;

                case 'boss':
                    $isAcceptUrl = '/boss/dashboard';
                    break;
                default:
                    # code...
                    $isAcceptUrl = '/customer/dashboard';
                    break;
            }
        }


/*
        // 3. ถ้าเป็น 'root' ให้ผ่านได้ทุกประตู (Super Admin)
        if ($userRole === 'root') {
            return $next($request);
        }

        // 4. เช็กว่า Role ของ User ตรงกับที่อนุญาตใน Route หรือไม่
        if (!in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้',
                'required_roles' => $roles,
                'your_role' => $userRole
            ], 403);
        }

 */

        $data = [
            "url" => $isAcceptUrl,
            "user_id" => $user->id,
        ];
      //  return $next($request);
        // will return url
        return response()->json($data);
    }
}
