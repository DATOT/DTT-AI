import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { Ollama } from "ollama"; // Ollama JS client
import fs from "fs";
import path from "path";

// --------------------------
// Setup
// --------------------------
const app = express();
const port = 3001;

app.use(express.json());
app.use(
  cors({
    origin: "*", // or ["http://localhost:3000"]
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const MAX_HISTORY = 20;

// --------------------------
// Types
// --------------------------
interface Message {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  history?: Message[];
  system_message?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

// --------------------------
// State
// --------------------------
const chatHistories: Map<string, Message[]> = new Map();
const ollama = new Ollama();

// --------------------------
// Routes
// --------------------------

// Streaming Chat Endpoint
app.put("/chat/:chatID", async (req: Request, res: Response) => {
  const chatID = req.params.chatID;

  console.log(`Got signal from chat with ID: ${chatID}`);

  // Init history
  if (!chatHistories.has(chatID)) {
    chatHistories.set(chatID, []);
  }

  const body: ChatRequest = req.body;
  const history = chatHistories.get(chatID)!;

  history.push({ role: "user", content: body.message });
  if (history.length > MAX_HISTORY) {
    chatHistories.set(chatID, history.slice(-MAX_HISTORY));
  }

  const messages: Message[] = [
    {
      role: "system",
      content:
        body.system_message || "You are a friendly Chatbot that is named Chou.",
    },
    ...history,
  ];

  // Streaming headers
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    let fullReply = "";

    const stream = await ollama.chat({
      model: "phi",
      messages,
      stream: true,
      options: {
        temperature: body.temperature ?? 0.7,
        top_p: body.top_p ?? 0.95,
        num_predict: body.max_tokens ?? 512,
      },
    });

    for await (const chunk of stream) {
      const token = chunk.message?.content || "";
      fullReply += token;
      res.write(token);
    }

    // Save assistant reply
    history.push({ role: "assistant", content: fullReply });
    res.end();
  } catch (e: any) {
    res.write(`\n[Error: ${e.message}]`);
    res.end();
  }
});

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "Server is running with Ollama Mistral!" });
});

// Favicon
app.get("/favicon.ico", (_req: Request, res: Response) => {
  const file = path.join(__dirname, "favicon.ico");
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.status(404).end();
  }
});

// --------------------------
// Start
// --------------------------
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
