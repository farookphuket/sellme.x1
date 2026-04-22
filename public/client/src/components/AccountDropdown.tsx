"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie } from 'cookies-next';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ดึงชื่อ User มาแสดง (สมมติเราเก็บไว้ใน Cookie ตอน Login)
  useEffect(() => {
    const storedRole = getCookie('user_role'); // หรือดึงจาก API
    const storedName = getCookie('user_name'); // หรือดึงจาก API
    setUserRole(storedRole as string || 'account');
    setUserName(storedName as string);
  }, []);

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // 1. ลบ Token และข้อมูล User ออกจาก Cookie
    deleteCookie('token');
    deleteCookie('user_role');
    deleteCookie('user_name');

    // 2. ดีดกลับไปหน้า Login
    router.push('/auth');
    // window.location.reload(); // เคลียร์ state ทั้งหมด
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        {/* Avatar Image / Placeholder */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-inner">
          {userName ? userName.charAt(0).toUpperCase() : 'A'}
          {/* <img src="/path/to/avatar.jpg" alt="Avatar" className="w-full h-full rounded-full object-cover" /> */}
        </div>

        <div className="text-left hidden md:block">
          <p className="text-sm font-semibold text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu - Glassmorphism Effect */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl z-50 p-2 animate-fade-in-down">
          <div className="px-4 py-3 border-b border-gray-100 mb-2">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{userRole} Settings</p>
          </div>

          <Link
            href="/account/profile"
            className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-5 h-5" />
            <span className="font-medium text-sm">Edit Profile</span>
          </Link>

          <Link
            href="/account/settings"
            className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Preferences</span>
          </Link>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 w-full rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
