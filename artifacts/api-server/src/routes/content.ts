import { Router } from "express";
import { db, contentTable, userChallengeStatesTable, problemsTable } from "@workspace/db";
import { eq, and, sql, inArray } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

// Drizzle serializes a JS array as ($1,$2,...) which Postgres treats as a record,
// not an array. Build ARRAY[$1, $2, ...] explicitly to avoid "cannot cast record to text[]".
const toTextArray = (items: string[]) =>
  items.length === 0
    ? sql`ARRAY[]::text[]`
    : sql`ARRAY[${sql.join(items.map((i) => sql`${i}`), sql`, `)}]`;

const router = Router();
type AuthRequest = Parameters<typeof requireAuth>[0] & { userId: string };

// ─── POST /content/batch ───────────────────────────────────────────────────────
// Returns personalised content batched by type. Public — no auth needed.
// Body: { tags: string[], types?: string[], limit?: number }
// Uses same tag-overlap scoring as /problems/match.

router.post("/batch", async (req, res) => {
  const { tags = [], types, limit = 20 } = req.body ?? {};

  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: "tags must be an array of strings." });
  }

  const typeFilter = Array.isArray(types) && types.length > 0;

  try {
    const rows = await db.execute(sql`
      SELECT
        id, type, title, body, meta, tags, sort_order, is_active,
        (
          SELECT COUNT(*)::int
          FROM unnest(tags) t
          WHERE t = ANY(${toTextArray(tags)})
        ) AS match_score
      FROM content
      WHERE is_active = true
        ${typeFilter ? sql`AND type = ANY(${toTextArray(types)})` : sql``}
      ORDER BY match_score DESC, sort_order ASC
      LIMIT ${limit * (typeFilter ? 1 : 8)}
    `);

    // Group by type and limit each type to `limit` results
    const grouped: Record<string, unknown[]> = {};
    for (const row of rows.rows as any[]) {
      if (!grouped[row.type]) grouped[row.type] = [];
      if (grouped[row.type].length < limit) {
        grouped[row.type].push(row);
      }
    }

    return res.json({ content: grouped });
  } catch (err) {
    console.error("content/batch error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// ─── GET /content/daily ────────────────────────────────────────────────────────
// Returns one item of each content type suitable for the home screen.
// Deterministic by date + user kundli tags so same person sees same content per day.

router.post("/daily", async (req, res) => {
  const { tags = [], date } = req.body ?? {};
  const dateKey = date ?? new Date().toISOString().slice(0, 10);
  // Use date as an offset seed
  const dayNum = dateKey.split("-").reduce((a: number, n: string) => a + parseInt(n), 0);

  try {
    const attrs = Array.isArray(tags) ? tags : [];

    const [quoteRow, affirmRow, messageRow] = await Promise.all([
      db.execute(sql`
        SELECT id, type, title, body, meta, tags, sort_order,
          (SELECT COUNT(*)::int FROM unnest(tags) t WHERE t = ANY(${toTextArray(attrs)})) AS score
        FROM content WHERE is_active=true AND type='quote'
        ORDER BY score DESC, sort_order ASC
        LIMIT 50
      `),
      db.execute(sql`
        SELECT id, type, title, body, meta, tags, sort_order,
          (SELECT COUNT(*)::int FROM unnest(tags) t WHERE t = ANY(${toTextArray(attrs)})) AS score
        FROM content WHERE is_active=true AND type='affirmation'
        ORDER BY score DESC, sort_order ASC
        LIMIT 50
      `),
      db.execute(sql`
        SELECT id, type, title, body, meta, tags, sort_order,
          (SELECT COUNT(*)::int FROM unnest(tags) t WHERE t = ANY(${toTextArray(attrs)})) AS score
        FROM content WHERE is_active=true AND type='daily_message'
        ORDER BY score DESC, sort_order ASC
        LIMIT 30
      `),
    ]);

    const pick = (rows: any[], seed: number) => rows[seed % rows.length] ?? null;

    return res.json({
      quote:      pick(quoteRow.rows as any[], dayNum),
      affirmation:pick(affirmRow.rows as any[], dayNum + 1),
      message:    pick(messageRow.rows as any[], dayNum + 2),
    });
  } catch (err) {
    console.error("content/daily error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// ─── POST /content/questions ──────────────────────────────────────────────────
// Returns browsable question-answer cards personalized by kundli tags.
// Groups by category (about_them, about_you, what_to_do, patterns, big_picture).
// Public — no auth required.

router.post("/questions", async (req, res) => {
  const { tags = [] } = req.body ?? {};
  const attrs = Array.isArray(tags) ? tags : [];

  try {
    const rows = await db.execute(sql`
      SELECT id, type, title, body, meta, tags, sort_order,
        (SELECT COUNT(*)::int FROM unnest(tags) t WHERE t = ANY(${toTextArray(attrs)})) AS match_score
      FROM content
      WHERE is_active = true AND type = 'question_answer'
      ORDER BY match_score DESC, sort_order ASC
      LIMIT 80
    `);

    // Group by category
    const grouped: Record<string, unknown[]> = {};
    for (const row of rows.rows as any[]) {
      const cat = (row.meta?.category as string) ?? "general";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(row);
    }

    return res.json({ questions: grouped, total: rows.rows.length });
  } catch (err) {
    console.error("content/questions error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// ─── PATCH /content/challenges/:problemId/state ───────────────────────────────
// Save or update a user's acknowledgment state for a challenge.
// Auth required.

router.patch("/challenges/:problemId/state", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const { problemId } = req.params;
  const { state, notes } = req.body ?? {};

  const VALID_STATES = ["resonates", "working_on", "resolved"];
  if (!state || !VALID_STATES.includes(state)) {
    return res.status(400).json({ error: `state must be one of: ${VALID_STATES.join(", ")}` });
  }

  try {
    const existing = await db
      .select({ id: userChallengeStatesTable.id })
      .from(userChallengeStatesTable)
      .where(and(
        eq(userChallengeStatesTable.userId, userId),
        eq(userChallengeStatesTable.problemId, problemId),
      ))
      .limit(1);

    if (existing.length > 0) {
      await db.update(userChallengeStatesTable)
        .set({ state, notes: notes ?? null, updatedAt: new Date() })
        .where(and(
          eq(userChallengeStatesTable.userId, userId),
          eq(userChallengeStatesTable.problemId, problemId),
        ));
    } else {
      await db.insert(userChallengeStatesTable).values({
        userId, problemId, state, notes: notes ?? null,
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("challenge state error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// ─── DELETE /content/challenges/:problemId/state ──────────────────────────────
// Remove a user's acknowledgment (if they want to reset).

router.delete("/challenges/:problemId/state", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const { problemId } = req.params;
  try {
    await db.delete(userChallengeStatesTable).where(and(
      eq(userChallengeStatesTable.userId, userId),
      eq(userChallengeStatesTable.problemId, problemId),
    ));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong." });
  }
});

// ─── GET /content/challenges/journey ─────────────────────────────────────────
// Get user's full healing journey — all acknowledged challenges + states.

router.get("/challenges/journey", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  try {
    const states = await db
      .select()
      .from(userChallengeStatesTable)
      .where(eq(userChallengeStatesTable.userId, userId));

    if (states.length === 0) return res.json({ journey: [] });

    const problemIds = states.map((s) => s.problemId);
    const problems = await db
      .select()
      .from(problemsTable)
      .where(inArray(problemsTable.id, problemIds));

    const problemMap = Object.fromEntries(problems.map((p) => [p.id, p]));
    const journey = states.map((s) => ({
      state: s.state,
      notes: s.notes,
      updatedAt: s.updatedAt,
      problem: problemMap[s.problemId] ?? null,
    })).filter((j) => j.problem !== null);

    return res.json({ journey });
  } catch (err) {
    console.error("journey error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
