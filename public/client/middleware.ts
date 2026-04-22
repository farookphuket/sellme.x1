import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. ถ้าไม่มี Token และพยายามเข้าหน้าอื่นๆ ที่ไม่ใช่ auth/Signup
  if (!token && !['/auth', '/signup', '/forgot'].includes(pathname)) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 2. ระบบป้องกันการเข้าข้ามสายงาน (Role-based Access Control)

  // ป้องกัน Customer เข้าหน้า Admin/Staff/Account
  if (role === 'customer' && (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/management') ||
      pathname.startsWith('/finance') ||
      pathname.startsWith('/workspace')
  )) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // ป้องกัน Staff เข้าหน้า Admin หรือ Finance
  if (role === 'staff' && (pathname.startsWith('/admin') || pathname.startsWith('/finance'))) {
    return NextResponse.redirect(new URL('/workspace/tasks', request.url));
  }

  // 3. ถ้า auth แล้ว แต่จะกลับไปหน้า Login อีก ให้ดีดไปหน้าตาม Role ของตัวเอง
  if (token && pathname === '/auth') {
     // ใช้ logic เดียวกับ getRedirectPath ที่เราทำไว้ก่อนหน้านี้
     return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

// กำหนดว่า Middleware นี้จะทำงานกับ Path ไหนบ้าง
export const config = {
  matcher: [
    '/admin/:path*',
    '/management/:path*',
    '/finance/:path*',
    '/workspace/:path*',
    '/profile/:path*',
    '/auth',
  ],
};
