"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUserMessage = insertUserMessage;
const db_1 = require("./db");
// Insert a user message
async function insertUserMessage(chatId, messageId, senderId, senderName, text) {
    await db_1.pool.query(`INSERT INTO messages (id, chat_id, sender_type, sender_id, sender_name, text, time)
     VALUES ($1, $2, 'user', $3, $4, $5, NOW())`, [messageId, chatId, senderId, senderName, text]);
    // Update chat last_updated
    await db_1.pool.query("UPDATE chats SET last_updated = NOW() WHERE id = $1", [chatId]);
    return { id: messageId, chatId, senderId, text };
}
