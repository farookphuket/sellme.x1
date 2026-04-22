"use client";

import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
/*
export default function LandingPage() {
*/

export default function Home() {

  return (
        <>


    <div className="min-h-screen bg-white text-gray-800">

      {/* --- 2. Hero Section (Red Background with White Text) --- */}
      <header className="bg-red-600 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            เปิดประสบการณ์เที่ยวไทย<br/>แบบเหนือระดับกับ Thaitan Tours
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-10 max-w-3xl mx-auto">
            สัมผัสความงามของวัฒนธรรมและธรรมชาติ ด้วยโปรแกรมทัวร์ที่ออกแบบมาเพื่อคุณโดยเฉพาะ ปลอดภัย มั่นใจ ทุกการเดินทาง
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/tours"
              className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition duration-150 shadow-lg"
            >
              ดูโปรแกรมทัวร์ทั้งหมด
            </Link>
            <Link
              href="/contact-us"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/10 transition duration-150"
            >
              ปรึกษาเรา
            </Link>
          </div>
        </div>
      </header>

      {/* --- 3. Featured Tours Section (White Background, Red Accents) --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">โปรแกรมทัวร์แนะนำ</h2>
            <p className="text-lg text-gray-600">เลือกสรรทัวร์ยอดนิยมที่นักท่องเที่ยวประทับใจ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tour Card 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden group border border-gray-100">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                {/* Replace with real image: <img src="/tour1.jpg" alt="ทัวร์เกาะพีพี" className="w-full h-full object-cover group-hover:scale-110 transition duration-300"/> */}
                <span className="text-5xl">🏖️</span>
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">ยอดนิยม</div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition">ทัวร์เกาะพีพี-มายาเบย์ 1 วัน</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">ดำน้ำดูปะการัง สัมผัสหาดทรายขาวละเอียด ถ่ายรูปคู่กับอ่าวมายาในตำนาน</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-3xl font-bold text-red-600">฿1,500 <span className="text-sm text-gray-500 font-normal">/ท่าน</span></span>
                  <Link href="/tours/phiphi" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">รายละเอียด</Link>
                </div>
              </div>
            </div>

            {/* Tour Card 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden group border border-gray-100">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                {/* Replace with real image */}
                <span className="text-5xl">⛰️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition">สัมผัสลมหนาว ดอยอินทนนท์ 3 วัน 2 คืน</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">ชมพระอาทิตย์ขึ้นที่กิ่วแม่ปาน ไหว้พระธาตุคู่บารมี แวะตลาดม้ง</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-3xl font-bold text-red-600">฿4,900 <span className="text-sm text-gray-500 font-normal">/ท่าน</span></span>
                  <Link href="/tours/inthanon" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">รายละเอียด</Link>
                </div>
              </div>
            </div>

            {/* Tour Card 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden group border border-gray-100">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                {/* Replace with real image */}
                <span className="text-5xl">🛕</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition">ไหว้พระอยุธยา ตามรอยประวัติศาสตร์</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">ชมความงามวัดมหาธาตุ วัดไชยวัฒนาราม ลิ้มลองโรตีสายไหมชื่อดัง</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-3xl font-bold text-red-600">฿990 <span className="text-sm text-gray-500 font-normal">/ท่าน</span></span>
                  <Link href="/tours/ayutthaya" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">รายละเอียด</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/tours" className="text-red-600 font-bold hover:text-red-700 flex items-center justify-center group">
              ดูโปรแกรมทัวร์ทั้งหมด
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* --- 4. Call to Action Section (Red Background) --- */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">พร้อมสำหรับการผจญภัยครั้งใหม่หรือยัง?</h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            ติดต่อเราวันนี้เพื่อรับคำปรึกษาและออกแบบทัวร์ในฝันของคุณ Thaitan Tours พร้อมให้บริการคุณด้วยใจ
          </p>
          <Link
            href="/contact-us"
            className="bg-white text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition duration-150 shadow-2xl"
          >
            ติดต่อสอบถาม/จองทัวร์
          </Link>
        </div>
      </section>
    </div>

        </>
  );
}
