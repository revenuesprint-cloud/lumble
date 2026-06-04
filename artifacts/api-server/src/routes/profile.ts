import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";

const router = Router();

type AuthRequest = Parameters<typeof requireAuth>[0] & { userId: string };

// ─── GET profile ──────────────────────────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId))
      .limit(1);
    if (!profile) return res.status(404).json({ error: "Profile not found." });
    return res.json(profile);
  } catch (err) {
    console.error("get profile error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ─── PUT profile (create or update) ──────────────────────────────────────────
router.put("/", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const {
    userName, userBirthDate, userBirthTime,
    partnerName, partnerBirthDate, relationshipType,
  } = req.body ?? {};

  const allowed = ["crush", "situationship", "relationship", "ex"];
  if (!userName || !userBirthDate || !partnerName || !partnerBirthDate || !allowed.includes(relationshipType)) {
    return res.status(400).json({ error: "Missing or invalid profile fields." });
  }

  try {
    const [existing] = await db
      .select({ id: profilesTable.id })
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(profilesTable)
        .set({
          userName,
          userBirthDate,
          userBirthTime: userBirthTime ?? null,
          partnerName,
          partnerBirthDate,
          relationshipType,
          updatedAt: new Date(),
        })
        .where(eq(profilesTable.userId, userId))
        .returning();
      return res.json(updated);
    }

    const [created] = await db
      .insert(profilesTable)
      .values({ userId, userName, userBirthDate, userBirthTime: userBirthTime ?? null, partnerName, partnerBirthDate, relationshipType })
      .returning();
    return res.status(201).json(created);
  } catch (err) {
    console.error("put profile error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ─── POST /premium — flip the flag ───────────────────────────────────────────
router.post("/premium", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  try {
    const [existing] = await db
      .select({ id: profilesTable.id })
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId))
      .limit(1);

    if (!existing) return res.status(404).json({ error: "Profile not found. Create profile first." });

    const [updated] = await db
      .update(profilesTable)
      .set({ isPremium: true, premiumSince: new Date(), updatedAt: new Date() })
      .where(eq(profilesTable.userId, userId))
      .returning();
    return res.json(updated);
  } catch (err) {
    console.error("premium upgrade error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
