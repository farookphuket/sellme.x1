"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard book', href: '/booking', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'System Roles', href: '/admin/roles', icon: ShieldCheck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function BookingSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-white/10 text-white p-4 flex flex-col">
      <div className="mb-10 px-2 py-4 border-b border-white/5">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          SELLME Booking
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Booking User</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-blue-400'}`} />
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="flex items-center gap-3 p-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
