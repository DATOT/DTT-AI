"use client";
import React, { useState, useEffect } from "react";
import MessageArea from "./MessageArea";
import ChatInput from "./ChatInput";
import { sendMessageToAPI } from "@/app/lib/api";
import { Sender, Message } from "@/app/lib/types";
import { v4 as uuidv4 } from "uuid";

const chatId = uuidv4();

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStopping, setIsStopping] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  function addMessage(
    sender: Sender,
    time: string | Date,
    text: string,
    senderName?: string
  ) {
    setMessages((prev) => [...prev, { sender, time, text, senderName }]);
  }

  const handleSendButtonClicked = async (content?: string) => {
    if (!content) return;

    // Add user message
    addMessage(Sender.User, new Date(), content);

    // Add placeholder for assistant
    let assistantIndex = -1;
    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { sender: Sender.Bot, time: new Date(), text: "..." }];
    });
    let dotInterval = setInterval(() => {
      setMessages((prev) => {
        const updated = [...prev];
        if (assistantIndex >= 0 && assistantIndex < updated.length) {
          let current = updated[assistantIndex].text;
          if (current == "." || current == ".." || current == "...") {
            if (current.length >= 3) {
              updated[assistantIndex].text = ".";
            } else {
              updated[assistantIndex].text = "." + current;
            }
          }
        }
        return updated;
      });
    }, 500);

    // Switch button → Stop
    setIsStopping(true);

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    await sendMessageToAPI(
      chatId,
      content,
      (chunk) => {
        clearInterval(dotInterval); // stop animation once real text arrives
        setMessages((prev) => {
          const updated = [...prev];
          if (assistantIndex >= 0 && assistantIndex < updated.length) {
            // replace dots if still there, then append chunk
            let current = updated[assistantIndex].text;
            if (current == "." || current == ".." || current == "...") current = "";
            updated[assistantIndex] = {
              ...updated[assistantIndex],
              text: current + chunk,
            };
          }
          return updated;
        });
      },
      () => {
        clearInterval(dotInterval); // also stop when stream ends
        setIsStopping(false);
      },
      abortControllerRef.current.signal
    );
  };

  const handleStopToggleClicked = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStopping(false);
  };

  return (
    <div className="flex flex-col h-screen rounded-lg bg-base-300">
      <MessageArea messages={messages} />
      <ChatInput
        onSendButtonClicked={handleSendButtonClicked}
        onStopToggleClicked={handleStopToggleClicked}
        isStopping={isStopping}
      />
    </div>
  );
};

export default Chat;
