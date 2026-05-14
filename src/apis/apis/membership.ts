import { request } from "@/utils/request";
import { MembershipPlan, PurchaseResponse, MembershipStatus } from "../types/membership";

export const membershipApi = {
  getPlans: () =>
    request<{ plans: MembershipPlan[] }>("/membership/plans"),

  purchase: (planId: string) =>
    request<PurchaseResponse>("/membership/purchase", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),

  getStatus: (membershipId?: string) =>
    request<MembershipStatus>(
      membershipId ? `/membership/status?membershipId=${membershipId}` : "/membership/status"
    ),
};
