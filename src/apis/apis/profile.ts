import { BASE_URL_CONSTANT } from "@/utils/request";
import { request } from "@/utils/request";
import { AuthUser } from "../types/auth";

export const profileApi = {
  updateAvatar: async (file: File): Promise<{ data: { user: AuthUser; image: { url: string } } }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE_URL_CONSTANT}/users/me/avatar`, {
      method: "PUT",
      credentials: "include",
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
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? "Алдаа гарлаа");
    return { url: data?.data?.image?.url ?? data?.data?.user?.avatar ?? "" };
  },
};
