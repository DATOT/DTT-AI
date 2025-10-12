import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  getUserByUsername,
  hashPassword,
  insertUser,
  insertUserPassword,
  comparePassword,
  createToken,
  publicUser,
} from "../helpers";
import { RegisterBody, LoginBody } from "../types/index";

const router = Router();

// Register
router.post("/register", async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const { email, username, name, password, retypedPassword } = req.body;

  if (!username || !password || !retypedPassword)
    return res.status(400).json({ error: "Missing required fields" });

  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email" });

  if (password !== retypedPassword) return res.status(400).json({ error: "Passwords do not match" });

  const usernameRegex = /^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/;
  if (!usernameRegex.test(username)) return res.status(400).json({ error: "Invalid username" });

  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) return res.status(409).json({ error: "Username already exists" });

    const hashedPassword = await hashPassword(password);
    const id = uuidv4();

    await insertUser({ id, username, name });
    await insertUserPassword({ userId: id, hashedPassword, email });

    const token = createToken(id);

    res.status(201).json({
      user: { id, username, name: name || username, status: "online" },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ error: "Missing required fields" });

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.hashedPassword) return res.status(400).json({ error: "Forbidden" });

    const valid = await comparePassword(password, user.hashedPassword);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = createToken(user.id);
    res.status(200).json({ user: publicUser(user), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
