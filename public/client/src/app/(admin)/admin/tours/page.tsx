"use client"; import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { getCookie, setCookie } from 'cookies-next';


import dynamic from 'next/dynamic';
const TourDetailView = dynamic(
  () => import('@/components/TourDetailView').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110]" /> // ใส่ตัวโหลดกันหน้าจอกระตุก
  }
);

import TourListTable from '@/components/TourListTable';
import TourModal from '@/components/TourModal';

export default function TourManagement() {
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

const [isPreviewOpen, setIsPreviewOpen] = useState(false);
const [tourToShow, setTourToShow] = useState(null);

  // ควบคุม Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    const lastPage = getCookie('last_tour_page');
    const pageToLoad = lastPage ? parseInt(lastPage as string) : 1;
    fetchTours(pageToLoad);
  }, []);


    /*

const fetchTours = async (page: number) => {
    console.log("Starting fetch for page:", page); // DEBUG 1
    setIsLoading(true);

    try {
      // ลองเรียก Path แบบเต็ม (Absolute Path) เพื่อตัดปัญหาเรื่อง BaseURL
      // ถ้าพี่ตั้ง axios.defaults.baseURL ไว้แล้ว ให้ใช้ `/tours?page=${page}`
      const response = await api.get(`/tours`, {
        params: { page: page }
      });

      console.log("API Response:", response.data); // DEBUG 2: ดูว่าข้อมูลหน้าตาเป็นไง

      const res = response.data;

      // กรณีโครงสร้าง Laravel มาตรฐาน (Paginated)
      // ข้อมูลจะอยู่ที่ res.data และมี meta หรือ pagination keys
      if (res && res.data) {
                //console.log("API if",res);
        setTours(res.data);
        setPagination({
          current_page: res.current_page || res.meta?.current_page || page,
          last_page: res.last_page || res.meta?.last_page || 1,
          total: res.total || res.meta?.total || 0
        });
      }
      // กรณีส่งมาเป็น Array ตรงๆ (ไม่ได้ใช้ Paginate ใน Laravel)
      else if (Array.isArray(res)) {
        setTours(res);
        setPagination({ current_page: 1, last_page: 1, total: res.length });
      } else {
        console.error("Unknown Data Format:", res);
        setTours([]);
      }

      setCookie('last_tour_page', page.toString(), { maxAge: 60 * 60 * 24 });

    } catch (error: any) {
      console.error("Fetch error details:", error.response || error); // DEBUG 3
      setTours([]);
      // แจ้งเตือนพี่ว่าติดเรื่องอะไร
      if (error.code === 'ERR_NETWORK') {
        alert("เชื่อมต่อ Server ไม่ได้ครับพี่ (เช็คว่ารัน Laravel หรือยัง?)");
      }
    } finally {
      console.log("Fetch finished, stopping loading..."); // DEBUG 4
      setIsLoading(false);
    }
  };
*/

const fetchTours = async (page: number) => {
  setIsLoading(true);
  try {
    // ระบุให้ชัดเจนว่าเป็น /api/tours หรือเปล่า?
    // ถ้า axios baseURL พี่เซ็ตไว้ที่ /api แล้ว ก็ใช้ /tours ถูกต้องครับ
    const response = await api.get(`/tours`, {
      params: { page: page }
    });

    const res = response.data;

    // สำคัญ: เช็คโครงสร้างข้อมูล Laravel Pagination
    // ปกติจะเป็น { current_page: 1, data: [...], last_page: 20 }
    if (res && res.data) {
      setTours(res.data);
      setPagination({
        current_page: res.pagination.current_page,
        last_page: res.pagination.last_page,
        total: res.pagination.total
      });
    } else {
      setTours(res || []);
    }

            /*
    setCookie('last_tour_page', page.toString());
    */
setCookie('last_tour_page', page.toString(), { maxAge: 60 * 60 * 24 });
  } catch (error: any) {
    console.error("ตรวจสอบ Error ตรงนี้ครับพี่ ->", error.response?.status);
    if(error.response?.status === 404) {
      console.error("หา API Path นี้ไม่เจอ: ตรวจสอบ Route ใน Laravel ครับ");
    }
  } finally {
    setIsLoading(false);
  }
};



const handleView = (tour) => {
  setTourToShow(tour);
  setIsPreviewOpen(true);
};


  // ฟังก์ชันเปิด Modal สำหรับเพิ่มใหม่
  const handleCreate = () => {
    setSelectedTour(null); // ล้างข้อมูลเดิม
    setIsModalOpen(true);
  };

  // ฟังก์ชันเปิด Modal สำหรับแก้ไข
  const handleEdit = (tour: any) => {
    setSelectedTour(tour); // ใส่ข้อมูลทัวร์ที่จะแก้
    setIsModalOpen(true);
  };

  // ฟังก์ชันบันทึกข้อมูล (ทั้ง Create และ Update)
  const handleSubmit = async (formData: any) => {
    try {
      if (selectedTour) {
        // โหมดแก้ไข: ใช้ PUT/PATCH
        await api.put(`/tours/${selectedTour.id}`, formData);
      } else {
        // โหมดเพิ่มใหม่: ใช้ POST
        await api.post('/tours', formData);
      }
      setIsModalOpen(false); // ปิด Modal
      fetchTours(pagination.current_page); // รีโหลดข้อมูลหน้าปัจจุบัน
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (id: number) => {
    if (confirm("ยืนยันการลบรายการทัวร์นี้?")) {
      try {
        await api.delete(`/tours/${id}`);
        fetchTours(pagination.current_page);
      } catch (error) {
        alert("ไม่สามารถลบข้อมูลได้");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== pagination.current_page) {
      fetchTours(newPage);
    }
  };

  return (
<div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-blue-900">จัดการรายการทัวร์</h1>
        <button
          onClick={() => { setSelectedTour(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all"
        >
          + เพิ่มทัวร์ใหม่
        </button>
      </div>

      {/* ตรวจสอบสถานะการแสดงผล */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black text-blue-900">กำลังดึงข้อมูลจาก Server...</p>
        </div>
      ) : tours.length > 0 ? (
        <TourListTable
          tours={tours}
          pagination={pagination}
          onPageChange={(page) => fetchTours(page)}
onView={handleView}
          onEdit={(tour) => { setSelectedTour(tour); setIsModalOpen(true); }}
          onDelete={async (id) => {
             if(confirm('ลบไหมครับ?')) {
               await api.delete(`/tours/${id}`);
               fetchTours(pagination.current_page);
             }
          }}
        />
      ) : (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold text-xl">ไม่พบข้อมูลทัวร์ในระบบ</p>
          <button onClick={() => fetchTours(1)} className="mt-4 text-blue-600 underline">ลองโหลดใหม่อีกครั้ง</button>
        </div>
      )}

<TourDetailView
  isOpen={isPreviewOpen}
  onClose={() => setIsPreviewOpen(false)}
  tour={tourToShow}
/>


      <TourModal
        isOpen={isModalOpen}
        initialData={selectedTour}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          if (selectedTour) await api.put(`/tours/${selectedTour.id}`, data);
          else await api.post('/tours', data);
          setIsModalOpen(false);
          fetchTours(pagination.current_page);
        }}
      />
    </div>

  );
}
