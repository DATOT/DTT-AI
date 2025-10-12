import { pool } from "./db";

// Insert a user message
export async function insertUserMessage(chatId: string, messageId: string, senderId: string, senderName: string, text: string) {
  await pool.query(
    `INSERT INTO messages (id, chat_id, sender_type, sender_id, sender_name, text, time)
     VALUES ($1, $2, 'user', $3, $4, $5, NOW())`,
    [messageId, chatId, senderId, senderName, text]
  );

  // Update chat last_updated
  await pool.query("UPDATE chats SET last_updated = NOW() WHERE id = $1", [chatId]);

  return { id: messageId, chatId, senderId, text };
}
