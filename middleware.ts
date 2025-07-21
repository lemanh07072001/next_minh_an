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
  /^\/admin(\/(?!login|register).*)?$/,
  /^\/user(\/.*)?$/,
  /^\/product(\/.*)?$/,
  /^\/image(\/.*)?$/,
  /^\/setting(\/.*)?$/,
];

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 🌐 Xác định locale prefix (vi, en, ...)
  const localePrefix = routing.locales.find((locale) =>
      pathname.startsWith(`/${locale}`)
  );
  const strippedPathname = localePrefix
      ? pathname.replace(`/${localePrefix}`, '')
      : pathname;

  const basePath = localePrefix ? `/${localePrefix}` : '';

  // ✅ Nếu đã đăng nhập mà vào trang login → chuyển về dashboard
  if (token && strippedPathname === PATHS.LOGIN) {
    return NextResponse.redirect(new URL(`${basePath}${PATHS.DASHBOARD}`, req.url));
  }

  // ✅ Chưa đăng nhập mà vào route cần bảo vệ
  const isProtected =
      PROTECTED_PATHS.some((pattern) => pattern.test(strippedPathname)) &&
      !PUBLIC_PATHS.includes(strippedPathname);

  if (!token && isProtected) {
    const loginUrl = new URL(`${basePath}${PATHS.LOGIN}`, req.url);

    // Tránh callbackUrl bị vòng lặp nếu đang là login
    if (strippedPathname !== PATHS.LOGIN) {
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  // ✅ Mọi trường hợp khác → xử lý i18n
  return intlMiddleware(req);
}

// ✅ Matcher để middleware chỉ áp dụng với route frontend
export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
