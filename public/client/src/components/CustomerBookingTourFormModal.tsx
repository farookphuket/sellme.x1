"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import {
  ChevronLeft, ChevronRight, CheckCircle2,
  User, Hotel, Ticket, Wallet, CreditCard, Banknote, X, Calendar,
  MapPin, Clock, DollarSign, FileText, AlertCircle
} from 'lucide-react';

interface FormData {

  name: string;
  last_name: string;
  nick_name: string;

  email: string;
  hotel: string;
  room_number: string;
  pickup_at: string;
  special_request: string;
  tour_id: string | number;
  price_per_pax: number;
  total_pax: number;
  pay_method: 'cash' | 'credit' | 'deposit';
  pay_deposit: number;
  date_departure: string;
}

interface Tour {
  id: number | string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
  preSelectedTourId?: number | string;
  tours: Tour[];
}

export default function CustomerBookingTourFormModal({
  isOpen,
  onClose,
  onSuccess,
  preSelectedTourId,
  tours
}: Props) {
  const [step, setStep] = useState(1);
  const [confirmPolicy, setConfirmPolicy] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // หลีกเลี่ยงการเลือกวันที่ผ่านมาแล้ว
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const initialForm: FormData = {
    name: '',
    last_name: '',
    nick_name: '',
    email: '',
    hotel: '',
    room_number: '',
    pickup_at: '',
    special_request: '',
    tour_id: preSelectedTourId?.toString() || '',
    price_per_pax: 0,
    total_pax: 1,
    pay_method: 'cash',
    pay_deposit: 0,
    date_departure: minDate,
  };

  const [formData, setFormData] = useState<FormData>(initialForm);

  // ✅ Initialize & Restore from Cookie
  useEffect(() => {
    setIsMounted(true);

    // ตั้งค่าราคาตามทัวร์ที่เลือกไว้ล่วงหน้า
    if (preSelectedTourId && tours.length > 0) {
      const selectedTour = tours.find(t => t.id.toString() === preSelectedTourId.toString());
      if (selectedTour) {
        setFormData(prev => ({
          ...prev,
          tour_id: preSelectedTourId,
          price_per_pax: selectedTour.price
        }));
        return;
      }
    }

    // ดึงข้อมูลจาก Cookie หากมี
    const saved = getCookie('temp_booking_form_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved as string);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to restore booking data from cookies", e);
      }
    }
  }, [preSelectedTourId, tours, isOpen]);

  // ✅ Auto-save to Cookie
  useEffect(() => {
    if (isMounted && isOpen) {
      setCookie('temp_booking_form_data', JSON.stringify(formData), {
        maxAge: 7200, // 2 ชม.
        path: '/',
      });
    }
  }, [formData, isMounted, isOpen]);

  // ✅ Calculate totals
  const calculations = useMemo(() => {
    const baseTotal = (Number(formData.price_per_pax) || 0) * (Number(formData.total_pax) || 0);
    let fee = 0;
    let payOnArrival = 0;
    let paymentStatus = 'เงินสด';

    if (formData.pay_method === 'credit') {
      fee = baseTotal * 0.04;
      paymentStatus = 'บัตรเครดิต (ค่าธรรมเนียม 4%)';
    } else if (formData.pay_method === 'deposit') {
      payOnArrival = baseTotal - (Number(formData.pay_deposit) || 0);
      paymentStatus = `มัดจำ ฿${(Number(formData.pay_deposit) || 0).toLocaleString()} เก็บหน้างาน ฿${payOnArrival.toLocaleString()}`;
    }

    const grandTotal = baseTotal + fee;

    // คำนวณวันจากวันเดินทางถึงวันนี้
    const today = new Date();
    const depDate = new Date(formData.date_departure);
    const daysUntilDeparture = Math.ceil((depDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      baseTotal,
      fee,
      grandTotal,
      payOnArrival: Math.max(0, payOnArrival),
      paymentStatus,
      daysUntilDeparture
    };
  }, [formData]);

  // ✅ Handle input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    const normalizedValue = field === 'tour_id' ? value.toString() : value;
    const newData = { ...formData, [field]: normalizedValue };

    if (field === 'tour_id') {
      const selected = tours.find(t => t.id.toString() === normalizedValue);
      newData.price_per_pax = selected ? selected.price : 0;
    }

    setFormData(newData);
  };

  // ✅ Get tour description (truncated to 200 chars)
  const getTourDescription = () => {
    const tour = tours.find(t => t.id.toString() === formData.tour_id.toString());
    if (!tour) return 'ยังไม่ได้เลือกทัวร์';
    const desc = tour.description || tour.title;
    return desc.length > 200 ? desc.substring(0, 200) + '...' : desc;
  };

  // ✅ Calculate days remaining
  const getDaysRemaining = () => {
    const today = new Date();
    const depDate = new Date(formData.date_departure);
    const diffTime = depDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // ✅ Handle final submission
  const handleFinalSubmit = async () => {
    if (!confirmPolicy) return;

    setIsSubmitting(true);
    try {
      // เตรียมข้อมูลสำหรับส่งไปยัง Backend
      const bookingData = {
        ...formData,
    // ข้อมูลลูกค้าแบบ Nested ตามที่ Backend คาดหวัง
      customer: {
        name: formData.name,
        last_name: formData.last_name,
        nick_name: formData.nick_name,
        email: formData.email,
      },
        total_price: calculations.grandTotal,
        must_pay_on_departure: calculations.payOnArrival,
        paid_status: 'pending',
                pay_on_arrival:calculations.payOnArrival,
        date_confirmed: new Date().toISOString(),
      };

      // ส่ง callback
      await onSuccess(bookingData);

      // ล้าง Cookie เมื่อสำเร็จ
      deleteCookie('temp_booking_form_data');

      // Reset form
      setFormData(initialForm);
      setStep(1);
      setConfirmPolicy(false);
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Get selected tour details
  const selectedTour = tours.find(t => t.id.toString() === formData.tour_id.toString());

  // ✅ ตรวจสอบการ Validate ของแต่ละ Step
  const isStep1Valid = () => formData.tour_id && formData.date_departure && formData.total_pax > 0;
  const isStep3Valid = () => formData.name && formData.last_name && formData.email && formData.hotel && formData.room_number;

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Floating Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[160] p-3 bg-white hover:bg-red-500 hover:text-white text-slate-900 rounded-full shadow-xl transition-all active:scale-95"
      >
        <X size={28} />
      </button>

      {/* Main Modal Container */}
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 max-h-[95vh] flex-col">

        {/* Header: Progress Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-8 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-blue-900">การจองทัวร์</h1>
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
              Step {step} / 4
            </span>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                className={`h-2 flex-1 rounded-full transition-all ${
                  step >= num ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">

          {/* ========== STEP 1: เลือกทัวร์ ========== */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-blue-900 mb-8">เลือกทัวร์และวันที่เดินทาง</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1 */}
                <div className="space-y-6">
                  {/* Date Picker */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      วันที่เดินทาง *
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={formData.date_departure}
                      onChange={(e) => handleInputChange('date_departure', e.target.value)}
                      className="w-full p-5 bg-gray-50 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-2xl font-bold outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-400">
                      {getDaysRemaining() > 0 ? `${getDaysRemaining()} วนก่อนเดินทาง` : 'วันที่ไม่ถูกต้อง'}
                    </p>
                  </div>

                  {/* Tour Select */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <Ticket size={16} className="text-blue-600" />
                      โปรแกรมทัวร์ *
                    </label>
                    <select
                      value={formData.tour_id?.toString() || ''}
                      onChange={(e) => handleInputChange('tour_id', e.target.value)}
                      className="w-full p-5 bg-gray-50 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-2xl font-bold outline-none transition-colors cursor-pointer"
                    >
                      <option value="">-- เลือกทัวร์ --</option>
                      {tours.map(tour => (
                        <option key={tour.id} value={tour.id}>
                          {tour.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tour Description */}
                  {formData.tour_id && (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-600 text-white rounded-lg flex-shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">รายละเอียดทัวร์:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {getTourDescription()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  {/* Quantity Selector */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <User size={16} className="text-blue-600" />
                      จำนวนคน: <span className="text-blue-600 text-lg">{formData.total_pax}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={formData.total_pax}
                      onChange={(e) => handleInputChange('total_pax', e.target.value)}
                      className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-600 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-bold">
                      <span>1 คน</span>
                      <span>40 คน</span>
                    </div>
                  </div>

                  {/* Price Summary Box */}
                  <div className="space-y-3 p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-xl">
                    <div className="space-y-2">
                      <p className="text-sm text-blue-100">ราคาต่อหน่วย:</p>
                      <p className="text-2xl font-black">฿{calculations.baseTotal === 0 ? 0 : formData.price_per_pax.toLocaleString()}</p>
                    </div>
                    <div className="border-t border-blue-400 pt-3">
                      <p className="text-sm text-blue-100">ราคารวม ({formData.total_pax} คน):</p>
                      <p className="text-4xl font-black">฿{calculations.baseTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== STEP 2: การชำระเงิน ========== */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-blue-900 mb-8 text-center">เลือกวิธีการชำระเงิน</h2>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'cash', label: 'เงินสด', icon: <Banknote size={32} /> },
                  { id: 'credit', label: 'บัตรเครดิต', subtitle: '(+4% ค่าธรรมเนียม)', icon: <CreditCard size={32} /> },
                  { id: 'deposit', label: 'มัดจำบางส่วน', subtitle: '(เก็บส่วนที่เหลือ)', icon: <Wallet size={32} /> },
                ].map(item => (
                  <label
                    key={item.id}
                    className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-3 cursor-pointer transition-all transform hover:scale-105 ${
                      formData.pay_method === item.id
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      name="pay_method"
                      value={item.id}
                      checked={formData.pay_method === item.id as any}
                      onChange={(e) => handleInputChange('pay_method', e.target.value as any)}
                    />
                    <div
                      className={`p-4 rounded-full transition-all ${
                        formData.pay_method === item.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-bold text-blue-900 text-center">{item.label}</span>
                    {item.subtitle && (
                      <span className="text-xs text-gray-500 text-center">{item.subtitle}</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Deposit Input (Show when deposit selected) */}
              {formData.pay_method === 'deposit' && (
                <div className="max-w-sm mx-auto space-y-4 p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={20} className="text-amber-600" />
                    <p className="font-bold text-amber-900">ยอดมัดจำ</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={calculations.baseTotal}
                    value={formData.pay_deposit}
                    onChange={(e) => handleInputChange('pay_deposit', e.target.value)}
                    className="w-full p-4 bg-white rounded-xl font-black text-3xl text-blue-600 text-center outline-none border-2 border-amber-200 focus:border-amber-500 transition-colors"
                    placeholder="0"
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ทัวร์ราคาเต็ม:</span>
                      <span className="font-bold">฿{calculations.baseTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">มัดจำ:</span>
                      <span className="font-bold">฿{Number(formData.pay_deposit).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between bg-red-50 p-2 rounded-lg">
                      <span className="font-bold text-red-900">เก็บหน้างาน:</span>
                      <span className="font-black text-lg text-red-600">฿{calculations.payOnArrival.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">ยอดรวมที่ต้องชำระ:</p>
                <p className="text-3xl font-black text-blue-900">
                  ฿{calculations.grandTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">{calculations.paymentStatus}</p>
              </div>
            </div>
          )}

          {/* ========== STEP 3: ข้อมูลลูกค้า ========== */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-blue-900 mb-8">ข้อมูลลูกค้า</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-black text-blue-600 text-lg flex items-center gap-2 mb-4">
                    <User size={20} /> ข้อมูลส่วนตัว
                  </h3>
                  <input
                    placeholder="ชื่อ *"
                                        name='customer.name'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors"
                  />
                  <input
                    placeholder="นามสกุล *"
                                        name='last_name'
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors"
                  />
                  <input
                    placeholder="ชื่อเล่น (ถ้ามี)"
                                        name="nick_name"
                    value={formData.nick_name}
                    onChange={(e) => handleInputChange('nick_name', e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors"
                  />
                  <input
                    placeholder="อีเมล *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors"
                  />
                </div>

                {/* Hotel & Pickup Info */}
                <div className="space-y-4">
                  <h3 className="font-black text-blue-600 text-lg flex items-center gap-2 mb-4">
                    <Hotel size={20} /> ข้อมูลที่พัก
                  </h3>
                  <input
                    placeholder="ชื่อโรงแรม *"
                    value={formData.hotel}
                    onChange={(e) => handleInputChange('hotel', e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="เลขห้อง *"
                      value={formData.room_number}
                      onChange={(e) => handleInputChange('room_number', e.target.value)}
                      className="p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors"
                    />
                    <input
                      placeholder="จุดนัดรับ"
                      value={formData.pickup_at}
                      onChange={(e) => handleInputChange('pickup_at', e.target.value)}
                      className="p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Special Request */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  ข้อมูลเพิ่มเติม (ไม่จำเป็น)
                </label>
                <textarea
                  placeholder="เช่น แพ้กุ้ง, แพ้แมลงกัดต่อย, ไม่กินปลาร้า, ว่ายน้ำไม่เป็น"
                  value={formData.special_request}
                  onChange={(e) => handleInputChange('special_request', e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl font-normal border-2 border-transparent hover:border-blue-300 focus:border-blue-600 outline-none transition-colors min-h-[120px] resize-none"
                />
              </div>
            </div>
          )}

          {/* ========== STEP 4: สรุปข้อมูล ========== */}
          {step === 4 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-black text-blue-900 mb-8 text-center">ตรวจสอบความถูกต้อง</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Booking Details */}
                <div className="space-y-4 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-sm">
                  <h4 className="font-black text-blue-900 text-lg mb-6 flex items-center gap-2">
                    <Ticket size={24} /> รายละเอียดการจอง
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">วันเดินทาง:</span>
                      <span className="font-bold text-blue-900">{formData.date_departure}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">นับจากวันนี้:</span>
                      <span className="font-bold text-blue-900">{getDaysRemaining()} วัน</span>
                    </div>
                    <div className="border-b border-blue-200" />
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">ทัวร์:</span>
                      <span className="font-bold text-blue-900 text-right">{selectedTour?.title}</span>
                    </div>
                    <div className="border-b border-blue-200" />
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">จำนวนคน:</span>
                      <span className="font-bold text-blue-900">{formData.total_pax} คน</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">ราคาต่อคน:</span>
                      <span className="font-bold text-blue-900">฿{formData.price_per_pax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-start bg-white p-3 rounded-lg">
                      <span className="font-bold text-gray-700">ราคารวม:</span>
                      <span className="font-black text-2xl text-blue-600">฿{calculations.baseTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Customer & Payment Details */}
                <div className="space-y-4 p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-sm">
                  <h4 className="font-black text-amber-900 text-lg mb-6 flex items-center gap-2">
                    <User size={24} /> ข้อมูลลูกค้า
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold">ชื่อ:</span>
                      <p className="font-bold text-gray-900">{formData.name} {formData.last_name}</p>
                    </div>
                    {formData.nick_name && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-bold">ชื่อเล่น:</span>
                        <p className="font-bold text-gray-900">{formData.nick_name}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold">อีเมล:</span>
                      <p className="font-bold text-gray-900">{formData.email}</p>
                    </div>
                    <div className="border-b border-amber-200" />
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold">โรงแรม:</span>
                      <p className="font-bold text-gray-900">{formData.hotel} ห้อง {formData.room_number}</p>
                    </div>
                    {formData.pickup_at && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-bold">จุดนัดรับ:</span>
                        <p className="font-bold text-gray-900">{formData.pickup_at}</p>
                      </div>
                    )}
                    {formData.special_request && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-bold">ข้อมูลเพิ่มเติม:</span>
                        <p className="font-bold text-gray-900 text-sm">{formData.special_request}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Price */}
                <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-xl">
                  <p className="text-sm text-blue-100 mb-2">ยอดที่ต้องชำระทั้งหมด:</p>
                  <p className="text-5xl font-black">฿{calculations.grandTotal.toLocaleString()}</p>
                </div>

                {/* Additional Payment */}
                <div className={`p-8 rounded-2xl text-white shadow-xl ${
                  calculations.payOnArrival > 0
                    ? 'bg-gradient-to-br from-red-600 to-red-700'
                    : 'bg-gradient-to-br from-green-600 to-green-700'
                }`}>
                  <p className="text-sm opacity-90 mb-2">
                    {calculations.payOnArrival > 0 ? 'เก็บเพิ่มหน้างาน:' : 'สถานะการชำระเงิน:'}
                  </p>
                  <p className="text-4xl font-black">
                    {calculations.payOnArrival > 0 ? `฿${calculations.payOnArrival.toLocaleString()}` : 'ชำระเต็มแล้ว'}
                  </p>
                  <p className="text-xs opacity-75 mt-3 italic">{calculations.paymentStatus}</p>
                </div>
              </div>

              {/* Confirm Policy Checkbox */}
              <div className="flex items-start gap-4 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <div
                    onClick={() => setConfirmPolicy(!confirmPolicy)}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center mt-1 ${
                      confirmPolicy
                        ? 'bg-emerald-500 border-emerald-600'
                        : 'border-gray-300 bg-white hover:border-emerald-400'
                    }`}
                  >
                    {confirmPolicy && <CheckCircle2 size={20} className="text-white" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      ฉันได้ตรวจสอบข้อมูลแล้วและยอมรับเงื่อนไขการจอง
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      โปรดตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนที่จะกดยืนยันการจอง
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Navigation Buttons */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-between gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={isSubmitting}
              className="px-8 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-200 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={20} /> ย้อนกลับ
            </button>
          )}
          <div className="flex-1" />

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 1 && !isStep1Valid()) {
                  alert('กรุณากรอกข้อมูลให้ครบ: ทัวร์, วันที่, และจำนวนคน');
                  return;
                }
                if (step === 3 && !isStep3Valid()) {
                  alert('กรุณากรอกข้อมูลให้ครบ: ชื่อ, นามสกุล, อีเมล, โรงแรม, เลขห้อง');
                  return;
                }
                setStep(s => s + 1);
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-colors"
            >
              ถัดไป <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={!confirmPolicy || isSubmitting}
              className={`px-12 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-colors ${
                confirmPolicy && !isSubmitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'กำลังประมวลผล...' : '✓ ยืนยันการจอง'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
