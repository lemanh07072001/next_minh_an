import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// Định nghĩa các hằng số cho đường dẫn
const PATHS = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
};

// Tạo middleware cho next-intl
const intlMiddleware = createMiddleware(routing);

// Hàm middleware chính
export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Nếu đã đăng nhập và cố truy cập trang login, chuyển hướng về dashboard
  if (token && pathname.endsWith(PATHS.LOGIN)) {
    console.log('Redirecting to dashboard from login');
    return NextResponse.redirect(new URL(PATHS.DASHBOARD, req.url));
  }

  // Nếu chưa đăng nhập và cố truy cập trang dashboard, chuyển hướng về login
  if (!token && pathname.endsWith(PATHS.DASHBOARD)) {
    console.log('Redirecting to login from dashboard');
    return NextResponse.redirect(new URL(PATHS.LOGIN, req.url));
  }

  // Áp dụng middleware của next-intl cho các yêu cầu khác
  return intlMiddleware(req);
}

// Cấu hình matcher để áp dụng middleware
export const config = {
  matcher: [
    // Áp dụng cho các đường dẫn không phải API, static files, hoặc các tài nguyên khác
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Chuỗi tĩnh cho login và dashboard
    '/admin/login',
    '/admin/dashboard/:path*',
  ],
};