"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.createUserChat = createUserChat;
exports.createBotChat = createBotChat;
// src/types/creators.ts
const uuid_1 = require("uuid");
const enums_1 = require("./enums");
// Create a user
function createUser(name, username, avatar) {
    return {
        id: (0, uuid_1.v4)(),
        username,
        name,
        avatar,
        status: "offline",
        lastSeen: new Date(),
        friends: [],
        chatIds: [],
    };
}
// Create a direct or group chat
function createUserChat(members, name, isGroup = false) {
    return {
        id: (0, uuid_1.v4)(),
        type: isGroup ? enums_1.ChatType.Group : enums_1.ChatType.Direct,
        name,
        members,
        messages: [],
        lastUpdated: new Date(),
    };
}
// Create a bot chat
function createBotChat(name) {
    return {
        id: (0, uuid_1.v4)(),
        type: enums_1.ChatType.Bot,
        name,
        messages: [],
        lastUpdated: new Date(),
    };
}
