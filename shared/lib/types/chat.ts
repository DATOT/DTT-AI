import { ChatType } from "./enums";
import { Message } from "./message";

export interface ChatBase {
  id: string;
  name: string;
  messages: Message[];
  lastUpdated: Date;
  type: ChatType;
}

export interface UserChat extends ChatBase {
  type: ChatType.Direct | ChatType.Group;
  members: string[];
  groupAvatar?: string;
}

export interface BotChat extends ChatBase {
  type: ChatType.Bot;
}
