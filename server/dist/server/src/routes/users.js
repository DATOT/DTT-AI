"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helpers_1 = require("../helpers");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get user profile
router.get("/:id", auth_1.auth, async (req, res) => {
    const userId = req.params.id;
    if (userId !== req.userId)
        return res.status(403).json({ error: "Forbidden" });
    try {
        const user = await (0, helpers_1.getUserById)(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});
exports.default = router;
