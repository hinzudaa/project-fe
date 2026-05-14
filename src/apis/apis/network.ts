import { request } from "@/utils/request";
import { NetworkPost, NetworkComment } from "../types/network";

export const networkApi = {
  listPosts: (page = 1, limit = 20, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    return request<{ data: NetworkPost[]; total: number; page: number; totalPages: number }>(
      `/network/posts?${params}`
    );
  },

  createPost: (body: { title: string; description: string; category?: "breakup" | "friends" }) =>
    request<{ data: NetworkPost }>("/network/posts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  likePost: (id: string) =>
    request<{ success: boolean }>(`/network/posts/${id}/like`, { method: "POST" }),

  unlikePost: (id: string) =>
    request<{ success: boolean }>(`/network/posts/${id}/like`, { method: "DELETE" }),

  listComments: (postId: string, page = 1) =>
    request<{ data: NetworkComment[]; total: number; totalPages: number }>(
      `/network/posts/${postId}/comments?page=${page}&limit=20`
    ),

  createComment: (postId: string, message: string) =>
    request<{ data: NetworkComment }>(`/network/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  deletePost: (id: string) =>
    request<{ success: boolean }>(`/network/posts/${id}`, { method: "DELETE" }),

  deleteComment: (id: string) =>
    request<{ success: boolean }>(`/network/comments/${id}`, { method: "DELETE" }),
};
