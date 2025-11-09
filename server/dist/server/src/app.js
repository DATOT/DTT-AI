"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const chats_1 = __importDefault(require("./routes/chats"));
const messages_1 = __importDefault(require("./routes/messages"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: "Too many requests, slow down!" },
}));
// Routes
app.use("/api", auth_1.default);
app.use("/api/user", users_1.default);
app.use("/api/chats", chats_1.default);
app.use("/api/messages", messages_1.default);
exports.default = app;
