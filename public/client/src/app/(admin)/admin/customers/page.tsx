"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Trash2, Edit, Plus, UserPlus, Hotel, Hash } from 'lucide-react';

export default function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', last_name: '', nick_name: '', hotel: '', room_number: '' });
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // 1. Fetch Data
  const getCustomers = async () => {
    const res = await api.get('/customers');
    setCustomers(res.data);
  };

  useEffect(() => { getCustomers(); }, []);

  // 2. Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await api.put(`/customers/${isEditing}`, formData);
    } else {
      await api.post('/customers', formData);
    }
    setFormData({ name: '', last_name: '', nick_name: '', hotel: '', room_number: '' });
    setIsEditing(null);
    getCustomers();
  };

  // 3. Delete
  const handleDelete = async (id: number) => {
    if (confirm('ยืนยันการลบลูกค้ารายนี้?')) {
      await api.delete(`/customers/${id}`);
      getCustomers();
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
      </div>

      {/* --- Form Section --- */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border p-2 rounded-lg text-sm" required />
        <input type="text" placeholder="Last Name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="border p-2 rounded-lg text-sm" required />
        <input type="text" placeholder="Nickname" value={formData.nick_name} onChange={e => setFormData({...formData, nick_name: e.target.value})} className="border p-2 rounded-lg text-sm" />
        <input type="text" placeholder="Hotel" value={formData.hotel} onChange={e => setFormData({...formData, hotel: e.target.value})} className="border p-2 rounded-lg text-sm" required />
        <input type="text" placeholder="Room" value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} className="border p-2 rounded-lg text-sm" required />

        <button type="submit" className="md:col-span-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isEditing ? 'Update Customer' : 'Add New Customer'}
        </button>
      </form>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Full Name (Nick)</th>
              <th className="px-6 py-4">Hotel Info</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c: any) => (
              <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{c.name} {c.last_name}</div>
                  {c.nick_name && <div className="text-xs text-blue-500">"{c.nick_name}"</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hotel className="w-4 h-4 text-gray-400" /> {c.hotel}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Hash className="w-3 h-3" /> Room: {c.room_number}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setIsEditing(c.id); setFormData(c); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
