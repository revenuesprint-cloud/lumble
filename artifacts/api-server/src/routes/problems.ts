import { Router } from "express";
import { db, problemsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

// ─── POST /problems/match ─────────────────────────────────────────────────────
// Accepts kundli attributes extracted on the client, returns matched problems
// sorted by relevance score DESC, sort_order ASC (guarantees consistency).
// No auth required — problems are public content matched to kundli attributes.

router.post("/match", async (req, res) => {
  const {
    userMoonRashi, userSunRashi, userNakshatra, userGana, userElement, userDashaLord,
    partnerMoonRashi, partnerSunRashi, partnerNakshatra, partnerGana, partnerElement,
    mangalDosha, nadiDosha, bhakootDosha, gunaScore, relationshipType, yoniEnemy,
  } = req.body ?? {};

  if (!userMoonRashi || !userNakshatra || !relationshipType) {
    return res.status(400).json({ error: "Missing required kundli attributes." });
  }

  // Build the user's attribute set — every tag that could match this kundli
  const attrs: string[] = [
    "universal",
    `moon_rashi:${userMoonRashi}`,
    `sun_rashi:${userSunRashi ?? ""}`,
    `nakshatra:${userNakshatra}`,
    `partner_moon_rashi:${partnerMoonRashi ?? ""}`,
    `partner_nakshatra:${partnerNakshatra ?? ""}`,
    `gana:${userGana ?? ""}`,
    `partner_gana:${partnerGana ?? ""}`,
    `gana_combo:${[userGana, partnerGana].filter(Boolean).sort().join("_")}`,
    `dasha:${userDashaLord ?? ""}`,
    `relationship:${relationshipType}`,
    `element:${userElement ?? ""}`,
  ];

  if (mangalDosha) attrs.push("dosha:mangal");
  if (nadiDosha)   attrs.push("dosha:nadi");
  if (bhakootDosha) attrs.push("dosha:bhakoot");
  if (yoniEnemy)   attrs.push("yoni:enemy");

  const score = typeof gunaScore === "number" ? gunaScore : 25;
  attrs.push(score < 18 ? "guna:low" : score < 28 ? "guna:medium" : "guna:high");

  if (userElement && partnerElement && userElement !== partnerElement) {
    attrs.push(`element_conflict:${[userElement, partnerElement].sort().join("_")}`);
  }

  try {
    // Score each problem by how many of its tags appear in the user's attribute set,
    // then sort deterministically: score DESC, sort_order ASC.
    // This guarantees: the same kundli always returns the same problems in the same order,
    // even as new problems are added (they get higher sort_order values).
    const rows = await db.execute(sql`
      SELECT
        id, title, description, category, severity, tags, solutions, sort_order,
        (
          SELECT COUNT(*)::int
          FROM unnest(tags) t
          WHERE t = ANY(${attrs}::text[])
        ) AS match_score
      FROM problems
      ORDER BY match_score DESC, sort_order ASC
      LIMIT 60
    `);

    return res.json({ problems: rows.rows });
  } catch (err) {
    console.error("problems/match error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
