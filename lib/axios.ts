import axios from "axios";
import { signOut } from "next-auth/react";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API });

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
}

api.interceptors.request.use(async (config) => {
  // Lấy accessToken mỗi lần
  const sess = await fetch("/api/auth/session").then(r => r.json());
  if (sess?.accessToken) {
    config.headers.Authorization = `Bearer ${sess.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    // Nếu lỗi 401 & chưa retry & không phải chính /auth/refresh
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            original.headers.Authorization = `Bearer ${token}`;
            return axios(original);
          })
          .catch(e => Promise.reject(e));
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post("/api/auth/refresh");
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        signOut({ callbackUrl: "/login" });
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;