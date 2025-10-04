import { ReactNode } from "react";

export enum Sender {
  User = "user",
  Bot = "bot",
  OtherUser = "otherUser",
}

export interface Message {
  sender: Sender;
  text: string;
  time: string | Date;
  senderName?: string;
  
  isStreaming?: boolean;
}