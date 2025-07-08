import axios from "axios";
import { getSession, signOut } from "next-auth/react";

// Hàm đọc cookie client-side
function getLocaleFromCookie(): string {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : "vi"; // fallback "vi"
  }
  return "vi";
}

let isLoggingOut = false;

export function createApiInstance(token?: string) {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_API_BACKEND_LOCAL,
    headers: token
        ? {
          Authorization: `Bearer ${token}`,
        }
        : {},
  });

  instance.interceptors.request.use(async (config) => {
    const session = await getSession();
    const locale = getLocaleFromCookie();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    config.headers["X-Locale"] = locale;

    return config;
  });

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
        isLoggingOut = true;

        await signOut();
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}
