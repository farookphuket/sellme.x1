"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import MyBookingTourList from '@/components/MyBookingTourList'; // import เข้ามา

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await api.get('/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-red-600 animate-pulse">กำลังดึงข้อมูลการจอง...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 border-l-8 border-red-600 pl-6">
        <h2 className="text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
          My <span className="text-red-600">Bookings</span>
        </h2>
        <p className="text-slate-500 font-bold italic">ตรวจสอบและจัดการประวัติการเดินทางของคุณ</p>
      </div>

      {/* เรียกใช้ Component ที่แยกออกมา */}
      <MyBookingTourList bookings={bookings} />
    </div>
  );
}
