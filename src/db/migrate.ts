import dotenv from "dotenv";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pool } from "../config/db.js";

dotenv.config();

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), "src", "migrations");
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

  const client = await pool.connect();

  try {
    for (const file of files) {
      const fullPath = path.join(migrationsDir, file);
      const sql = await readFile(fullPath, "utf8");

      console.log(`Running migration: ${file}`);
      await client.query(sql);
      console.log(`Completed migration: ${file}`);
    }

    console.log("All migrations completed successfully.");
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
