"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const helpers_1 = require("../helpers");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Send message
router.post("/", auth_1.auth, async (req, res) => {
    const { chatId, text } = req.body;
    const senderId = req.userId;
    try {
        const chat = await (0, helpers_1.getChatById)(chatId);
        if (!chat)
            return res.status(404).json({ error: "Chat not found" });
        const sender = await (0, helpers_1.getUserById)(senderId);
        if (!sender)
            return res.status(404).json({ error: "Sender not found" });
        const messageId = (0, uuid_1.v4)();
        await (0, helpers_1.insertUserMessage)(chatId, messageId, senderId, sender.name, text);
        await (0, helpers_1.updateChatLastUpdate)({ chatId });
        res.json({ id: messageId, chatId, senderId, text });
        if (chat.type === "bot")
            console.log("Bot chat placeholder triggered");
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send message" });
    }
});
exports.default = router;
