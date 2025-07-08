import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const PATHS = {
  LOGIN: '/admin/login',
  REGISTER: '/admin/register',
  DASHBOARD: '/admin/dashboard',
};

const PUBLIC_PATHS = [
  PATHS.LOGIN,
  PATHS.REGISTER,
];

const PROTECTED_PATHS = [
  /^\/admin(\/(?!login|register).*)?$/,  // /admin/* nhưng loại /login và /register
  /^\/user(\/.*)?$/,
  /^\/product(\/.*)?$/,
  /^\/image(\/.*)?$/,
  /^\/setting(\/.*)?$/,
];

const intlMiddleware = createMiddleware(routing);

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 🌐 Xử lý locale trong URL nếu có
  const localePrefix = routing.locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  );
  const strippedPathname = localePrefix
    ? pathname.replace(`/${localePrefix}`, '')
    : pathname;

  // ✅ Đã login nhưng cố vào trang login
  if (token && strippedPathname === PATHS.LOGIN) {
    return NextResponse.redirect(new URL(PATHS.DASHBOARD, req.url));
  }

  // ✅ Chưa login mà vào route bảo vệ
  const isProtected =
    PROTECTED_PATHS.some((pattern) => pattern.test(strippedPathname)) &&
    !PUBLIC_PATHS.includes(strippedPathname);

  if (!token && isProtected) {
    return NextResponse.redirect(new URL(PATHS.LOGIN, req.url));
  }

  // ✅ Mọi trường hợp khác xử lý i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};