import { request } from "@/utils/request";
import { SwipeUser, SwipeQuota, SwipeResult } from "../types/swipe";

export const swipeApi = {
  getFeed: (page = 1, limit = 10) =>
    request<{ data: SwipeUser[]; total: number; page: number; totalPages: number; quota: SwipeQuota }>(
      `/swipes/feed?page=${page}&limit=${limit}`
    ),

  getFeedSingle: () =>
    request<{ data: SwipeUser[]; total: number; quota: SwipeQuota }>("/swipes/feed?limit=1"),

  performSwipe: (targetId: string, action: "like" | "pass") =>
    request<SwipeResult>(`/swipes/${targetId}`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),

  getQuota: () =>
    request<{ quota: SwipeQuota }>("/swipes/quota"),

  getMatches: () =>
    request<{ data: { _id: string; matchedAt: string; target: SwipeUser }[]; total: number }>("/swipes/matches?limit=5"),

  getLikes: () =>
    request<{ data: { _id: string; likedAt: string; user: SwipeUser }[]; total: number }>("/swipes/likes?limit=6"),

  getLikesFull: (page = 1, limit = 20) =>
    request<{ data: { _id: string; likedAt: string; user: SwipeUser }[]; total: number; page: number; totalPages: number }>(
      `/swipes/likes?page=${page}&limit=${limit}`
    ),
};
