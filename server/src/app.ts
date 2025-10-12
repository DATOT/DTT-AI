import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import chatRoutes from "./routes/chats";
import messageRoutes from "./routes/messages";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: "Too many requests, slow down!" },
  })
);

// Routes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

export default app;
