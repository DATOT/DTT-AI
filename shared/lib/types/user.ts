export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: Date;
  friends?: string[];
  chatIds?: string[];
}
