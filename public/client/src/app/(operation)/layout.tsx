import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import BookingSidebar from '@/components/BookingSidebar';

export default async function BookingLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const role = cookieStore.get('user_role')?.value;
    const token = cookieStore.get('token')?.value;

  // ป้องกันชั้นที่ 2 นอกจาก Middleware (เผื่อ Middleware หลุด)
  if (!token || (role !== 'booking' && role !== 'root')) {
    redirect('/auth');
  }

  return (

        <>

                <div className="flex min-h-screen">

                {/*  <BookingSidebar /> */}{/* Sidebar เฉพาะของ Admin */}
                    <main className="flex-1 p-6 bg-gray-50">
                        <header className="h-16 border-b border-white/5 flex items-center px-8 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                            <span className="text-gray-400">Booking Panel / Current Page</span>
                        </header>

                        <div className="p-8">
                            {children}
                        </div>
                    </main>
                </div>
        </>
  );
}
