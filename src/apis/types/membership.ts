export interface MembershipPlan {
  _id: string;
  title: string;
  description?: string;
  months: number;
  price: number;
  tier: string;
  swipeDailyLimit: number;
  aiHumanDailyMessageLimit: number;
  movieComplimentaryQuota: number;
  sortOrder: number;
  image?: { _id: string; url: string };
}

export interface QPayUrl {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QPayInvoice {
  invoice_id: string;
  qr_image: string;
  qr_text: string;
  urls: QPayUrl[];
  shortlink?: string;
}

export interface PurchaseResponse {
  membershipId: string;
  invoice: QPayInvoice;
  orderId: string;
  plan: MembershipPlan;
  status: string;
}

export interface MembershipStatus {
  active: boolean;
  membership?: {
    _id: string;
    status: string;
    planTitle?: string;
    expiresAt?: string;
  };
}
