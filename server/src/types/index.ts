import { Request } from "express";

// Extend Request to include userId for authenticated routes
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Request body types
export interface RegisterBody {
  email: string;
  username: string;
  name?: string;
  password: string;
  retypedPassword: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface CreateChatBody {
  name: string;
  members?: string[];
  type: "direct" | "group" | "bot";
}

export interface SendMessageBody {
  chatId: string;
  text: string;
}
