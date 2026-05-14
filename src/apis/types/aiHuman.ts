export interface AIHumanImage {
  _id: string;
  url: string;
  blurHash?: string | null;
}

export interface AIHumanConversation {
  _id: string;
  persona: string;
  user: string;
  behaviorPrompt?: string | null;
  lastMessageAt?: string | null;
  lastMessagePreview?: string | null;
  lastMessageRole?: "user" | "assistant" | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIHuman {
  _id: string;
  image: AIHumanImage | null;
  name: string;
  age?: number | null;
  gender: string;
  badge: string[];
  shortBio: string;
  prompt: string;
  greeting?: string | null;
  model: string;
  isActive: boolean;
  canChat?: boolean;
  conversation: AIHumanConversation | null;
}

export interface AIHumanMessage {
  _id: string;
  conversation: string;
  persona: string;
  role: "user" | "assistant";
  content: string;
  model?: string | null;
  createdAt: string;
}

export interface AIHumanQuota {
  tier: string;
  limit: number;
  used: number;
  remaining: number | null;
  unlimited: boolean;
  resetAt: string;
}
