"use client";
import React, { useState, useEffect } from 'react';
import { X, Code2, Info, Image as ImageIcon, CircleDollarSign } from 'lucide-react';

// ส่วนของ Code Editor
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup'; // รองรับ HTML
import 'prismjs/themes/prism.css'; // Theme ของโค้ด

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function TourModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  // State สำหรับจัดการฟอร์ม
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    description: ''
  });

  // อัปเดตข้อมูลเมื่อมีการเปิด Modal หรือเปลี่ยนข้อมูลที่เลือก (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        price: initialData.price || '',
        image: initialData.image || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({ title: '', price: '', image: '', description: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">

      {/* Modal Container: กว้าง 85% ของจอ และสูง 90% */}
      <div className="bg-white w-[85%] max-w-[1500px] h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">

        {/* --- Header --- */}
        <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">
              {initialData ? 'แก้ไขรายการทัวร์' : 'สร้างรายการทัวร์ใหม่'}
            </h2>
            <p className="text-gray-500 font-medium">จัดการรายละเอียดข้อมูลและโค้ดโปรแกรมทัวร์</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-95"
          >
            <X size={32} />
          </button>
        </div>

        {/* --- Body --- */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ฝั่งซ้าย (4/12): ข้อมูลพื้นฐาน */}
            <div className="lg:col-span-4 space-y-8">

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <Info size={20} />
                  <span>ข้อมูลทั่วไป</span>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">ชื่อทัวร์</label>
                  <input
                    type="text"
                    placeholder="เช่น เที่ยวทะเลพังงา 3 วัน 2 คืน"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-1">
                    <CircleDollarSign size={16} /> ราคา (บาท)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-blue-600 text-xl"
                  />
                </div>
              </section>

              <section className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <ImageIcon size={20} />
                  <span>รูปภาพประกอบ</span>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">URL รูปภาพหน้าปก</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                  {formData.image && (
                    <div className="mt-4 rounded-3xl overflow-hidden border-4 border-gray-100 shadow-inner">
                       <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" />
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ฝั่งขวา (8/12): Code Editor สำหรับ Description */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-black text-gray-700 flex items-center gap-2">
                  <Code2 size={20} className="text-blue-600" />
                  รายละเอียดโปรแกรมทัวร์ (HTML Code Editor)
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase">
                  Support HTML/JS
                </span>
              </div>

              {/* Container ของ Editor */}
              <div className="flex-1 rounded-3xl border-2 border-gray-100 bg-[#f5f2f0] overflow-hidden min-h-[500px] shadow-inner relative">
                <Editor
                  value={formData.description}
                  onValueChange={code => setFormData({...formData, description: code})}
                  highlight={code => highlight(code, languages.markup, 'markup')}
                  padding={25}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 15,
                    minHeight: '500px',
                    outline: 'none'
                  }}
                  className="min-h-[500px] focus:outline-none"
                />
              </div>
              <p className="mt-3 text-xs text-gray-400 font-medium">
                * พี่สามารถเขียน HTML Tag เพื่อปรับแต่งเนื้อหาหน้าเว็บได้โดยตรง
              </p>
            </div>

          </div>
        </div>

        {/* --- Footer --- */}
        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-5">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all active:scale-95"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-12 py-4 rounded-2xl font-black bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-none transition-all active:scale-95"
          >
            {initialData ? 'อัปเดตข้อมูลทัวร์' : 'บันทึกรายการทัวร์'}
          </button>
        </div>
      </div>
    </div>
  );
}
