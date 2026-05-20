import { request } from "@/utils/request";
import { AuthResponse, AuthUser, PhoneInitResponse, PhoneStatusResponse } from "../types/auth";

export const authApi = {
  login: (body: { phone: string }) =>
    request<PhoneInitResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body: { phone: string; gender: string }) =>
    request<PhoneInitResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  phoneStatus: (verificationId: string) =>
    request<PhoneStatusResponse>(`/auth/phone/status/${verificationId}`),

  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),

  me: async (): Promise<AuthUser> => {
    const res = await request<{ user?: AuthUser } & Record<string, unknown>>("/auth/me");
    return (res.user ?? res) as AuthUser;
  },
};
