import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const role = cookieStore.get('user_role')?.value;
    const userName = cookieStore.get('user_name')?.value || 'Guest';

    const allowedRoles = ['customer', 'booking', 'account', 'root', 'admin'];

    if (!token || !allowedRoles.includes(role || '')) {
        redirect('/auth');
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* เรียกใช้ Navbar Component */}
            <CustomerNavbar userName={userName} role={role || ''} />

            <div className="flex-1 flex max-w-7xl w-full mx-auto">
                {/* เรียกใช้ Sidebar Component */}
                <CustomerSidebar />

                {/* Content Area */}
                <main className="flex-1 p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
