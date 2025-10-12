import { Router, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getChatsForUser, createChat } from "../helpers";
import { AuthenticatedRequest, CreateChatBody } from "../types";
import { auth } from "../middleware/auth";

const router = Router();

// Get chats for user
router.get("/:userId", auth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.userId;
  if (userId !== req.userId) return res.status(403).json({ error: "Forbidden" });

  try {
    const chats = await getChatsForUser(userId);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Create chat
router.post("/", auth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, members = [], type } = req.body as CreateChatBody;
  const creatorId = req.userId!;
  if (!members.includes(creatorId)) members.push(creatorId);

  const chatId = uuidv4();
  try {
    await createChat({ chatId, name, type, members });
    res.json({ id: chatId, name, type, members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

export default router;
