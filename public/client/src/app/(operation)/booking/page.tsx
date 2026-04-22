"use client";
import React, { useState } from 'react';
import {
  Search, Filter, Calendar, MapPin,
  ChevronRight, Info, CheckCircle, Clock,
  User, Phone, Mail, MoreHorizontal
} from 'lucide-react';

import BookingSidebarRight from "@/components/BookingSidebarRight"

export default function BookingPage() {

  const [selectedBooking, setSelectedBooking] = useState<any>(null);



  const bookings = [
    { id: 'BK-7701', customer: 'John Smith', tour: 'Phuket Island Hopping', date: '12 Apr 2026', status: 'Confirmed', amount: '฿5,200' },
    { id: 'BK-7702', customer: 'Sarah Connor', tour: 'Chiang Mai Safari', date: '15 Apr 2026', status: 'Pending', amount: '฿3,400' },
    { id: 'BK-7703', customer: 'Michael Chen', tour: 'Bangkok Temple Tour', date: '18 Apr 2026', status: 'Confirmed', amount: '฿2,100' },
  ];


  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* --- TOP NAVBAR --- */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-900">Booking Management</h1>
          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Total: 156</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Booking ID..."
              className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            + New Booking
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* --- MAIN CONTENT (Middle) --- */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                <Calendar className="w-4 h-4" /> Date Range
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Booking ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tour / Package</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Travel Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedBooking(item)}
                    className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${selectedBooking?.id === item.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 font-bold text-blue-700">{item.id}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium">{item.customer}</td>
                    <td className="px-6 py-4 text-slate-600">{item.tour}</td>
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.status === 'Confirmed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <aside className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
          {selectedBooking ? (
            <div className="p-6 animate-fade-in">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-bold text-slate-900">Booking Details</h2>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal /></button>
              </div>

              <div className="bg-blue-600 rounded-2xl p-5 text-white mb-8 shadow-lg shadow-blue-200">
                <p className="text-blue-100 text-xs font-medium uppercase mb-1">Total Amount</p>

                <h3 className="text-3xl font-bold">{selectedBooking.amount}</h3>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-semibold backdrop-blur-md transition-all">
                    Print Ticket
                  </button>
                  <button className="flex-1 bg-white text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-xs font-semibold transition-all">
                    Send Invoice
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><User className="w-4 h-4" /></div>
                      <span className="font-medium text-slate-700">{selectedBooking.customer}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                      <span>+66 81 234 5678</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                      <span>customer@example.com</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tour Details</h4>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{selectedBooking.tour}</p>
                        <p className="text-xs text-slate-500">Pickup: 08:30 AM at Lobby</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6">
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:border-blue-400 hover:text-blue-500 transition-all">
                    + Add Internal Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Info className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Select a booking to view details</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
