"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const helpers_1 = require("../helpers");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get chats for user
router.get("/:userId", auth_1.auth, async (req, res) => {
    const userId = req.params.userId;
    if (userId !== req.userId)
        return res.status(403).json({ error: "Forbidden" });
    try {
        const chats = await (0, helpers_1.getChatsForUser)(userId);
        res.json(chats);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch chats" });
    }
});
// Create chat
router.post("/", auth_1.auth, async (req, res) => {
    const { name, members = [], type } = req.body;
    const creatorId = req.userId;
    if (!members.includes(creatorId))
        members.push(creatorId);
    const chatId = (0, uuid_1.v4)();
    try {
        await (0, helpers_1.createChat)({ chatId, name, type, members });
        res.json({ id: chatId, name, type, members });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create chat" });
    }
});
exports.default = router;
