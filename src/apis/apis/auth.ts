import { request } from "@/utils/request";
import { AuthResponse, AuthUser } from "../types/auth";

export const authApi = {
  register: (body: { phone: string; name: string; gender: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { phone: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),

  me: () =>
    request<AuthUser>("/auth/me"),
};
