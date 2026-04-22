"use client";
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

import { Search, Bell } from 'lucide-react';
import AccountDropdown from './AccountDropdown'; // ✅ Import Component ใหม่

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'โปรแกรมทัวร์', href: '/tours' },
    { name: 'เกี่ยวกับเรา', href: '/about-us' },
    { name: 'ติดต่อเรา', href: '/contact-us' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-red-600 flex items-center">
            <span className="text-3xl mr-2">✈️</span> Thaitan Tours
          </Link>
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-gray-700 hover:text-red-600 font-medium transition">
                {link.name}
              </Link>
            ))}

                        {
                            /*
                             *
            <Link href="/auth" className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition">
              เข้าสู่ระบบ xx
            </Link>
                             *
                             *
                             */

                        }
{/* ส่วนขวา: Notifications & User Dropdown */}
      <div className="flex items-center gap-5">
        <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* ✅ นำ UserDropdown มาวางตรงนี้ */}
        <AccountDropdown />
      </div>

          </div>
          {/* Mobile Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="block text-gray-700 py-2">{link.name}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
