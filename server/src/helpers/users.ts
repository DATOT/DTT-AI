import bcrypt from "bcrypt";
import { pool } from "./db";
import { User } from "@shared/lib/types/index";

export interface PrivateUser extends User {
  hashedPassword: string;
  email?: string;
}

// Remove sensitive info before sending to client
export function publicUser(user: PrivateUser | any): User {
  const { hashedPassword, email, ...safeUser } = user;
  return safeUser;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare passwords
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Insert new user
export async function insertUser({
  id,
  username,
  name,
}: {
  id: string;
  username: string;
  name?: string;
}) {
  await pool.query(
    `INSERT INTO users (id, username, name, avatar, status, last_seen, friends, chat_ids)
     VALUES ($1, $2, $3, NULL, 'online', NOW(), '{}', '{}')`,
    [id, username, name || username]
  );
  return id;
}

// Insert password and email
export async function insertUserPassword({
  userId,
  hashedPassword,
  email,
}: {
  userId: string;
  hashedPassword: string;
  email: string;
}) {
  await pool.query(
    `INSERT INTO user_passwords (user_id, hashed_password, email)
     VALUES ($1, $2, $3)`,
    [userId, hashedPassword, email]
  );
}

// Get user by ID
export async function getUserById(userId: string): Promise<PrivateUser | null> {
  const res = await pool.query(
    `SELECT u.*, p.hashed_password AS "hashedPassword", p.email
     FROM users u
     LEFT JOIN user_passwords p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );
  return res.rows[0] || null;
}

// Get user by username
export async function getUserByUsername(
  username: string
): Promise<PrivateUser | null> {
  const res = await pool.query(
    `SELECT u.*, p.hashed_password AS "hashedPassword", p.email
     FROM users u
     JOIN user_passwords p ON u.id = p.user_id
     WHERE u.username = $1`,
    [username]
  );
  return res.rows[0] || null;
}
