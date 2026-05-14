import { request } from "@/utils/request";
import { AIHuman, AIHumanQuota, AIHumanConversation, AIHumanMessage } from "../types/aiHuman";

export const aiHumanApi = {
  list: (page = 1, limit = 20) =>
    request<{ data: AIHuman[]; total: number; page: number; totalPages: number; canChat: boolean; quota: AIHumanQuota | null }>(
      `/ai-humans?page=${page}&limit=${limit}`
    ),

  getDetail: (id: string) =>
    request<{ data: AIHuman; quota: AIHumanQuota | null }>(`/ai-humans/${id}`),

  getHistory: (id: string, page = 1, limit = 50) =>
    request<{ persona: AIHuman; conversation: AIHumanConversation | null; data: AIHumanMessage[]; total: number; totalPages: number; quota: AIHumanQuota | null }>(
      `/ai-humans/${id}/history?page=${page}&limit=${limit}`
    ),

  chat: (id: string, body: { message: string; behaviorPrompt?: string }) =>
    request<{ persona: AIHuman; conversation: AIHumanConversation; userMessage: AIHumanMessage; assistantMessage: AIHumanMessage; quota: AIHumanQuota | null }>(
      `/ai-humans/${id}/chat`,
      { method: "POST", body: JSON.stringify(body) }
    ),

  deleteChat: (id: string) =>
    request<{ success: boolean; deleted: boolean }>(`/ai-humans/${id}/chat`, { method: "DELETE" }),
};
