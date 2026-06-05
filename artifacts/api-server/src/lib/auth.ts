import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// ── Vulnerability 1 (CRITICAL): never fall back to a hardcoded secret.
// If JWT_SECRET is missing or too short the server refuses to start — a leaked
// or guessable secret lets anyone forge tokens for arbitrary userIds.
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret || rawSecret.length < 32) {
  throw new Error(
    "JWT_SECRET env var must be set and at least 32 characters long. " +
    "Generate one with: openssl rand -hex 32"
  );
}
const JWT_SECRET = rawSecret;

// ── Vulnerability 5 (MEDIUM): 30-day lifetime is too long for a stolen token.
// 7 days is a pragmatic balance; revisit if refresh tokens are added.
const JWT_EXPIRES = "7d";

export function signToken(userId: string): string {
  // ── Vulnerability 2 (HIGH): pin algorithm explicitly so jwt.verify cannot
  // be tricked into accepting an alg:none token even on future library upgrades.
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRES,
  });
}

export function verifyToken(token: string): { sub: string } {
  // ── Vulnerability 2 (HIGH): algorithms whitelist prevents algorithm confusion.
  return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as { sub: string };
}

// Express middleware — attaches req.userId or returns 401
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header." });
    return;
  }
  try {
    const payload = verifyToken(header.slice(7));

    // ── Vulnerability 3 (HIGH): validate sub before trusting it as a userId.
    // A crafted token with sub:null, sub:"", or sub:0 would bypass downstream
    // ownership checks that compare userId to DB rows.
    if (typeof payload.sub !== "string" || payload.sub.trim() === "") {
      res.status(401).json({ error: "Token expired or invalid." });
      return;
    }

    (req as Request & { userId: string }).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Token expired or invalid." });
  }
}
