import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const pool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
