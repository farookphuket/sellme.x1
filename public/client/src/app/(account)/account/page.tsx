"use client";
import React, { useState } from 'react';
import {
  Users, DollarSign, FileText, ClipboardList,
  Search, Download, Plus, MoreVertical, CheckCircle, AlertTriangle
} from 'lucide-react';

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'agents'>('payments');

  return (
    <div className="space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header with Title & Quick Actions */}
      <div className="flex justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Finance Portal</h1>
          <p className="text-gray-500 mt-1">Thaitan Travel Co., Ltd. • Account Department</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-5 py-3 rounded-xl text-sm font-semibold transition-all">
            <Plus className="w-4 h-4" />
            Issue New Invoice
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/10">
            <Download className="w-4 h-4" />
            Generate Monthly Report
          </button>
        </div>
      </div>

      {/* 1. Key Statistics for Tour Business */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Confirmed Revenue" value="฿2,850,000" change="+12.5% vs last month" icon={<DollarSign />} color="bg-blue-600" />
        <StatCard title="Outstanding Invoices" value="18" change="฿320,000 (Overdue: ฿80k)" icon={<FileText />} color="bg-purple-600" />
        <StatCard title="Partner Commission Due" value="฿95,500" change="To be paid by end of week" icon={<ClipboardList />} color="bg-orange-500" />
        <StatCard title="Total Agents" value="45" change="5 new active agents this month" icon={<Users />} color="bg-emerald-500" />
      </div>

      {/* 2. Main Work Area: Tour-specific Management */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {/* Tab Switcher - Optimized for Clarity */}
        <div className="flex border-b border-gray-100 bg-gray-50/20 px-3 pt-3">
          {[
            { key: 'payments', label: 'Inbound Payments' },
            { key: 'invoices', label: 'Overdue Invoices' },
            { key: 'agents', label: 'Agency Commissions' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-4 font-semibold text-sm transition-all rounded-t-xl ${
                activeTab === tab.key
                ? 'bg-white text-blue-700 border-t border-r border-l border-gray-100 shadow-[0_1px_15px_rgba(0,0,0,0.02)]'
                : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Bar (Search & Export) */}
        <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Agent ID, Ref No., Tour Code..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Download className="w-4 h-4" />
            Export to Excel (XLSX)
          </button>
        </div>

        {/* Table Content - Focus on Agent Commission for now */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Tour Code</th>
                <th className="px-6 py-4">Agency / Customer</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Commission %</th>
                <th className="px-6 py-4">Due Commission</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* ตัวอย่างข้อมูลสำหรับ Inbound Payments / Commissions */}
              <CommissionRows />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({ title, value, change, icon, color }: any) {
  return (
    <div className="bg-white border border-gray-100 p-7 rounded-3xl flex items-center gap-5 shadow-sm shadow-gray-100">
      <div className={`p-4 rounded-2xl ${color} text-white`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-xs uppercase font-bold tracking-tight">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 mt-0.5">{value}</h3>
        <p className={`text-xs mt-1.5 ${change.includes('Overdue') ? 'text-red-500' : 'text-gray-500'}`}>{change}</p>
      </div>
    </div>
  );
}

function CommissionRows() {
  const data = [
    { tour: 'PHU123', name: 'Happy Travels Agency', total: '฿25,000', comPercent: '10%', due: '฿2,500', status: 'Pending Payment', id: 1 },
    { tour: 'CM456', name: 'Smile Tours Co.', total: '฿18,000', comPercent: '12%', due: '฿2,160', status: 'Ready to Pay', id: 2 },
    { tour: 'BKK789', name: 'Somchai Jaidee (FIT)', total: '฿15,000', comPercent: 'N/A', due: '฿0', status: 'Paid', id: 3 },
  ];
  return (
    <>
      {data.map(item => (
        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
          <td className="px-6 py-5 font-bold text-blue-700">{item.tour}</td>
          <td className="px-6 py-5">
            <div className="font-semibold text-gray-900">{item.name}</div>
            <div className="text-xs text-gray-500">Invoice: INV-202300{item.id}</div>
          </td>
          <td className="px-6 py-5 font-medium text-gray-900">{item.total}</td>
          <td className="px-6 py-5 text-gray-500">{item.comPercent}</td>
          <td className="px-6 py-5 font-bold text-gray-900">{item.due}</td>
          <td className="px-6 py-5">
            <span className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${
              item.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
              item.status === 'Ready to Pay' ? 'bg-purple-50 text-purple-700' :
              'bg-orange-50 text-orange-700'
            }`}>
              {item.status}
            </span>
          </td>
          <td className="px-6 py-5 text-right">
            <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg"><MoreVertical className="w-5 h-5" /></button>
          </td>
        </tr>
      ))}
    </>
  );
}
