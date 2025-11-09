import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION_TIME =
  (process.env.JWT_EXPIRATION_TIME as jwt.SignOptions["expiresIn"]) || "1h";

// Create JWT token
export function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
}

// Verify token and return userId
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}
