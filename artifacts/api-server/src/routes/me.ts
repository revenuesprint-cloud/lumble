import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, profilesTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";

const router = Router();
type AuthReq = Parameters<typeof requireAuth>[0] & { userId: string };

// GET /api/me — returns current user + profile from token
router.get("/", requireAuth, async (req, res) => {
  const userId = (req as AuthReq).userId;
  try {
    const [user] = await db
      .select({ id: usersTable.id, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) return res.status(404).json({ error: "User not found." });

    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId))
      .limit(1);

    return res.json({ userId: user.id, email: user.email, profile: profile ?? null });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
