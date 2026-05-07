"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  X, ChevronRight, ChevronLeft, CreditCard,
  Banknote, Info, User, CheckCircle2, Compass, MapPin
} from 'lucide-react';

interface TourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: any;        // ข้อมูลทัวร์จากหน้าปัจจุบัน
  allTours: any[];  // รายการทัวร์ทั้งหมด 200 รายการสำหรับ Select
}

export default function TourBookingModal({ isOpen, onClose, tour,allTours }: TourBookingModalProps) {


    /*
     *

            // booking table

            // ข้อมูลการชำระเงิน
            $table->string('pay_method')->comment('เช่น cash, transfer, credit_card');
            $table->string('paid_status')->default('pending');


            $table->string('pay_on_arrival')->default('None');
            $table->decimal('must_pay_on_departure', 10, 2)->default(0.00);
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->decimal('pay_deposit', 10, 2)->default(0.00);

            $table->decimal('price_per_pax', 10, 2)->default(0.00);
            $table->integer('total_pax')->default(1)->comment('จำนวนคน');



            // ข้อมูลวันเวลาและการเดินทาง
            $table->string('pickup_at')->nullable()->comment('สถานที่รับลูกค้า');
            $table->string('special_request')->comment('เช่น แพ้กุ้ง,ไม่กินปลาร้า,ว่ายน้ำไม่เป็น, ');
            $table->date('date_departure')->comment('วันที่ออกเดินทาง');
            $table->dateTime('date_confirmed')->nullable()->comment('วันที่ยืนยันการจอง');
     *
     * */
  // --- 1. State Management ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tour_id: "",
    date_departure: "",
    total_pax: 1,
    payment_method: "cash", // cash, card, deposit
    pay_deposit: 0,
    email: "",
    name: "",
    last_name: "",
    nick_name: "",
    hotel: "",
    room_number: "",
    pickup_at: "",
    special_request: "",
    agreed: false
  });

  // --- 2. Persistence Logic (จดจำข้อมูล) ---
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('pending_booking');
      const savedStep = localStorage.getItem('pending_step');
      if (savedData) setFormData(JSON.parse(savedData));
      if (savedStep) setStep(Number(savedStep));

      // ถ้าไม่มี tour_id ให้ใช้จากตัวที่ส่งมาจากหน้า Detail
      if (!formData.tour_id && tour?.id) {
        setFormData(prev => ({ ...prev, tour_id: tour.id.toString() }));
      }
    }
  }, [isOpen, tour]);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('pending_booking', JSON.stringify(formData));
      localStorage.setItem('pending_step', step.toString());
    }
  }, [formData, step, isOpen]);

  // --- 3. Calculations & Helpers ---
  const selectedTourData = useMemo(() => {
    return allTours?.find((t) => t.id.toString() === formData.tour_id.toString()) || tour;
  }, [formData.tour_id, allTours, tour]);

  const basePrice = Number(selectedTourData?.price || 0);
  const totalPrice = basePrice * formData.total_pax;

  const finalPrice = useMemo(() => {
    if (formData.payment_method === "card") return totalPrice * 1.04;
    return totalPrice;
  }, [totalPrice, formData.payment_method]);

  const remainingPayAtTour = useMemo(() => {
    if (formData.payment_method === "deposit") return totalPrice - formData.pay_deposit;
    return 0;
  }, [totalPrice, formData.pay_deposit, formData.payment_method]);

  const truncateTitle = (title: string) => {
    if (!title) return "";
    return title.length > 100 ? title.substring(0, 100) + "..." : title;
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleBooking = () => {
    console.log("Booking Confirmed:", formData);
    localStorage.removeItem('pending_booking');
    localStorage.removeItem('pending_step');
    alert("ระบบบันทึกการจองของท่านเรียบร้อยแล้ว");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
          <div className="space-y-1 mb-8">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Booking Process</p>
            <h2 className="text-3xl font-black">จองทัวร์ของคุณ</h2>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between relative max-w-2xl mx-auto">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-blue-400 z-0"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= i ? 'bg-white text-blue-600 shadow-lg scale-110' : 'bg-blue-500 text-blue-200'}`}>
                  {i}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-slate-50/50">

          {/* STEP 1: เลือกทัวร์ & วันที่ */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">


<div className="space-y-4">
      <label className="text-sm font-black text-slate-400 uppercase tracking-tighter">โปรแกรมทัวร์</label>
      <select
        value={formData.tour_id}
        onChange={(e) => setFormData({...formData, tour_id: e.target.value})}
        className="w-full p-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-white font-bold text-slate-700 transition-all appearance-none"
      >
        {/* 1. กรณีที่ไม่มีข้อมูลใน allTours เลย ให้แสดงทัวร์ปัจจุบันเป็นตัวเลือกเดียว */}
        {!allTours || allTours.length === 0 ? (
          <option value={tour?.id}>{truncateTitle(tour?.title)}</option>
        ) : (
          <>
            {/* 2. ถ้ามี allTours ให้วนลูปแสดงผลตามปกติ */}
            {allTours.map((t: any) => (
              <option key={t.id} value={t.id}>
                {truncateTitle(t.title)}
              </option>
            ))}
          </>
        )}
      </select>

      {/* เพิ่มเติม: ถ้าใน allTours ไม่มีทัวร์ปัจจุบัน ให้มีปุ่มแจ้งเตือนหรือแสดงข้อความ */}
      {allTours && allTours.length > 0 && !allTours.find(t => t.id.toString() === formData.tour_id.toString()) && (
         <option value={tour?.id}>{truncateTitle(tour?.title)}</option>
      )}
    </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-tighter">วันที่ออกเดินทาง</label>
                  <input
                    type="date" min={minDate} value={formData.date_departure}
                    onChange={(e) => setFormData({...formData, date_departure: e.target.value})}
                    className="w-full p-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-tighter">จำนวนผู้เดินทาง</label>
                  <div className="flex items-center bg-white border-2 border-slate-100 rounded-[1.5rem] p-2">
                    <button onClick={() => setFormData({...formData, total_pax: Math.max(1, formData.adults - 1)})} className="w-12 h-12 flex items-center justify-center font-black text-slate-400 hover:text-blue-600 transition-colors">-</button>
                    <input type="number" value={formData.total_pax} readOnly className="flex-1 text-center font-black text-xl outline-none bg-transparent" />
                    <button onClick={() => setFormData({...formData, total_pax: formData.adults + 1})} className="w-12 h-12 flex items-center justify-center font-black text-slate-400 hover:text-blue-600 transition-colors">+</button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-blue-100 font-medium">ราคาต่อคน: ฿{basePrice.toLocaleString()}</p>
                  <h3 className="text-4xl font-black mt-1">฿{totalPrice.toLocaleString()}</h3>
                </div>
                <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
                  <span className="text-sm font-bold">ยอดรวมสุทธิ (Net Total)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: การชำระเงิน */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-black text-slate-800">เลือกช่องทางการชำระเงิน</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'cash', label: 'เงินสด (Cash)', icon: <Banknote size={32} /> },
                  { id: 'card', label: 'บัตร (Credit Card)', icon: <CreditCard size={32} />, sub: 'Fee 4%' },
                  { id: 'deposit', label: 'มัดจำ (Deposit)', icon: <Info size={32} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormData({...formData, payment_method: item.id})}
                    className={`p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all ${formData.payment_method === item.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-400 hover:border-blue-200'}`}
                  >
                    {item.icon}
                    <div className="text-center">
                      <p className="font-black">{item.label}</p>
                      {item.sub && <p className="text-xs font-bold opacity-60">{item.sub}</p>}
                    </div>
                  </button>
                ))}
              </div>

              {formData.payment_method === 'deposit' && (
                <div className="p-8 bg-amber-50 rounded-[2rem] border-2 border-amber-100 space-y-4">
                  <label className="font-black text-amber-800 uppercase text-xs">ระบุจำนวนเงินมัดจำ (฿)</label>
                  <input
                    type="number" className="w-full p-5 rounded-2xl border-2 border-amber-200 outline-none focus:border-amber-500 font-bold"
                    placeholder="0.00" value={formData.pay_deposit || ""}
                    onChange={(e) => setFormData({...formData, pay_deposit: Number(e.target.value)})}
                  />
                  <div className="flex justify-between items-center pt-4 border-t border-amber-200">
                    <span className="font-bold text-amber-900">ต้องชำระเพิ่มที่หน้างาน:</span>
                    <span className="text-2xl font-black text-amber-600">฿{remainingPayAtTour.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {formData.payment_method === 'card' && (
                <div className="p-6 bg-blue-50 rounded-[2rem] text-center border-2 border-blue-100">
                  <p className="text-blue-600 font-black text-xl">ยอดรวมสุทธิ (+4%): ฿{finalPrice.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: ข้อมูลลูกค้า */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="col-span-full space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">อีเมลติดต่อ</label>
                <input type="email" placeholder="Email Address" className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <input type="text" placeholder="ชื่อ (First Name)" className="p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="นามสกุล (Last Name)" className="p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
              <input type="text" placeholder="ชื่อเล่น (Nickname)" className="p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold" value={formData.nick_name} onChange={e => setFormData({...formData, nick_name: e.target.value})} />
              <input type="text" placeholder="โรงแรม (Hotel)" className="p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold" value={formData.hotel} onChange={e => setFormData({...formData, hotel: e.target.value})} />
              <input type="text" placeholder="เลขห้อง (Room)" className="p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold" value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} />
              <input type="text" placeholder="จุดรับส่ง (Pickup Point)" className="p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold" value={formData.pickup_at} onChange={e => setFormData({...formData, pickup_at: e.target.value})} />
              <div className="col-span-full space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase ml-2 text-red-500">ข้อมูลพิเศษ / แพ้อาหาร (Special Request)</label>
                 <textarea className="w-full p-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-500 font-bold h-24" value={formData.special_request} onChange={e => setFormData({...formData, specialRequest: e.target.value})} />
              </div>
            </div>
          )}

          {/* STEP 4: Data Summary */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column Left: Tour Details */}
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] space-y-4 shadow-sm">
                  <h4 className="font-black text-blue-600 flex items-center gap-2 mb-4"><Compass /> Booking Summary</h4>
                  <div className="flex justify-between text-sm"><span>ทัวร์:</span> <b className="text-right max-w-[150px]">{truncateTitle(selectedTourData?.title)}</b></div>
                  <div className="flex justify-between text-sm"><span>วันที่เดินทาง:</span> <b>{formData.date_departure}</b></div>
                  <div className="flex justify-between text-sm"><span>วันที่ทำรายการ:</span> <b>{new Date().toLocaleDateString()}</b></div>
                  <div className="flex justify-between text-sm"><span>จำนวนผู้เดินทาง:</span> <b>{formData.total_pax} ท่าน</b></div>
                  <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                    <span className="font-bold text-slate-400">ราคาสุทธิ:</span>
                    <span className="text-3xl font-black text-blue-600">฿{finalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Column Right: Customer Details */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
                  <h4 className="font-black text-blue-400 flex items-center gap-2 mb-4"><User /> Customer Details</h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">{formData.name} {formData.last_name}</p>
                    <p className="text-blue-300 text-sm">{formData.email}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
                    <p className="flex justify-between font-medium opacity-80"><span>โรงแรม:</span> <span>{formData.hotel}</span></p>
                    <p className="flex justify-between font-medium opacity-80"><span>คำขอพิเศษ:</span> <span className="text-red-400">{formData.special_request || 'ไม่มี'}</span></p>
                  </div>
                  <div className="mt-4 p-4 bg-white/5 rounded-2xl text-center border border-white/10">
                    {formData.payment_method === 'deposit' ? (
                      <p className="text-amber-400 font-bold">ค้างชำระ: ฿{remainingPayAtTour.toLocaleString()}</p>
                    ) : (
                      <p className="text-green-400 font-bold italic">ชำระครบถ้วน/ไม่มีการเก็บเพิ่ม</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className={`flex items-center gap-4 p-6 rounded-[1.5rem] cursor-pointer transition-all border-2 ${formData.agreed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                <input type="checkbox" className="w-6 h-6 rounded-lg accent-green-600" checked={formData.agreed} onChange={e => setFormData({...formData, agreed: e.target.checked})} />
                <span className="font-bold text-slate-700">I have read and understand the terms and conditions</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-8 bg-white border-t border-slate-100 flex justify-between gap-4">
          <button
            onClick={prevStep} disabled={step === 1}
            className="px-8 py-4 rounded-2xl font-black text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all flex items-center gap-2"
          >
            <ChevronLeft /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              Next Step <ChevronRight />
            </button>
          ) : (
            <button
              onClick={handleBooking} disabled={!formData.agreed}
              className={`px-16 py-4 rounded-2xl font-black transition-all flex items-center gap-2 text-white shadow-2xl ${formData.agreed ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : 'bg-red-500 opacity-50 cursor-not-allowed'}`}
            >
              <CheckCircle2 /> Make Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
