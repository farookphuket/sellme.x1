"use client";
import React, { useState } from 'react';
import { Users, Map, Calendar, DollarSign, Plus, Edit, Trash2, Search } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'tours' | 'users'>('tours');

  return (
    <div className="space-y-8">
      {/* 1. Header Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Tours" value="48" icon={<Map />} color="bg-blue-500" />
        <StatCard title="Total Users" value="1,250" icon={<Users />} color="bg-purple-500" />
        <StatCard title="Bookings" value="156" icon={<Calendar />} color="bg-orange-500" />
        <StatCard title="Revenue" value="฿450k" icon={<DollarSign />} color="bg-emerald-500" />
      </div>

      {/* 2. Management Section */}
      <div className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        {/* Tab Switcher */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-6 py-4 font-medium transition-all ${activeTab === 'tours' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-gray-400 hover:text-white'}`}
          >
            Tour Packages Rh
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 font-medium transition-all ${activeTab === 'users' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-gray-400 hover:text-white'}`}
          >
            User Management
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            <Plus className="w-4 h-4" />
            Add New {activeTab === 'tours' ? 'Tour' : 'User'}
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
              {activeTab === 'tours' ? (
                <tr>
                  <th className="px-6 py-4">Tour Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email / Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* ตัวอย่างข้อมูลสำหรับ Tour */}
              {activeTab === 'tours' && <TourRows />}
              {/* ตัวอย่างข้อมูลสำหรับ User */}
              {activeTab === 'users' && <UserRows />}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-gray-900/40 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
      <div className={`p-3 rounded-xl ${color} text-white`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs uppercase font-bold tracking-tight">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}

function TourRows() {
  const tours = [
    { id: 1, name: 'Phuket Island Hopping', price: '฿2,500', status: 'Active' },
    { id: 2, name: 'Chiang Mai Night Safari', price: '฿1,200', status: 'Draft' },
  ];
  return (
    <>
      {tours.map(tour => (
        <tr key={tour.id} className="hover:bg-white/5 transition-colors">
          <td className="px-6 py-4 font-medium text-white">{tour.name}</td>
          <td className="px-6 py-4 text-gray-300">{tour.price}</td>
          <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded-full text-[10px] ${tour.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {tour.status}
            </span>
          </td>
          <td className="px-6 py-4 text-right space-x-2">
            <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg"><Edit className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </td>
        </tr>
      ))}
    </>
  );
}

function UserRows() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Staff' },
    { id: 2, name: 'Somsak Jaidee', email: 'somsak@agency.com', role: 'Agency' },
  ];
  return (
    <>
      {users.map(user => (
        <tr key={user.id} className="hover:bg-white/5 transition-colors">
          <td className="px-6 py-4 font-medium text-white">{user.name}</td>
          <td className="px-6 py-4">
            <div className="text-white">{user.email}</div>
            <div className="text-xs text-blue-400">{user.role}</div>
          </td>
          <td className="px-6 py-4 text-gray-400 text-xs">Oct 12, 2023</td>
          <td className="px-6 py-4 text-right space-x-2">
            <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg"><Edit className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </td>
        </tr>
      ))}
    </>
  );
}
