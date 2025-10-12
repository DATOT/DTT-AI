import { SYSTEM_PROMPT } from "./constants";

export async function sendMessageToAPI(
  chatId: string,
  text: string,
  onChunk: (chunk: string) => void,
  onDone?: () => void,
  signal?: AbortSignal
) {
  const res = await fetch(`http://127.0.0.1:3001/chat/${chatId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      history: [],
      system_message: SYSTEM_PROMPT,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.95,
    }),
    signal,
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (err) {
    if ((err as any).name === "AbortError") {
      console.log("Stream aborted by user.");
    } else {
      console.error("Stream error:", err);
    }
  } finally {
    if (onDone) onDone();
  }
}