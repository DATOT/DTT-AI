import { Router, Response } from "express";
import { getUserById } from "../helpers";
import { AuthenticatedRequest } from "../types";
import { auth } from "../middleware/auth";

const router = Router();

// Get user profile
router.get("/:id", auth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;
  if (userId !== req.userId) return res.status(403).json({ error: "Forbidden" });

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
