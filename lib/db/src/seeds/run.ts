import "dotenv/config";
import { db } from "../index.js";
import { contentTable, problemsTable } from "../schema/index.js";
import { seed } from "./problems.js";
import { seedContent } from "./content.js";
import { sql } from "drizzle-orm";

async function main() {
  // Clear existing data so simplified content replaces old content cleanly
  console.log("Clearing existing seed data...");
  await db.execute(sql`TRUNCATE TABLE content RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE problems RESTART IDENTITY CASCADE`);
  console.log("Cleared.");

  await seed();
  await seedContent();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
