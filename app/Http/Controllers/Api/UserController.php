<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

// last update 29 Apr. 2026 using Gemini

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(User::with('roles')->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. เช็คว่ามี ชื่อนี้ อีเมลนี้ หรือยัง และเช็คว่าชื่อต้องไม่ใช่ root, admin
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:users',
                function ($attribute, $value, $fail) {
                    if (in_array(strtolower($value), ['root', 'admin'])) {
                        $fail('ชื่อผู้ใช้ห้ามเป็น "root" หรือ "admin"');
                    }
                },
            ],
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:4',
            'roles' => 'required|array' // ตรวจสอบว่าส่ง Roles มาเป็น Array
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // 2. หากไม่มีอะไรผิดพลาดให้สร้าง User นี้
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                ]);

                // 3. check ว่า User นี้มี Role อะไรบ้าง ถ้าเลือกมาให้ผูกกับ User นี้
                if ($request->has('roles')) {
                    $user->roles()->sync($request->roles);
                }

                // 4. ส่งค่า $user::with('roles') กลับไปพร้อมข้อความ Success
                return response()->json([
                    'message' => 'User created successfully',
                    'data' => $user->load('roles')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create user'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Return this user $id with the role
        $user = User::with('roles')->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => "required|string|max:255|unique:users,name,{$id}",
            'email' => "required|string|email|max:255|unique:users,email,{$id}",
            'roles' => 'array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::transaction(function () use ($request, $user) {
                // Update basic info
                $user->update($request->only(['name', 'email']));

                // Check if role change then update the role
                if ($request->has('roles')) {
                    $user->roles()->sync($request->roles);
                }
            });

            return response()->json([
                'message' => 'User updated successfully',
                'data' => $user->load('roles')
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Update failed'], 500);
        }
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
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            DB::transaction(function () use ($user) {
                // เช็คว่า User นี้มี Role อะไรบ้างให้ลบ Role ของ User นี้ (Detach relations)
                $user->roles()->detach();

                // จากนั้นลบ User นี้
                $user->delete();
            });

            return response()->json(['message' => 'User and their roles deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Delete failed'], 500);
        }
    }
}
