import React, { ReactNode } from "react";
import { Sender } from "@/app/lib/types";

interface MessageBubbleProps {
  sender: Sender;
  senderName?: string;

  time: string | Date;
  children?: ReactNode;
}

const MessageBubble = ({
  sender,
  senderName,
  time,
  children,
}: MessageBubbleProps) => {
  const formattedTime =
    typeof time === "string"
      ? time
      : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const chatAlignment = sender == Sender.User ? "chat-end" : "chat-start";
  const color =
    sender == Sender.User ? "chat-bubble-primary" : "chat-bubble-secondary";

  return (
    <>
      <div className={`chat ${chatAlignment}`}>
        <div className="chat-header">
          <div className="text-sm">{senderName}</div>
        </div>
        <div className={`chat-bubble ${color} break-words max-w-[75%] w-fit`}> {children} </div>
        <div className="chat-footer">
          <time className="text-xs opacity-50 select-none">{formattedTime}</time>
        </div>
      </div>
    </>
  );
};

export default MessageBubble;
