"use client";
import React from 'react';
import {
  Calendar, MapPin, Users, CreditCard,
  ExternalLink, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';

interface BookingListProps {
  bookings: any[];
}

export default function MyBookingTourList({ bookings }: BookingListProps) {
  return (
    <div className="w-full overflow-hidden bg-white rounded-[2rem] border border-red-100 shadow-xl shadow-red-50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="p-6 font-black uppercase text-sm tracking-wider rounded-tl-[1.8rem]">โปรแกรมทัวร์</th>
              <th className="p-6 font-black uppercase text-sm tracking-wider">วันที่เดินทาง</th>
              <th className="p-6 font-black uppercase text-sm tracking-wider text-center">จำนวนคน</th>
              <th className="p-6 font-black uppercase text-sm tracking-wider">สถานะชำระเงิน</th>
              <th className="p-6 font-black uppercase text-sm tracking-wider text-right">ยอดรวม</th>
              <th className="p-6 font-black uppercase text-sm tracking-wider text-center rounded-tr-[1.8rem]">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-50">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-red-50/30 transition-colors group">
                  {/* โปรแกรมทัวร์ */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-red-100">
                        <img
                          src={booking.tour?.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {booking.tour?.title}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-bold mt-1">
                          <MapPin size={12} className="text-red-500" />
                          <span>{booking.pickup_at}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* วันที่เดินทาง */}
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700 flex items-center gap-2">
                        <Calendar size={16} className="text-red-500" />
                        {booking.date_departure}
                      </span>
                      <span className="text-xs text-slate-400 font-bold ml-6">Booking ID: #{booking.id}</span>
                    </div>
                  </td>

                  {/* จำนวนคน */}
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-black text-slate-700">
                      <Users size={16} />
                      {booking.total_pax}
                    </div>
                  </td>

                  {/* สถานะชำระเงิน */}
                  <td className="p-6">
                    {booking.paid_status === 'paid' ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 text-green-600 text-xs font-black">
                        <CheckCircle2 size={14} /> ชำระเงินแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-black animate-pulse">
                        <AlertCircle size={14} /> รอชำระเงิน
                      </span>
                    )}
                  </td>

                  {/* ยอดรวม */}
                  <td className="p-6 text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Net Total</p>
                    <p className="text-xl font-black text-red-600">
                      ฿{Number(booking.total_price).toLocaleString()}
                    </p>
                  </td>

                  {/* จัดการ */}
                  <td className="p-6 text-center">
                    <button className="p-3 bg-white border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95">
                      <ExternalLink size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                      <Clock size={40} className="text-red-200" />
                    </div>
                    <p className="text-slate-400 font-black text-xl">ไม่พบรายการจองในระบบ</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
