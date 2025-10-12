import { pool } from "./db";

// Get chat by ID
export async function getChatById(chatId: string) {
  const res = await pool.query("SELECT * FROM chats WHERE id = $1", [chatId]);
  return res.rows[0] || null;
}

// Get all chats for a user
export async function getChatsForUser(userId: string) {
  const res = await pool.query(
    `SELECT c.* FROM chats c 
     JOIN chat_members cm ON cm.chat_id = c.id 
     WHERE cm.user_id = $1`,
    [userId]
  );
  return res.rows;
}

// Create a new chat
export async function createChat({ chatId, name, type, members }: { chatId: string; name: string; type: string; members: string[] }) {
  await pool.query(
    `INSERT INTO chats (id, name, type, last_updated)
     VALUES ($1, $2, $3, NOW())`,
    [chatId, name, type]
  );

  await Promise.all(
    members.map(userId =>
      pool.query(`INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2)`, [chatId, userId])
    )
  );

  return { id: chatId, name, type, members };
}

// Update last_updated timestamp
export async function updateChatLastUpdate({ chatId }: { chatId: string }) {
  await pool.query("UPDATE chats SET last_updated = NOW() WHERE id = $1", [chatId]);
}
