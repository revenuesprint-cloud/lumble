import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, profilesTable } from "@workspace/db";
import { signToken } from "../lib/auth";
import { authLimiter } from "../app";

const router = Router();

// ─── Register ─────────────────────────────────────────────────────────────────
router.post("/register", authLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || !email.includes("@") || email.length < 5) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({ email: email.toLowerCase().trim(), passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email });

    const token = signToken(user.id);
    return res.status(201).json({ token, email: user.email, userId: user.id });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "No account found for that email." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, user.id))
      .limit(1);

    const token = signToken(user.id);
    return res.json({ token, email: user.email, userId: user.id, profile: profile ?? null });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
