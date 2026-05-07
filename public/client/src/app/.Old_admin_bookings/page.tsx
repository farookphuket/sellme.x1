"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import {
  Plus, Edit, Trash2, X, Save,
  Calendar, MapPin, Wallet, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, User, Hotel, DoorOpen, Ticket
} from 'lucide-react';

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [tourOptions, setTourOptions] = useState<any[]>([]); // สำหรับเก็บรายการทัวร์ใน Select
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isRestored, setIsRestored] = useState(false);
  const [messages, setMessages] = useState<{ type: 'error' | 'success', text: string } | null>(null);

// สร้างสตริงวันที่ปัจจุบัน (รูปแบบ 2026-05-03 เป็นต้น)
const today = new Date().toISOString().split('T')[0];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const initialForm = {
    name: '',
    last_name: '',
    nick_name: '',

price_per_pax: 0, // ราคาต่อคน
  total_pax: 1,      // จำนวนลูกค้า
  pay_deposit: 0,    // ยอดมัดจำ (จะถูกคำนวณ)

    hotel: '',
    room_number: '',
    tour_id: '',
    pay_method: 'cash',
    paid_status: 'pending',
    pay_on_arrival: false,
    pay_deposit: 0,
    pickup_at: '',
    date_departure: '',
    date_confirmed: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
const total = (Number(formData.price_per_pax) || 0) * (Number(formData.total_pax) || 0);
  // ตัวอย่าง: ตั้งค่ามัดจำเป็นยอดรวมทั้งหมด (หรือจะหาร 2 ตามนโยบายบริษัท)
  if (!isEditing) { // คำนวณเฉพาะตอนสร้างใหม่ ไม่ให้ทับค่าเดิมตอนแก้ไข
     setFormData(prev => ({ ...prev, pay_deposit: total }));
  }
    fetchBookings();
    checkDraft();
  }, [formData.price_per_pax, formData.total_pax]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      // Backend ของคุณส่งมาแบบ ['bookings' => $bookings, 'tours' => $tours]
      setBookings(res.data.bookings || []);
      setTourOptions(res.data.tours || []);
    } catch (err) { console.error("Fetch error", err); }
    setLoading(false);
  };

  const checkDraft = () => {
    const savedDraft = getCookie('booking_form_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft as string);
        setFormData(parsed.data);
        setIsEditing(parsed.isEditing);
        setIsOpen(true);
        setIsRestored(true);
      } catch (e) { console.error("Draft error", e); }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };

// เพิ่ม Logic พิเศษเมื่อมีการเปลี่ยน Tour
  if (field === 'tour_id' && value !== '') {
    // ค้นหาข้อมูลทัวร์ที่เลือกว่ามี ID ตรงกับที่เลือกไหม
    const selectedTour = tourOptions.find((tour: any) => tour.id.toString() === value.toString());

    if (selectedTour) {
      // ถ้านามสกุลฟิลด์ใน DB คือ price ให้นำมาใส่ใน price_per_pax
      newData.price_per_pax = selectedTour.price || 0;
    }
  }
    setFormData(newData);
    setCookie('booking_form_draft', JSON.stringify({ data: newData, isEditing }), { maxAge: 3600 });
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsEditing(null);
    setFormData(initialForm);
    setIsRestored(false);
    setMessages(null);
    deleteCookie('booking_form_draft');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(null);
    try {
      if (isEditing) {
        await api.put(`/bookings/${isEditing}`, formData);
      } else {
        await api.post('/bookings', formData);
      }
      setMessages({ type: 'success', text: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
      setTimeout(() => {
        handleCloseModal();
        fetchBookings();
      }, 1500);
    } catch (err: any) {
      setMessages({ type: 'error', text: err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก' });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(bookings) ? bookings.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header และ Table เหมือนเดิมที่คุณมีอยู่ */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Booking Management</h1>
          <p className="text-gray-500 mt-1">จัดการรายการจองและข้อมูลลูกค้า</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200 font-bold"
        >
          <Plus className="w-5 h-5" /> New Booking
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-blue-50 overflow-hidden shadow-sm shadow-blue-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 text-blue-900 text-xs uppercase font-bold tracking-widest border-b border-blue-100">
                <th className="px-6 py-5">Customer / Tour</th>
                <th className="px-6 py-5">Departure</th>
                <th className="px-6 py-5">Method</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Deposit</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((booking: any) => (
                <tr key={booking.id} className={`group transition-colors ${booking.paid_status === 'pending' ? 'bg-amber-50/40 hover:bg-amber-50/80' : 'hover:bg-blue-50/30'}`}>
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-900">{booking.customer?.name} {booking.customer?.last_name}</div>
                    <div className="text-xs text-blue-600 font-medium">{booking.tour?.name}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600 font-medium">{new Date(booking.date_departure).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-sm uppercase font-bold text-gray-400">{booking.pay_method}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${booking.paid_status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                      {booking.paid_status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono font-bold text-gray-700">฿{Number(booking.pay_deposit).toLocaleString()}</td>
                  <td className="px-6 py-5 text-center">
                    <button onClick={() => { setIsEditing(booking.id); setFormData(booking); setIsOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


{/* --- BOOKING MODAL (80% WIDTH) --- */}
{isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-blue-900/20 backdrop-blur-md animate-fade-in">
    <div className="bg-white w-full max-w-[80%] h-fit max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white animate-scale-up">

      {/* Modal Header */}
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
        <div>
          <h2 className="text-2xl font-black text-blue-900">{isEditing ? 'แก้ไขข้อมูลการจอง' : 'สร้างการจองใหม่'}</h2>
          {isRestored && <p className="text-amber-600 text-[10px] font-bold flex items-center gap-1 mt-1 animate-bounce"><AlertCircle className="w-3 h-3"/> ข้อมูลร่างถูกกู้คืนอัตโนมัติ</p>}
        </div>
        <button onClick={handleCloseModal} className="p-3 hover:bg-red-50 text-gray-400 rounded-2xl transition-all"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">

                            {/*

อยากให้ฟอร์มเป็นแบบ 4 step ดังนี้

หากมีการกรอกข้อมูลใดๆ ในฟอ์มแล้วให้เก็บค่าตัวแปรเอาไว้ หากเกิดการผิดพลาดหรือมีการ refresh page โดยไม่ได้ตั้งใจให้เอาข้อมูลนั้นๆ ที่ยังไม่ได้บันทึกกลับมา


หน้าแรกมีฟิลด์ ให้เลือกทัวร์ เมื่อเลือก ทัวร์ก็ให้แสดง ผลลัพธ์ที่เลือก เช่น tour.title tour.price
ให้กรอกจำนวนคน 1-40 เมื่อเลือกจำนวนคนแล้วให้เอา tour.price มาคูณกับจำนวนคน แล้วเก็บค่าไว้ในตัวแปร
total_price

หากไม่ระบุก็จะไม่สามารถกดไปหน้าต่อไปได้

หน้าที่สอง เป็นวิธีชำระเงิน  ให้แสดงเป็น radio box เลือกได้แค่อย่างเดียว เช่น
 จ่ายเงินสด
 จ่ายกับการ์ด(ถ้าจ่ายผ่านบัตรเครดิตลูกค้าต้องเสียค่าธรรมเนียม 4%+total_price )
 จ่ายมัดจำ โดยเอาจำนวนที่จ่ายมัดจำไปลบกับจำนวน  total_pricerice
 จากนั้นเก็บตัวแปรไว้ใน text box ชื่อ must_pay_on_departure

หน้าที่ สาม
ชื่อ ชื่อเล่น นามสกุล  โรงแรม เบอร์ห้อง สถานที่รับ
หากไม่ระบุก็จะไม่สามารถกดไปหน้าต่อไปได้


หน้าที่ สี่
สรุปรายการที่ลูกค้ากรอกทั้งหมดเป็นแบบสองคอลัมม์ เน้นอ่านง่ายๆ ข้อมูลชัดเจน
มีช่องให้เลือกว่า ข้อมูลถูกต้องก่อนที่จะกดปุ่ม confirm booking ซึ่งหากไม่เลือกช่องนี้ก็จะไม่สามารถกด ปุ่ม confirm booking ได้


                            */}



        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* ฝั่งซ้าย: ข้อมูลลูกค้า (Customer Profile) */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4"/> ข้อมูลลูกค้าและที่พัก
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">First Name</label>
                <input type="text" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-medium" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Last Name</label>
                <input type="text" value={formData.last_name || ''} onChange={(e) => handleInputChange('last_name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-medium" required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Nickname</label>
                <input type="text" value={formData.nick_name || ''} onChange={(e) => handleInputChange('nick_name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="relative">
                <Hotel className="absolute left-4 top-3.5 w-5 h-5 text-blue-300" />
                <input type="text" value={formData.hotel || ''} onChange={(e) => handleInputChange('hotel', e.target.value)} placeholder="โรงแรมที่พัก" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-medium" />
              </div>
              <div className="relative">
                <DoorOpen className="absolute left-4 top-3.5 w-5 h-5 text-blue-300" />
                <input type="text" value={formData.room_number || ''} onChange={(e) => handleInputChange('room_number', e.target.value)} placeholder="เลขห้อง" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-medium" />
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: ข้อมูลทัวร์และการเดินทาง (Tour Details) */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Ticket className="w-4 h-4"/> รายละเอียดการเดินทาง
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">เลือกโปรแกรมทัวร์</label>
              <select value={formData.tour_id || ''} onChange={(e) => handleInputChange('tour_id', e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-bold text-blue-900 appearance-none" required>
                <option value="">-- เลือกทัวร์ --</option>
                {tourOptions.map((tour: any) => (
                  <option key={tour.id} value={tour.id}>
{/* เช็คความยาวถ้าเกิน 60 ให้ตัดแล้วต่อด้วย ... */}
        {tour.title.length > 60
          ? `${tour.title.substring(0, 60)} ...`
          : tour.title
        }
                                                </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">วันเดินทาง</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3 w-5 h-5 text-blue-400" />
                  <input type="date" value={formData.date_departure || ''}   min={today} onChange={(e) => handleInputChange('date_departure', e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-medium" required />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">สถานที่นัดรับ (Pickup Point)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-blue-400" />
                <input type="text" value={formData.pickup_at || ''} onChange={(e) => handleInputChange('pickup_at', e.target.value)} placeholder="ระบุสถานที่นัดรับลูกค้า" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* --- ส่วนสรุปราคาและการชำระเงิน (ด้านล่าง) --- */}
        <div className="mt-12 p-8 bg-blue-900 rounded-[2.5rem] shadow-xl shadow-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">

            {/* ช่องราคาต่อคน */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1">Price / Person</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-blue-400 font-bold">฿</span>
                <input type="number" value={formData.price_per_pax || ''} onChange={(e) => handleInputChange('price_per_pax', e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/20 text-white rounded-2xl outline-none focus:border-white transition-all font-bold text-xl" placeholder="0.00" />
              </div>
            </div>

            {/* ช่องจำนวนคน */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1">Total Pax</label>
              <select value={formData.total_pax || 1} onChange={(e) => handleInputChange('total_pax', e.target.value)} className="w-full px-4 py-3.5 bg-white/10 border border-white/20 text-white rounded-2xl outline-none focus:border-white transition-all font-bold text-xl appearance-none">
                {[...Array(20)].map((_, i) => (
                  <option key={i+1} value={i+1} className="text-blue-900">{i+1} Persons</option>
                ))}
              </select>
            </div>

            {/* แสดงราคาเต็ม (Grand Total) */}
            <div className="bg-white/10 p-5 rounded-[1.5rem] border border-white/10 text-center">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Grand Total</p>
              <p className="text-3xl font-black text-white leading-none mt-1">
                ฿{((Number(formData.price_per_pax) || 0) * (Number(formData.total_pax) || 0)).toLocaleString()}
              </p>
            </div>

            {/* ปุ่มบันทึก */}
            <button type="submit" className="h-full py-5 bg-white hover:bg-blue-50 text-blue-900 rounded-[1.5rem] font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 group">
              <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Confirm Booking
            </button>
          </div>

          {/* การชำระเงินเล็กน้อยเพิ่มเติมข้างปุ่ม */}
          <div className="mt-6 flex flex-wrap gap-8 justify-center border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-blue-300 uppercase">Payment Method:</span>
              <select value={formData.pay_method} onChange={(e) => handleInputChange('pay_method', e.target.value)} className="bg-transparent text-white font-black text-sm outline-none">
                <option value="cash" className="text-blue-900">Cash</option>
                <option value="transfer" className="text-blue-900">Transfer</option>
                <option value="credit" className="text-blue-900">Credit Card</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.pay_on_arrival} onChange={(e) => handleInputChange('pay_on_arrival', e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-0" />
              <span className="text-xs font-bold text-white uppercase tracking-tighter">Pay on arrival</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-300 uppercase italic">Paid Status:</span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${formData.paid_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
                {formData.paid_status}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
