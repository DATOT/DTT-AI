"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const helpers_1 = require("../helpers");
const router = (0, express_1.Router)();
// Register
router.post("/register", async (req, res) => {
    const { email, username, name, password, retypedPassword } = req.body;
    if (!username || !password || !retypedPassword)
        return res.status(400).json({ error: "Missing required fields" });
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ error: "Invalid email" });
    if (password !== retypedPassword)
        return res.status(400).json({ error: "Passwords do not match" });
    const usernameRegex = /^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/;
    if (!usernameRegex.test(username))
        return res.status(400).json({ error: "Invalid username" });
    try {
        const existingUser = await (0, helpers_1.getUserByUsername)(username);
        console.log(existingUser);
        if (existingUser)
            return res.status(409).json({ error: "Username already exists" });
        const hashedPassword = await (0, helpers_1.hashPassword)(password);
        const id = (0, uuid_1.v4)();
        await (0, helpers_1.insertUser)({ id, username, name });
        await (0, helpers_1.insertUserPassword)({ userId: id, hashedPassword, email });
        const token = (0, helpers_1.createToken)(id);
        res.status(201).json({
            user: { id, username, name: name || username, status: "online" },
            token,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});
// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "Missing required fields" });
    try {
        const user = await (0, helpers_1.getUserByUsername)(username);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        if (!user.hashedPassword)
            return res.status(400).json({ error: "Forbidden" });
        const valid = await (0, helpers_1.comparePassword)(password, user.hashedPassword);
        if (!valid)
            return res.status(401).json({ error: "Invalid password" });
        const token = (0, helpers_1.createToken)(user.id);
        res.status(200).json({ user: (0, helpers_1.publicUser)(user), token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});
exports.default = router;
