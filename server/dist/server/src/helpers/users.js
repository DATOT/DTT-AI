"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicUser = publicUser;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.insertUser = insertUser;
exports.insertUserPassword = insertUserPassword;
exports.getUserById = getUserById;
exports.getUserByUsername = getUserByUsername;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
// Remove sensitive info before sending to client
function publicUser(user) {
    const { hashedPassword, email, ...safeUser } = user;
    return safeUser;
}
// Hash password
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
// Compare passwords
async function comparePassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
// Insert new user
async function insertUser({ id, username, name, }) {
    await db_1.pool.query(`INSERT INTO users (id, username, name, avatar, status, last_seen, friends, chat_ids)
     VALUES ($1, $2, $3, NULL, 'online', NOW(), '{}', '{}')`, [id, username, name || username]);
    return id;
}
// Insert password and email
async function insertUserPassword({ userId, hashedPassword, email, }) {
    await db_1.pool.query(`INSERT INTO user_passwords (user_id, hashed_password, email)
     VALUES ($1, $2, $3)`, [userId, hashedPassword, email]);
}
// Get user by ID
async function getUserById(userId) {
    const res = await db_1.pool.query(`SELECT u.*, p.hashed_password AS "hashedPassword", p.email
     FROM users u
     LEFT JOIN user_passwords p ON u.id = p.user_id
     WHERE u.id = $1`, [userId]);
    return res.rows[0] || null;
}
// Get user by username
async function getUserByUsername(username) {
    const res = await db_1.pool.query(`SELECT u.*, p.hashed_password AS "hashedPassword", p.email
     FROM users u
     JOIN user_passwords p ON u.id = p.user_id
     WHERE u.username = $1`, [username]);
    return res.rows[0] || null;
}
