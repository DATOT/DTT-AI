import React, { useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import styles from "./MessageBubble.module.css"; // pick any theme

import MessageBubble from "./MessageBubble";
import { Message } from "@/app/lib/types";

interface MessageAreaProps {
  messages: Message[];
}

// configure marked to highlight code
import "highlight.js/styles/github-dark.css";

marked.use({
  renderer: {
    code({ text, lang }: any) {
      const language = hljs.getLanguage(lang || "") ? lang! : "plaintext";
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language} mockup-code w-full">${highlighted}</code></pre>`;
    },
  },
});

const MessageArea = ({ messages }: MessageAreaProps) => {
  hljs.registerLanguage(
    "javascript",
    require("highlight.js/lib/languages/javascript")
  );
  hljs.registerLanguage(
    "typescript",
    require("highlight.js/lib/languages/typescript")
  );
  useEffect(() => {
    // re-run highlighting in case something slipped
    hljs.highlightAll();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          sender={msg.sender}
          time={msg.time}
          senderName={msg.senderName}
        >
          <span dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
        </MessageBubble>
      ))}
    </div>
  );
};

export default MessageArea;
