import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { verifyToken } from "../helpers";

export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });

  const token = header.split(" ")[1];
  const userId = verifyToken(token);
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  req.userId = userId;
  next();
};
