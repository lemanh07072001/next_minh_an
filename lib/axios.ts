import axios from "axios";
import { getSession, signOut } from "next-auth/react";

// Đọc locale từ cookie client
function getLocaleFromCookie(): string {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : "vi";
  }
  return "vi";
}

let isLoggingOut = false;

export function createApiInstance(token?: string) {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_API_BACKEND,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // ✅ Thêm token và locale vào mỗi request
  instance.interceptors.request.use(async (config) => {
    const session = await getSession();
    const locale = getLocaleFromCookie();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    config.headers["X-Locale"] = locale;

    return config;
  });

  // ✅ Nếu token sai → gọi logout Laravel + signOut
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isLoggingOut
      ) {
        originalRequest._retry = true;

        try {
          const session = await getSession();
          const token = session?.accessToken;

          if (token) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_URL_API_BACKEND}/auth/logout`,
              null,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );
          }
        } catch (logoutError) {
          console.warn("⚠️ Logout Laravel failed:", logoutError);
        }

        isLoggingOut = true;
        await signOut({ redirect: false });
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}