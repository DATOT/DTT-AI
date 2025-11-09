"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatById = getChatById;
exports.getChatsForUser = getChatsForUser;
exports.createChat = createChat;
exports.updateChatLastUpdate = updateChatLastUpdate;
const db_1 = require("./db");
// Get chat by ID
async function getChatById(chatId) {
    const res = await db_1.pool.query("SELECT * FROM chats WHERE id = $1", [chatId]);
    return res.rows[0] || null;
}
// Get all chats for a user
async function getChatsForUser(userId) {
    const res = await db_1.pool.query(`SELECT c.* FROM chats c 
     JOIN chat_members cm ON cm.chat_id = c.id 
     WHERE cm.user_id = $1`, [userId]);
    return res.rows;
}
// Create a new chat
async function createChat({ chatId, name, type, members }) {
    await db_1.pool.query(`INSERT INTO chats (id, name, type, last_updated)
     VALUES ($1, $2, $3, NOW())`, [chatId, name, type]);
    await Promise.all(members.map(userId => db_1.pool.query(`INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2)`, [chatId, userId])));
    return { id: chatId, name, type, members };
}
// Update last_updated timestamp
async function updateChatLastUpdate({ chatId }) {
    await db_1.pool.query("UPDATE chats SET last_updated = NOW() WHERE id = $1", [chatId]);
}
