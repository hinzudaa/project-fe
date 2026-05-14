import { request } from "@/utils/request";
import { ChatRoom, ChatMessage } from "../types/chat";

export const chatApi = {
  listChats: () =>
    request<{ data: ChatRoom[]; total: number }>("/chats?limit=50"),

  getMessages: (roomId: string, page = 1) =>
    request<{ data: ChatMessage[]; total: number; totalPages: number }>(
      `/chats/${roomId}/messages?page=${page}&limit=30`
    ),

  createDirect: (userId: string) =>
    request<{ data: ChatRoom }>("/chats/direct", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  sendMessage: (roomId: string, body: string) =>
    request<{ data: ChatMessage }>(`/chats/${roomId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  markRead: (roomId: string) =>
    request<{ success: boolean }>(`/chats/${roomId}/read`, { method: "POST" }),

  deleteChat: (roomId: string) =>
    request<{ success: boolean }>(`/chats/${roomId}`, { method: "DELETE" }),
};
