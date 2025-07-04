import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export function createApiInstance() {
  const instance = axios.create({
    baseURL: 'https://api.minhan.online/api',
    headers: {
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          await signOut(); // Hoặc tự động refresh token ở đây
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
  );

  return instance;
}
