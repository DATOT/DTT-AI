// src/types/creators.ts
import { v4 as uuidv4 } from "uuid";
import { ChatType } from "./enums";
import { User } from "./user";
import { UserChat, BotChat } from "./chat";

// Create a user
export function createUser(name: string, username: string, avatar?: string): User {
  return {
    id: uuidv4(),
    username,
    name,
    avatar,
    status: "offline",
    lastSeen: new Date(),
    friends: [],
    chatIds: [],
  };
}

// Create a direct or group chat
export function createUserChat(members: string[], name: string, isGroup = false): UserChat {
  return {
    id: uuidv4(),
    type: isGroup ? ChatType.Group : ChatType.Direct,
    name,
    members,
    messages: [],
    lastUpdated: new Date(),
  };
}

// Create a bot chat
export function createBotChat(name: string): BotChat {
  return {
    id: uuidv4(),
    type: ChatType.Bot,
    name,
    messages: [],
    lastUpdated: new Date(),
  };
}
