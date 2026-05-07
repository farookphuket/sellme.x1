import React from 'react';
import Link from 'next/link';
import { Ticket, Home, UserCircle } from 'lucide-react';

export default function CustomerSidebar() {
  return (
    <aside className="w-64 hidden lg:block p-8 border-r border-slate-100 min-h-[calc(100vh-80px)]">
      <div className="space-y-2 sticky top-28">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">
          Main Menu
        </p>

        <Link href="/my-bookings" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black shadow-sm shadow-blue-100">
          <Ticket size={20} />
          <span>รายการจองของฉัน</span>
        </Link>

        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-2xl font-bold transition-all">
          <UserCircle size={20} />
          <span>โปรไฟล์ของฉัน</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link href="/my-tours" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-2xl font-bold transition-all">
            <Home size={20} />
            <span>กลับหน้าหลักทัวร์</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
