import dotenv from "dotenv";
import app from "./app";
import { pool } from "./helpers/db";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const requiredEnv = ["TEST_DATABASE_URL", "JWT_SECRET"];

function checkEnv(): string[] {
  return requiredEnv.filter((k) => !process.env[k]);
}

async function start() {
  const missing = checkEnv();
  if (missing.length) {
    console.error("Missing required environment variables:", missing.join(", "));
    process.exit(1);
  }

  try {
    await pool.query("SELECT 1");
    console.log("Database connection OK");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Chat API running on http://localhost:${PORT}`);
  });
}

start();
