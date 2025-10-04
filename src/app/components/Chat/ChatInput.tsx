"use client";

import React from "react";

interface ChatInputProps {
  onSendButtonClicked?: (content?: string) => void;
  onStopToggleClicked?: () => void;
  isStopping: boolean;
}

const ChatInput = ({ onSendButtonClicked, onStopToggleClicked, isStopping }: ChatInputProps) => {
  const [content, setContent] = React.useState("");

  const HandleSend = () => {
    if (isStopping) {
      if (!onStopToggleClicked) return;
      onStopToggleClicked();
      return;
    }

    if (!onSendButtonClicked) return;
    if (content.trim()) {
      onSendButtonClicked(content);
      setContent("");
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-base-100 bg-base-300 border-t-2">
      <textarea
        className="textarea textarea-bordered flex-1 resize-none"
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button
        className={`btn rounded-2xl mr-2 ${isStopping ? "btn-neutral" : "btn-primary"}`}
        onClick={HandleSend}
      >
        {isStopping ? "Stop" : "Send"}
      </button>
    </div>
  );
};

export default ChatInput;
