import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET ?? "lumble-dev-secret-change-in-prod";
const JWT_EXPIRES = "30d";

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
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
    (req as Request & { userId: string }).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Token expired or invalid." });
  }
}
