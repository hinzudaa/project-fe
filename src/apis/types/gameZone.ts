export interface GameZone {
  _id: string;
  image: { _id: string; url: string; blurHash?: string | null } | null;
  title: string;
  description?: string | null;
  type: string;
  level: string;
  responseMode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameZonePlayResult {
  game: GameZone;
  playerName: string;
  selectedLevel: string;
  response: string;
  model: string;
}
