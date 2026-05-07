import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null; // ถ้ามีหน้าเดียวไม่ต้องโชว์

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      if (
        i === 1 ||
        i === lastPage ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    // กำจัดค่าซ้ำที่เกิดจากเงื่อนไข
    return [...new Set(pages)];
  };

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white transition-all font-bold"
      >
        <ChevronLeft size={18} /> ก่อนหน้า
      </button>

      {/* เลขหน้า */}
      <div className="flex gap-2 mx-2">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl font-black transition-all ${
                currentPage === page
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="w-10 h-10 flex items-center justify-center text-slate-300 font-bold">
              {page}
            </span>
          )
        ))}
      </div>

      {/* ปุ่มถัดไป */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="flex items-center gap-1 px-4 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white transition-all font-bold"
      >
        ถัดไป <ChevronRight size={18} />
      </button>
    </div>
  );
}
