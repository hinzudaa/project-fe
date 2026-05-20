export interface AuthUser {
  _id: string;
  name?: string;
  username?: string;
  phone?: string;
  gender?: string;
  role?: string;
  city?: string;
  birthYear?: number;
  bio?: string;
  interests?: string[];
  avatar?: string;
  photos?: string[];
  membershipExpiresAt?: string;
}

export interface PhoneVerification {
  verificationId: string;
  phone: string;
  status: "pending" | "verified" | "expired" | "failed";
  shortcode?: string;
  smsUri?: string;
  displayInstruction?: string;
  expiresAt: string;
}

export interface PhoneInitResponse {
  phoneVerification: PhoneVerification;
}

/** Pending: no user. Verified: signIn already ran, user + token present. */
export type PhoneStatusResponse =
  | { phoneVerification: PhoneVerification; user?: undefined }
  | { phoneVerification: PhoneVerification; user: AuthUser; tokenType: string; token: string; sessionScope: string };

export interface AuthResponse {
  user: AuthUser;
  phoneVerification?: PhoneVerification;
}
