import { BASE_URL_CONSTANT, getAuthToken } from "@/utils/request";
import { request } from "@/utils/request";
import { AuthUser } from "../types/auth";

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const profileApi = {
  updateAvatar: async (file: File): Promise<{ data: { user: AuthUser; image: { url: string } } }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE_URL_CONSTANT}/users/me/avatar`, {
      method: "PUT",
      credentials: "include",
      headers: authHeaders(),
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? "Алдаа гарлаа");
    return data;
  },

  updateMyProfile: (body: any) => {
    if (body instanceof FormData) {
      return fetch(`${BASE_URL_CONSTANT}/users/me/profile`, {
        method: "PUT",
        credentials: "include",
        headers: authHeaders(),
        body,
      }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message ?? "Алдаа гарлаа");
        return data as AuthUser;
      });
    }
    return request<AuthUser>("/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE_URL_CONSTANT}/users/me/avatar`, {
      method: "PUT",
      credentials: "include",
      headers: authHeaders(),
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? "Алдаа гарлаа");
    return { url: data?.data?.image?.url ?? data?.data?.user?.avatar ?? "" };
  },
};
