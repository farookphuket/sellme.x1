"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, Edit3, Trash2, Eye } from 'lucide-react';

interface PaginationData {
  current_page: number;
  last_page: number;
  total: number;
}

interface Props {
  tours: any[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
onView: (tour: any) => void;
  onEdit: (tour: any) => void;
  onDelete: (id: number) => void;
}

export default function TourListTable({ tours, pagination, onPageChange,onView, onEdit, onDelete }: Props) {
  // Logic สำหรับสร้างเลขหน้าแบบย่อ (เช่น 1, 2, 3 ... 10)
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pagination.last_page; i++) {
      if (
        i === 1 ||
        i === pagination.last_page ||
        (i >= pagination.current_page - 1 && i <= pagination.current_page + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              pagination.current_page === i
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === pagination.current_page - 2 || i === pagination.current_page + 2) {
        pages.push(<span key={i} className="px-2 text-gray-400">...</span>);
      }
    }
    return pages;
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">รายการทัวร์</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">ราคา</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={tour.image} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <h3 className="font-bold text-blue-900 group-hover:text-blue-600 transition-colors line-clamp-1">{tour.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">ID: {tour.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 font-black text-blue-900">
                  ฿{Number(tour.price).toLocaleString()}
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
{/* 2. เชื่อมต่อปุ่ม "ดู" เข้ากับ onView */}
            <button
              onClick={() => onView(tour)}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl"
            >
              ดูรายละเอียด
            </button>
                    <button onClick={() => onEdit(tour)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => onDelete(tour.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <p className="text-sm font-bold text-gray-400">
          ทั้งหมด <span className="text-blue-900">{pagination.total}</span> รายการ
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={pagination.current_page === 1}
            onClick={() => onPageChange(pagination.current_page - 1)}
            className="p-3 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {renderPageNumbers()}
          </div>

          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => onPageChange(pagination.current_page + 1)}
            className="p-3 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
