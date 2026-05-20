const BASE_URL = "https://projectm.zuraach.site";

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message ?? "Алдаа гарлаа");
  }

  return data as T;
}

export const BASE_URL_CONSTANT = BASE_URL;
