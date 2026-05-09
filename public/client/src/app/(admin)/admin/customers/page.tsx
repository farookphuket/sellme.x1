"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Pagination from '@/components/Pagination';
import CustomerFormModal from '@/components/CustomerFormModal';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Trash2, Edit, Plus, UserPlus, Hotel, Hash } from 'lucide-react';

export default function CustomerManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch Data with Pagination
  const getCustomers = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/customers?page=${page}`);
      // Handle Laravel pagination response
      if (res.data.data) {
        setCustomers(res.data.data);
        setTotalPages(res.data.last_page || 1);
      } else {
        setCustomers(res.data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers(currentPage);
  }, [currentPage]);

  // 2. Create or Update
  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingData?.id) {
        await api.put(`/customers/${editingData.id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setIsModalOpen(false);
      setEditingData(null);
      getCustomers(currentPage);
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Delete
  const handleDelete = async (id: number) => {
    if (confirm('ยืนยันการลบลูกค้ารายนี้?')) {
      try {
        await api.delete(`/customers/${id}`);
        getCustomers(currentPage);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  // 4. Handle pagination
  const handlePageChange = (page: number) => {
    router.push(`${pathname}?page=${page}`);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <button
          onClick={() => { setEditingData(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center gap-2 transition-all shadow-lg font-bold"
        >
          <Plus className="w-5 h-5" /> New Customer
        </button>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-20 text-blue-600 font-bold">กำลังโหลดข้อมูล...</div>
        ) : customers.length === 0 ? (
          <div className="flex justify-center p-20 text-gray-500">ไม่มีข้อมูลลูกค้า</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Full Name (Nick)</th>
                <th className="px-6 py-4">e-mail</th>
                <th className="px-6 py-4">Hotel Info</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c: any) => (
                <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{c.name} - {c.last_name}</div>
                    {c.nick_name && <div className="text-sm text-blue-500">"{c.nick_name}"</div>}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-sm text-blue-500">{c.email} </div>

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
                    <button onClick={() => { setEditingData(c); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            lastPage={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* --- Customer Form Modal --- */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingData(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingData}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
