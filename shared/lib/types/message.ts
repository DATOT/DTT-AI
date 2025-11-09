import { SenderTypes } from "./enums";

export interface Sender {
  type: SenderTypes;
  senderId: string;
  senderName?: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  time: Date;
  isStreaming?: boolean;
  attachments?: string[];
  seenBy?: string[];
  reactions?: Record<string, string[]>;
}
