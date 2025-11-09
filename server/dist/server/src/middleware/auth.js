"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const helpers_1 = require("../helpers");
const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "Missing token" });
    const token = header.split(" ")[1];
    const userId = (0, helpers_1.verifyToken)(token);
    if (!userId)
        return res.status(401).json({ error: "Invalid token" });
    req.userId = userId;
    next();
};
exports.auth = auth;
