export interface AppNotification {
  _id: string;
  type: "chat_invite" | "chat_message" | "membership_activated" | "article_published" | "advisor_published" | "system_announcement" | string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}
