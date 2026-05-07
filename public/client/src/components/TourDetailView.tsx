"use client";
import React, { useState,useEffect } from 'react';
import CustomerBookingTourFormModal from '@/components/CustomerBookingTourFormModal';
import { X, Calendar, Coins, MapPin, Clock, CheckCircle2, ShieldCheck, Map } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tour: any; // ข้อมูลทัวร์ที่ส่งมาจากหน้า Management
}

export default function TourDetailView({ isOpen, onClose, tour }: Props) {
    // สร้าง state สำหรับเปิด/ปิด Modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [allTours, setAllTours] = useState([]);


  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // ตัวอย่างถ้าพี่เก็บ token ไว้ใน localStorage
    const token = localStorage.getItem('token');

  const tourOptions = [tour, ...allTours.filter((item: any) => item.id !== tour.id)];

  useEffect(() => {
    // สมมติว่าพี่มี Route ใน Laravel ที่ส่งทัวร์ทั้งหมดออกมา
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => setAllTours(data));
  }, []);

  // ถ้าไม่ได้เปิด Modal หรือไม่มีข้อมูลทัวร์ ไม่ต้องแสดงอะไร
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">

      {/*ปุ่มปิดแบบลอย (Floating Close Button) */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[120] p-4 bg-white hover:bg-red-500 hover:text-white text-slate-900 rounded-2xl shadow-2xl transition-all active:scale-95 group"
      >
        <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Main Container: กว้าง 85% สูง 90% ของจอ */}
      <div className="bg-white w-[85%] max-w-[1500px] h-[90vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">

        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">

          {/* --- Section 1: Hero Banner --- */}
          <div className="relative h-[50vh] w-full bg-slate-200">
            <img
              src={tour.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex items-end">
              <div className="p-12 w-full max-w-6xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-xs font-black tracking-[0.2em] uppercase shadow-lg shadow-blue-600/50">
                    Premium Package
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-xs font-bold uppercase border border-white/20">
                    Verified Tour
                  </span>
                </div>

                <h1 className="text-6xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
                  {tour.title}
                </h1>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 text-white">
                    <div className="p-2 bg-yellow-400 rounded-xl text-slate-900">
                      <Coins size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest">ราคาเริ่มต้น</p>
                      <p className="text-2xl font-black">{Number(tour.price).toLocaleString()} <span className="text-sm font-medium">บาท</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 text-white">
                    <div className="p-2 bg-blue-500 rounded-xl text-white">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest">ระยะเวลา</p>
                      <p className="text-xl font-black">3 วัน 2 คืน</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 text-white">
                    <div className="p-2 bg-rose-500 rounded-xl text-white">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest">จุดหมายปลายทาง</p>
                      <p className="text-xl font-black">ภูเก็ต - พังงา</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Section 2: Details Content --- */}
          <div className="p-16 grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* ฝั่งซ้าย (8/12): รายละเอียดที่เขียนจาก Editor */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-3 h-12 bg-blue-600 rounded-full shadow-lg shadow-blue-200"></div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">รายละเอียดโปรแกรมทัวร์</h2>
              </div>

              {/* การแสดงผล HTML จากฟิลด์ description */}
              <div
                className="prose prose-xl max-w-none text-slate-600 leading-relaxed
                  prose-headings:text-blue-900 prose-headings:font-black
                  prose-p:text-slate-600 prose-p:leading-extra-relaxed
                  prose-strong:text-slate-900 prose-strong:font-black
                  prose-ul:list-disc prose-ul:pl-6
                  prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:my-10"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </div>

            {/* ฝั่งขวา (4/12): Side Card ข้อมูลเสริม */}
            <div className="lg:col-span-4 space-y-10">

              {/* Card: สิ่งที่รวมในทัวร์ */}
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <ShieldCheck className="text-green-600" size={28} />
                  สิ่งที่รวมในทัวร์
                </h3>
                <ul className="space-y-6">
                  {[
                    "ประกันอุบัติเหตุวงเงิน 1,000,000 บาท",
                    "มัคคุเทศก์มืออาชีพดูแลตลอดการเดินทาง",
                    "อาหารครบทุกมื้อตามที่ระบุในรายการ",
                    "รถรับ-ส่ง แบบส่วนตัวจากสนามบิน",
                    "อุปกรณ์ดำน้ำและเสื้อชูชีพคุณภาพสูง"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 text-slate-600 font-bold">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card: การเตรียมตัว */}
              <div className="bg-blue-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <Map className="text-blue-300" size={28} />
                    ข้อแนะนำ
                  </h3>
                  <p className="text-blue-100/80 font-medium leading-relaxed mb-8">
                    ควรเตรียมชุดว่ายน้ำ, ครีมกันแดด และกล้องถ่ายรูปมาให้พร้อม เพื่อประสบการณ์ที่ดีที่สุด
                  </p>
                  <button
                        onClick={() => setIsBookingOpen(true)}
                        className="w-full bg-white text-blue-900 py-5 rounded-2xl text-xl font-black hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                    จองทัวร์นี้
                  </button>
                </div>
                {/* Background Decor */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-800 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>

          </div>
        </div>
      </div>

{/* เรียกใช้ Modal ด้านล่างสุดของไฟล์ */}
      <CustomerBookingTourFormModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={async (bookingData) => {
          // ส่งข้อมูลการจองไปยัง Backend
          try {
            const response = await fetch(`${apiUrl}/bookings`, {
              method: 'POST',
              headers: {
                     'Content-Type': 'application/json' ,
                     'Accept': 'application/json', // เพิ่มบรรทัดนี้เพื่อให้ Laravel รู้ว่าเราต้องการ JSON
                     'Authorization': `Bearer ${token}` // ต้องเพิ่มบรรทัดนี้ครับ
                  },
              body: JSON.stringify(bookingData)
            });
            if (response.ok) {
              alert('ยืนยันการจองสำเร็จ!');
              setIsBookingOpen(false);
            }
          } catch (error) {
            console.error('Booking error:', error);
            alert('เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
          }
        }}
        preSelectedTourId={tour?.id}
        tours={tourOptions}
      />
    </div>
  );
}
