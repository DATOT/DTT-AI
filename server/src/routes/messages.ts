import { Router, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getChatById, getUserById, insertUserMessage, updateChatLastUpdate } from "../helpers";
import { AuthenticatedRequest, SendMessageBody } from "../types";
import { auth } from "../middleware/auth";

const router = Router();

// Send message
router.post("/", auth, async (req: AuthenticatedRequest, res: Response) => {
  const { chatId, text } = req.body as SendMessageBody;
  const senderId = req.userId!;

  try {
    const chat = await getChatById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const sender = await getUserById(senderId);
    if (!sender) return res.status(404).json({ error: "Sender not found" });

    const messageId = uuidv4();
    await insertUserMessage(chatId, messageId, senderId, sender.name, text);
    await updateChatLastUpdate({ chatId });

    res.json({ id: messageId, chatId, senderId, text });

    if (chat.type === "bot") console.log("Bot chat placeholder triggered");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
