import { request } from "@/utils/request";
import { PublicProfile, PublicNetworkPost } from "../types/user";

export const userApi = {
  getPublicProfile: (id: string) =>
    request<{
      profile: PublicProfile;
      posts: PublicNetworkPost[];
      postsTotal: number;
      postsPage: number;
      postsTotalPages: number;
    }>(`/users/${id}/public`),
};
