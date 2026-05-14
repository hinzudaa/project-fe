export interface PublicProfile {
  _id: string;
  username?: string;
  name?: string;
  avatar?: string;
  gender?: string;
  age?: number;
  exp?: number;
  level?: { level: number; title: string } | null;
  nextLevel?: { level: number; title: string; requiredExp: number } | null;
  createdAt?: string;
  bio?: string;
  city?: string;
  birthYear?: number;
  interests?: string[];
  photos?: string[];
}

export interface PublicNetworkPost {
  _id: string;
  title: string;
  description: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isEdited: boolean;
}
