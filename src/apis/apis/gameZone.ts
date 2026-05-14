import { request } from "@/utils/request";
import { GameZone, GameZonePlayResult } from "../types/gameZone";

export const gameZoneApi = {
  list: (page = 1, limit = 50, type?: string, level?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) params.set("type", type);
    if (level) params.set("level", level);
    return request<{ data: GameZone[]; total: number; page: number; totalPages: number }>(
      `/game-zones?${params}`
    );
  },

  play: (id: string, body: { playerName: string; level: string }) =>
    request<{ data: GameZonePlayResult }>(`/game-zones/${id}/play`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
