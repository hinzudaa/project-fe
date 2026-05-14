export interface ChatRoom {
  _id: string;
  type: "direct" | "group";
  title?: string;
  memberCount: number;
  lastMessage?: { _id: string; body: string; sender: any; createdAt: string } | null;
  unread: boolean;
  counterpart?: { _id: string; username?: string; name?: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  room: string;
  sender: { _id: string; username?: string; name?: string; avatar?: string };
  type: string;
  body: string;
  createdAt: string;
}
