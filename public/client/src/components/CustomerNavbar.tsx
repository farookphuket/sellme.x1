"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LogOut, User, Settings, Trash2, Menu, X,
  ChevronDown, Ticket, Home, UserCircle
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
  userName: string;
  role: {
    display_name: string;
    name: string;
  };
  avatar?: string;
}

export default function CustomerNavbar({ userName, role, avatar }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // ใช้เช็คว่าอยู่หน้าไหนเพื่อทำ Active State

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.push('/auth');
    router.refresh();
  };

  // รวมเมนูจาก Sidebar ไว้ที่นี่เพื่อเรียกใช้ซ้ำใน Mobile
  const menuItems = [
    { name: 'รายการจองของฉัน', href: '/my-bookings', icon: <Ticket size={20} /> },
    { name: 'โปรไฟล์ของฉัน', href: '/profile', icon: <UserCircle size={20} /> },
    { name: 'กลับหน้าหลักทัวร์', href: '/my-tours', icon: <Home size={20} />, isExtra: true },
  ];

  return (
    <nav className="h-20 bg-white border-b border-slate-200 sticky top-0 z-[100] px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">

        {/* Logo */}
        <Link href="/my-bookings" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            T
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">
            MyTour <span className="text-blue-600">Portal</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* User Info (Desktop Only) */}
          <div className="hidden md:flex flex-col text-right mr-2">
            <span className="text-sm font-black text-slate-800 leading-none">{userName}</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
              {role?.display_name || 'Customer'}
            </span>
          </div>

          {/* User Avatar & Dropdown (Desktop/Tablet) */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-black overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                  <Link href="/profile/edit" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <User size={18} /> Edit Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* --- Mobile Side Menu (Drawer) --- */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Content */}
          <div className="fixed right-0 top-0 h-full w-[280px] bg-white z-[120] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 lg:hidden">

             {/* Header ใน Drawer */}
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-tight">{userName}</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase">{role?.display_name}</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                  <X size={20} />
                </button>
             </div>

             {/* Menu List (คัดลอกมาจาก Sidebar) */}
             <div className="p-4 flex flex-col gap-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3">
                  Main Menu
                </p>

                {menuItems.map((item) => (
                  <React.Fragment key={item.href}>
                    {item.isExtra && <div className="my-2 border-t border-slate-50 pt-2" />}
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                        pathname === item.href
                        ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                        : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </React.Fragment>
                ))}
             </div>

             {/* Bottom Actions */}
             <div className="mt-auto p-4 border-t border-slate-50 bg-slate-50/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
                >
                  <LogOut size={20} />
                  <span>ออกจากระบบ</span>
                </button>
             </div>
          </div>
        </>
      )}
    </nav>
  );
}
