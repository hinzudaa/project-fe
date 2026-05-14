export interface NetworkPostAuthor {
  _id: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export interface NetworkPost {
  _id: string;
  title: string;
  description: string;
  image?: { url: string; blurHash?: string };
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  createdBy: NetworkPostAuthor;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  isEdited: boolean;
  category?: "breakup" | "friends";
  likedByMe: boolean;
}

export interface NetworkComment {
  _id: string;
  post: string;
  user: NetworkPostAuthor;
  message: string;
  source: "user" | "ai";
  isAiGenerated: boolean;
  createdAt: string;
}
