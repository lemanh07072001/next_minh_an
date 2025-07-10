// lib/fetcher.ts

type FetchOptions = {
  token?: string;
  locale?: string;
  theme?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
};

export async function fetchFromApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const {
    token,
    locale = 'vi',
    theme,
    method = 'GET',
    body,
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Locale": locale,
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (theme) headers["X-Theme"] = theme;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API_BACKEND}${endpoint}`, {
      method,
      headers,
      cache: "no-store",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      throw new Error(`Error fetching ${endpoint}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return null;
  }
}