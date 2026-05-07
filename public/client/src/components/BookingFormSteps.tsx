"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import {
  ChevronLeft, ChevronRight, Save, CheckCircle2,
  User, Hotel, Ticket, Wallet, CreditCard, Banknote, X, Calendar
} from 'lucide-react';

interface Props {
  tourOptions: any[];
  initialData?: any;
  onClose: () => void;
  onSuccess: (finalData: any) => void;
}

export default function BookingFormSteps({ tourOptions, initialData, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [confirmPolicy, setConfirmPolicy] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // เพิ่มตัวแปรเช็คสถานะการโหลด Client

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const initialForm = {
    name: '', last_name: '', nick_name: '',
    hotel: '', room_number: '', pickup_at: '',
    tour_id: '',
    price_per_pax: 0,
    total_pax: 1,
    pay_method: 'cash',
    pay_deposit: 0,
    date_departure: minDate,
  };

  const [formData, setFormData] = useState(initialForm);

  // 1. จัดการ Lifecycle และการดึงข้อมูลครั้งแรก
  useEffect(() => {
    setIsMounted(true); // บอกว่า Client พร้อมทำงานแล้ว

    if (initialData) {
      // กรณี Edit: โหลดข้อมูลจาก Props
      setFormData({
        ...initialForm,
        ...initialData,
        name: initialData.customer?.name || initialData.name || '',
        last_name: initialData.customer?.last_name || initialData.last_name || '',
        nick_name: initialData.customer?.nick_name || initialData.nick_name || '',
        hotel: initialData.customer?.hotel || initialData.hotel || '',
        room_number: initialData.customer?.room_number || initialData.room_number || '',
        total_pax: initialData.total_pax || 1,
        pickup_at: initialData.pickup_at || '',
        tour_id: initialData.tour_id?.toString() || initialData.tour?.id?.toString() || '',
        price_per_pax: initialData.price_per_pax || initialData.tour?.price || 0,
        date_departure: initialData.date_departure || minDate,
      });
    } else {
      // กรณี New/Refresh: ดึงจาก Cookie หลังจาก Mounted แล้ว
      const saved = getCookie('temp_booking_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved as string);
          setFormData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to restore data from cookies", e);
        }
      }
    }
  }, [initialData]); // รันเมื่อ initialData เปลี่ยน หรือเมื่อโหลดคอมโพเนนต์

  // 2. ระบบ Auto-save: บันทึกข้อมูลลง Cookie ทุกครั้งที่ formData เปลี่ยน
  useEffect(() => {
    // ป้องกันการเซฟค่าว่างทับ หรือเซฟทับในโหมด Edit
    if (isMounted && !initialData) {
      setCookie('temp_booking_data', JSON.stringify(formData), {
        maxAge: 3600, // เก็บไว้ 1 ชม.
        path: '/',    // ให้เข้าถึงได้ทุกหน้า
      });
    }
  }, [formData, initialData, isMounted]);

  // --- Logic การคำนวณและ UI เหมือนเดิมจากโค้ดชุดที่แล้ว ---
  const calc = useMemo(() => {
    const baseTotal = (Number(formData.price_per_pax) || 0) * (Number(formData.total_pax) || 0);
    let fee = 0;
    let payOnArrival = 0;
    if (formData.pay_method === 'credit') { fee = baseTotal * 0.04; }
    else if (formData.pay_method === 'deposit') { payOnArrival = baseTotal - (Number(formData.pay_deposit) || 0); }
    const grandTotal = baseTotal + fee;
    const paidStatus = formData.pay_method === 'credit' ? 'paid by credit card' :
                      formData.pay_method === 'deposit' ? `collect ${payOnArrival.toLocaleString()}` : 'paid by cash';
    return { baseTotal, fee, grandTotal, paidStatus, pay_on_arrival: Math.max(0, payOnArrival) };
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    if (field === 'tour_id') {
      const selected = tourOptions.find(t => t.id.toString() === value.toString());
      newData.price_per_pax = selected ? selected.price : 0;
    }
    setFormData(newData);
  };

  const handleFinalSubmit = () => {
    const finalData = { ...formData, total_price: calc.grandTotal, paid_status: calc.paidStatus, pay_on_arrival: calc.pay_on_arrival };
    deleteCookie('temp_booking_data'); // ลบ Draft เมื่อสำเร็จ
    onSuccess(finalData);
  };

  const selectedTour = tourOptions.find(t => t.id.toString() === formData.tour_id.toString());

  // ถ้ายังไม่ Mounted ไม่ต้อง Render เพื่อป้องกัน Hydration Error
  if (!isMounted) return null;

  return (
    <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 relative">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-10">
        <X size={24} />
      </button>

      <div className="bg-gray-50/50 p-6 border-b flex justify-between items-center pr-20">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`w-10 h-2 rounded-full ${step >= num ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-black text-blue-900 uppercase tracking-widest">Step {step} of 4</span>
      </div>

      <div className="p-10 min-h-[550px]">
        {/* Step 1: Tour & Date */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-blue-900">รายละเอียดทัวร์</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Calendar size={14}/> วันที่เดินทาง</label>
                  <input type="date" min={minDate} value={formData.date_departure} onChange={(e) => handleInputChange('date_departure', e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">โปรแกรมทัวร์</label>
                  <select value={formData.tour_id} onChange={(e) => handleInputChange('tour_id', e.target.value)} className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold outline-none">
                    <option value="">-- เลือกทัวร์ --</option>
                    {tourOptions.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase">จำนวนลูกค้า: {formData.total_pax}</label>
                <input type="range" min="1" max="40" value={formData.total_pax} onChange={(e) => handleInputChange('total_pax', e.target.value)} className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <div className="mt-10 p-8 bg-gray-900 rounded-[2rem] text-white">
                  <p className="text-gray-400 text-sm">ยอดรวมพื้นฐาน:</p>
                  <p className="text-4xl font-black">฿{calc.baseTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-blue-900 text-center">การชำระเงิน</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'cash', label: 'เงินสด', icon: <Banknote /> },
                { id: 'credit', label: 'บัตรเครดิต (4%)', icon: <CreditCard /> },
                { id: 'deposit', label: 'มัดจำบางส่วน', icon: <Wallet /> },
              ].map(item => (
                <label key={item.id} className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-4 cursor-pointer transition-all ${formData.pay_method === item.id ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-gray-50'}`}>
                  <input type="radio" className="hidden" name="pay_method" value={item.id} checked={formData.pay_method === item.id} onChange={(e) => handleInputChange('pay_method', e.target.value)} />
                  <div className={`p-4 rounded-full ${formData.pay_method === item.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>{item.icon}</div>
                  <span className="font-black text-blue-900">{item.label}</span>
                </label>
              ))}
            </div>
            {formData.pay_method === 'deposit' && (
              <div className="max-w-md mx-auto p-6 bg-white border-2 border-dashed border-gray-200 rounded-[2rem]">
                <label className="font-bold text-gray-600 block mb-2 text-center">ยอดมัดจำที่รับมา:</label>
                <input type="number" value={formData.pay_deposit} onChange={(e) => handleInputChange('pay_deposit', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl font-black text-3xl text-blue-600 text-center outline-none" />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-blue-900">ข้อมูลลูกค้า</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-black text-blue-600 flex items-center gap-2"><User size={18}/> ข้อมูลส่วนตัว</h3>
                <input placeholder="ชื่อ *" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" />
                <input placeholder="นามสกุล *" value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" />
                <input placeholder="ชื่อเล่น" value={formData.nick_name} onChange={(e) => handleInputChange('nick_name', e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-4">
                <h3 className="font-black text-blue-600 flex items-center gap-2"><Hotel size={18}/> ข้อมูลที่พัก</h3>
                <input placeholder="ชื่อโรงแรม *" value={formData.hotel} onChange={(e) => handleInputChange('hotel', e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="เลขห้อง" value={formData.room_number} onChange={(e) => handleInputChange('room_number', e.target.value)} className="p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" />
                  <input placeholder="จุดนัดรับ" value={formData.pickup_at} onChange={(e) => handleInputChange('pickup_at', e.target.value)} className="p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-blue-900 text-center">ตรวจสอบความถูกต้อง</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                <h4 className="font-black text-blue-900 border-b border-blue-200 pb-2 mb-4">สรุปการจอง</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span>วันที่เดินทาง:</span> <b>{formData.date_departure}</b></p>
                  <p className="flex justify-between"><span>ลูกค้า:</span> <b>{formData.name} {formData.last_name}</b></p>
                  <p className="flex justify-between"><span>ทัวร์:</span> <b>{selectedTour?.title}</b></p>
                  <p className="flex justify-between text-lg font-black text-blue-600 mt-4 pt-4 border-t border-blue-200"><span>ราคาสุทธิ:</span> <span>฿{calc.grandTotal.toLocaleString()}</span></p>
                </div>
              </div>
              <div className="p-8 bg-red-600 rounded-[2.5rem] text-white shadow-xl">
                <h4 className="font-black border-b border-red-400 pb-2 mb-4">ยอดเก็บเพิ่มหน้างาน</h4>
                <p className="text-5xl font-black">฿{calc.pay_on_arrival.toLocaleString()}</p>
                <p className="mt-4 text-sm text-red-100 italic font-bold uppercase">{calc.paidStatus}</p>
              </div>
            </div>
            <div className="flex justify-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setConfirmPolicy(!confirmPolicy)} className={`w-8 h-8 rounded-xl border-4 transition-all flex items-center justify-center ${confirmPolicy ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-gray-200 bg-white'}`}>
                  {confirmPolicy && <CheckCircle2 size={20} />}
                </div>
                <span className="font-bold text-gray-600">ตรวจสอบข้อมูลถูกต้องแล้ว</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t bg-gray-50/50 flex justify-between gap-4">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 flex items-center gap-2">
            <ChevronLeft /> Back
          </button>
        )}
        <div className="flex-1" />
        {step < 4 ? (
          <button onClick={() => {
            if (step === 1 && !formData.tour_id) return alert("กรุณาเลือกโปรแกรมทัวร์");
            setStep(s => s + 1);
          }} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg">
            Next <ChevronRight />
          </button>
        ) : (
          <button onClick={handleFinalSubmit} disabled={!confirmPolicy} className={`px-12 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl ${confirmPolicy ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            <Save /> Confirm
          </button>
        )}
      </div>
    </div>
  );
}
