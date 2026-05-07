<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tour;
use Illuminate\Support\Facades\Log;

class TourController extends Controller
{


/**
     * ดึงรายการทัวร์แบบแบ่งหน้า หน้าละ 20 รายการ
     * เรียงลำดับจากใหม่สุดไปเก่าสุด
     */
    public function index()
    {
        try {
            // ใช้ paginate(20) เพื่อแบ่งหน้าละ 20 รายการ
            // โดยเรียงลำดับจากข้อมูลล่าสุด (latest() หรือ orderBy('id', 'desc'))
            $tours = Tour::latest()->paginate(20);

            // Laravel จะสร้าง JSON Structure ที่มีข้อมูลการแบ่งหน้ามาให้โดยอัตโนมัติ
            return response()->json([
                'success' => true,
                'data' => $tours->items(),          // รายการข้อมูลทัวร์ 20 รายการของหน้านั้น
                'pagination' => [
                    'total' => $tours->total(),           // จำนวนรายการทั้งหมดที่มีในฐานข้อมูล
                    'per_page' => $tours->perPage(),     // จำนวนต่อหน้า (20)
                    'current_page' => $tours->currentPage(), // หน้าที่กำลังเรียกดูอยู่
                    'last_page' => $tours->lastPage(),    // จำนวนหน้าทั้งหมด
                    'from' => $tours->firstItem(),
                    'to' => $tours->lastItem()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * บันทึกข้อมูลทัวร์ใหม่
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'price' => 'required|numeric',
            'image' => 'nullable|string'
        ]);

        try {
            $tour = Tour::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'บันทึกรายการทัวร์เรียบร้อยแล้ว',
                'data' => $tour
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'ไม่สามารถบันทึกได้'], 500);
        }
    }

    /**
     * แสดงข้อมูลทัวร์รายตัว
     */
    public function show(string $id)
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json(['success' => false, 'message' => 'ไม่พบข้อมูลทัวร์ที่ระบุ'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tour
        ], 200);
    }

    /**
     * อัปเดตข้อมูลทัวร์
     */
    public function update(Request $request, string $id)
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json(['success' => false, 'message' => 'ไม่พบรายการทัวร์'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required',
            'price' => 'sometimes|required|numeric',
            'image' => 'nullable|string'
        ]);

        try {
            $tour->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'อัปเดตข้อมูลสำเร็จ',
                'data' => $tour
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'อัปเดตล้มเหลว'], 500);
        }
    }

    /**
     * ลบทัวร์
     */
    public function destroy(string $id)
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json(['success' => false, 'message' => 'ไม่พบรายการที่ต้องการลบ'], 404);
        }

        try {
            $tour->delete();
            return response()->json([
                'success' => true,
                'message' => 'ลบรายการทัวร์เรียบร้อยแล้ว'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'ไม่สามารถลบได้'], 500);
        }
    }
}
