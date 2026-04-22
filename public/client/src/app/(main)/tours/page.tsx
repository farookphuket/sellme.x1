"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios"; // ใช้ axios instance ที่เราสร้างไว้คราวก่อน

// กำหนด Type ของข้อมูลทัวร์
interface Tour {
  id: number;
  title: string;
  description: string;
  price: number;
}

export default function TourListPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลจาก Laravel API
    api.get("/tours")
      .then((res) => {
        setTours(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tours:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">กำลังโหลดข้อมูลทัวร์...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          โปรแกรมทัวร์ยอดนิยม ✈️
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-blue-200 flex items-center justify-center">
                {/* จำลองรูปภาพ ถ้ามีรูปจริงใช้ <img src={tour.image} /> */}
                {<img src={tour.image} /> }
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                                        Adult
                    ฿{Number(tour.price).toLocaleString()} kid (5-13 years) price {Number((tour.price/2)+1).toLocaleString().replaceAll('./\g',"x")}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    จองเลย
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <p className="text-center text-gray-500 mt-10">ยังไม่มีข้อมูลทัวร์ในขณะนี้</p>
        )}
      </div>
    </div>
  );
}
