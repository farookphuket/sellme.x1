"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import BookingFormSteps from '@/components/BookingFormSteps';
import {
  Plus, Edit, Trash2, X,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [tourOptions, setTourOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // เก็บข้อมูล Booking ที่กำลังจะแก้ไข (ถ้าเป็น null คือการเพิ่มใหม่)
  const [editingData, setEditingData] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      // ตรวจสอบโครงสร้าง Response ให้ตรงกับ Backend ของคุณ
      setBookings(res.data.bookings || []);
      setTourOptions(res.data.tours || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  // ฟังก์ชันรับข้อมูลจาก Component ลูกมา Save ลงฐานข้อมูล
  const handleBookingSuccess = async (finalData: any) => {
    try {
      if (editingData?.id) {
        // กรณีแก้ไข
        await api.put(`/bookings/${editingData.id}`, finalData);

      } else {
        // กรณีเพิ่มใหม่
        await api.post('/bookings', finalData);
      }

      setIsOpen(false);
      setEditingData(null);
      fetchBookings(); // โหลดข้อมูลใหม่
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Save error:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณต้องการลบรายการจองนี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      alert("ไม่สามารถลบข้อมูลได้");
    }
  };




  // Logic การทำ Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(bookings) ? bookings.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">Booking Management</h1>
          <p className="text-gray-500">ระบบจัดการการจองทัวร์ (Step-by-Step)</p>
        </div>
        <button
          onClick={() => { setEditingData(null); setIsOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center gap-2 transition-all shadow-lg font-bold"
        >
          <Plus className="w-5 h-5" /> New Booking
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20 text-blue-600 font-bold">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-blue-50 overflow-hidden shadow-sm shadow-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50/50 text-blue-900 text-xs uppercase font-bold tracking-widest border-b border-blue-100">
                  <th className="px-6 py-5">Customer / Tour</th>
                  <th className="px-6 py-5">Departure</th>
                  <th className="px-6 py-5">Method</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Deposit</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.map((booking: any) => (
                  <tr key={booking.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900">
                        {booking.customer?.name} {booking.customer?.last_name}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">{booking.tour?.title}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {new Date(booking.date_departure).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-sm uppercase font-bold text-gray-400">
                      {booking.pay_method}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        booking.paid_status?.includes('collect') ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>
                        {booking.paid_status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono font-bold text-gray-700">
                      ฿{Number(booking.pay_deposit).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => { setEditingData(booking); setIsOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-xl bg-white border disabled:opacity-30"
          >
            <ChevronLeft />
          </button>
          <span className="font-bold text-blue-900">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-xl bg-white border disabled:opacity-30"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Modal Section */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-sm">
           <BookingFormSteps
              tourOptions={tourOptions}
              // ส่งข้อมูลเก่าเข้าไปถ้าเป็นการ Edit
              initialData={editingData}
              onClose={() => { setIsOpen(false); setEditingData(null); }}
              onSuccess={handleBookingSuccess}
           />
        </div>
      )}
    </div>
  );
}
