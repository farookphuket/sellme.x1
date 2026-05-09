"use client";
import React, { useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

interface CustomerFormData {
  id?: number;
  name: string;
  last_name: string;
  nick_name: string;
  email: string;
  hotel: string;
  room_number: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  initialData?: CustomerFormData;
  isSubmitting?: boolean;
}

export default function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false
}: Props) {
  const [formData, setFormData] = React.useState<CustomerFormData>({
    name: '',
    last_name: '',
    nick_name: '',
    email: '',
    hotel: '',
    room_number: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        last_name: '',
        nick_name: '',
        email: '',
        hotel: '',
        room_number: ''
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-100">
          <h2 className="text-2xl font-black text-blue-900">
            {initialData?.id ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Row 1: Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">ชื่อ *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="ชื่อลูกค้า"
                className="w-full p-4 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-xl outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">นามสกุล *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="นามสกุล"
                className="w-full p-4 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-xl outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2: Nickname and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">ชื่อเล่น</label>
              <input
                type="text"
                value={formData.nick_name}
                onChange={(e) => handleInputChange('nick_name', e.target.value)}
                placeholder="ชื่อเล่น (ถ้ามี)"
                className="w-full p-4 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-xl outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">อีเมล</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="อีเมล (ถ้ามี)"
                className="w-full p-4 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Hotel and Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">โรงแรม *</label>
              <input
                type="text"
                value={formData.hotel}
                onChange={(e) => handleInputChange('hotel', e.target.value)}
                placeholder="ชื่อโรงแรม"
                className="w-full p-4 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-xl outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">เลขห้อง *</label>
              <input
                type="text"
                value={formData.room_number}
                onChange={(e) => handleInputChange('room_number', e.target.value)}
                placeholder="เลขห้อง"
                className="w-full p-4 border-2 border-transparent hover:border-blue-300 focus:border-blue-600 rounded-xl outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>กำลังบันทึก...</>
              ) : (
                <>
                  {initialData?.id ? <Save size={20} /> : <Plus size={20} />}
                  {initialData?.id ? 'บันทึกการแก้ไข' : 'เพิ่มลูกค้า'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
