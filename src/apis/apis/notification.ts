import { request } from "@/utils/request";
import { AppNotification } from "../types/notification";

export const notificationApi = {
  list: (page = 1, limit = 30) =>
    request<{ data: AppNotification[]; total: number; page: number; totalPages: number }>(
      `/notifications?page=${page}&limit=${limit}`
    ),

  markRead: (id: string) =>
    request<{ data: AppNotification }>(`/notifications/${id}/read`, { method: "POST" }),

  markAllRead: () =>
    request<{ success: boolean }>("/notifications/read", { method: "POST" }),
};
