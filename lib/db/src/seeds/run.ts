import "dotenv/config";
import { seed } from "./problems.js";
import { seedContent } from "./content.js";

async function main() {
  await seed();
  await seedContent();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
