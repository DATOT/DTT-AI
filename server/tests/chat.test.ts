import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { pool } from "../src/helpers";
import { v4 as uuidv4 } from "uuid";

let userToken: string;
let userId: string;
let chatId: string;

describe("Chat API", () => {
  beforeAll(async () => {
    console.log("TEST_DATABASE_URL:", process.env.TEST_DATABASE_URL);

    // Clear related tables
    await pool.query("DELETE FROM messages");
    await pool.query("DELETE FROM chat_members");
    await pool.query("DELETE FROM chats");
    await pool.query("DELETE FROM user_passwords");
    await pool.query("DELETE FROM users");

    // Create a user
    const res = await request(app).post("/api/register").send({
      email: "chatuser@example.com",
      username: "chatuser",
      name: "Chat User",
      password: "password123",
      retypedPassword: "password123",
    });
    userToken = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should create a new chat", async () => {
    const res = await request(app)
      .post("/api/chats")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Test Chat",
        members: [],
        type: "direct",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Test Chat");
    expect(res.body.members).toContain(userId);
    chatId = res.body.id;
  });

  it("should fetch user chats", async () => {
    const res = await request(app)
      .get(`/api/chats/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id).toBe(chatId);
  });

  it("should send a message", async () => {
    const messageText = "Hello world!";
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ chatId, text: messageText });

    expect(res.status).toBe(200);
    expect(res.body.text).toBe(messageText);
    expect(res.body.chatId).toBe(chatId);
  });
});
