import "dotenv/config";
import { seed } from "./problems.js";

seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
