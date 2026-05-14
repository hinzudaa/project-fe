export interface AuthUser {
  _id: string;
  name?: string;
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

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
