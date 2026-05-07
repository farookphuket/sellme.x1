"use client";
import React, { useState, useEffect } from 'react';
// เพิ่ม useRouter, usePathname และ useSearchParams ให้ครบครับ
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '@/lib/axios';
import { Search, MapPin, Compass } from 'lucide-react';

import Pagination from '@/components/Pagination';

const TourDetailView = dynamic(
  () => import('@/components/TourDetailView').then((mod) => mod.default),
  { ssr: false }
);

export default function CustomerTourPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastPage, setLastPage] = useState(1);

  // อ่านหน้าปัจจุบันจาก URL
  const currentPage = Number(searchParams.get('page')) || 1;

// 1. อ่านค่าจาก URL เป็นลำดับแรก
  const queryPage = searchParams.get('page');


    /*
  useEffect(() => {
    fetchTours(currentPage);
    // เมื่อเปลี่ยนหน้า ให้เลื่อนจอกลับไปด้านบนสุด (Optional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  */

useEffect(() => {
    // 2. Logic การจดจำหน้าล่าสุด
    if (!queryPage) {
      // ถ้าเปิดเข้ามาแบบไม่มี ?page= ให้ไปเช็คใน localStorage
      const savedPage = localStorage.getItem('last_tour_page');
      if (savedPage) {
        router.replace(`${pathname}?page=${savedPage}`);
        return; // ให้ useEffect ทำงานอีกรอบหลังจาก URL เปลี่ยน
      }
    } else {
      // ถ้ามี ?page= ใน URL แล้ว ให้บันทึกลง localStorage ไว้กันลืม
      localStorage.setItem('last_tour_page', queryPage);
    }

    const currentPage = Number(queryPage) || 1;
    fetchTours(currentPage);
  }, [queryPage]); // ทำงานทุกครั้งที่ queryPage เปลี่ยน


/*
  const fetchTours = async (page: number) => {
    setLoading(true);
    try {
      // ต้องส่ง ?page= ไปด้วยเพื่อให้ Laravel รู้ว่าจะเอาข้อมูลหน้าไหนครับ
      const response = await api.get(`/tours?page=${page}`);

      // ดึงตามโครงสร้าง return response()->json([ 'data' => ..., 'pagination' => ... ])
      if (response.data.success) {
        setTours(response.data.data);
        setLastPage(response.data.pagination.last_page);
      }
    } catch (error) {
      console.error("Error:", error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  */
const fetchTours = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/tours?page=${page}`);
      if (response.data.success) {
        setTours(response.data.data);
        setLastPage(response.data.pagination.last_page);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

    /*
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  */
const handlePageChange = (newPage: number) => {
    // บันทึกหน้าใหม่ลง Storage ทันทีที่คลิกเปลี่ยนหน้า
    localStorage.setItem('last_tour_page', newPage.toString());

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleViewDetail = (tour: any) => {
    setSelectedTour(tour);
    setIsDetailOpen(true);
  };

  const filteredTours = Array.isArray(tours)
    ? tours.filter((t: any) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-10">

      {/* --- Header & Search Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Compass size={20} className="animate-spin-slow" />
            <span className="uppercase tracking-[0.3em] text-xs">Explore New Places</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-tight">
            ค้นหาโปรแกรม <br />
            <span className="text-blue-600">ทัวร์สุดพิเศษ</span>
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาจุดหมาย หรือชื่อทัวร์..."
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- Tour Grid --- */}
      <div className="px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[450px] bg-white rounded-[3rem] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.length > 0 ? (
                filteredTours.map((tour: any) => (
                  <div
                    key={tour.id}
                    className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={tour.title}
                      />
                      <div className="absolute top-6 right-6">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-blue-600 font-black text-sm shadow-xl">
                          ฿{Number(tour.price).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 space-y-4">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                        <MapPin size={14} className="text-blue-500" />
                        <span>PHUKET, THAILAND</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 leading-snug h-14 line-clamp-2">
                        {tour.title}
                      </h3>
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="text-slate-400 text-sm font-medium">รายคน</div>
                        <button
                          onClick={() => handleViewDetail(tour)}
                          className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                        >
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-slate-400 font-bold">
                  ไม่พบข้อมูลทัวร์ที่ท่านค้นหา
                </div>
              )}
            </div>

            {/* ส่วน Pagination - โชว์ด้านล่างของ Grid ข้อมูล */}
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <TourDetailView
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        tour={selectedTour}
      />
    </div>
  );
}
