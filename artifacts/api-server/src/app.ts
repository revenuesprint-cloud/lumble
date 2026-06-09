import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// ── Vulnerability 6 (MEDIUM): security headers — X-Content-Type-Options,
// X-Frame-Options, Strict-Transport-Security, etc.
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// ── Delete account web page (required by Google Play) ────────────────────────
const DELETE_ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Delete Account – Lumble</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
         background: #F4F5F7; min-height: 100vh; display: flex; align-items: center;
         justify-content: center; padding: 24px; }
  .card { background: #fff; border-radius: 20px; padding: 40px 32px; max-width: 460px;
          width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .logo { font-size: 24px; font-weight: 700; color: #5B4CE8; margin-bottom: 8px; }
  h1 { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 8px; }
  p { font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 16px; }
  ul { font-size: 14px; color: #6B7280; padding-left: 20px; margin-bottom: 24px; }
  ul li { margin-bottom: 4px; }
  label { display: block; font-size: 14px; font-weight: 500; color: #374151;
          margin-bottom: 6px; }
  input[type=email] { width: 100%; padding: 12px 14px; border: 1.5px solid #E5E7EB;
                      border-radius: 10px; font-size: 15px; outline: none;
                      transition: border-color 0.2s; }
  input[type=email]:focus { border-color: #5B4CE8; }
  button { width: 100%; margin-top: 16px; padding: 13px; background: #EF4444;
           color: #fff; border: none; border-radius: 10px; font-size: 15px;
           font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
  button:hover { opacity: 0.88; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  .msg { margin-top: 16px; padding: 12px 14px; border-radius: 10px; font-size: 14px;
         display: none; }
  .msg.success { background: #D1FAE5; color: #065F46; display: block; }
  .msg.error   { background: #FEE2E2; color: #991B1B; display: block; }
</style>
</head>
<body>
<div class="card">
  <div class="logo">Lumble</div>
  <h1>Delete your account</h1>
  <p>Permanently delete your Lumble account and all associated data. This cannot be undone.</p>
  <p>The following data will be deleted:</p>
  <ul>
    <li>Your account and login credentials</li>
    <li>Your and your partner's birth details</li>
    <li>Your compatibility readings and insights</li>
    <li>Your challenge progress and notes</li>
  </ul>
  <form id="form">
    <label for="email">Account email address</label>
    <input type="email" id="email" name="email" placeholder="you@example.com" required />
    <button type="submit" id="btn">Delete my account permanently</button>
  </form>
  <div id="msg" class="msg"></div>
</div>
<script>
  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn');
    const msg = document.getElementById('msg');
    const email = document.getElementById('email').value.trim();
    btn.disabled = true;
    btn.textContent = 'Deleting…';
    msg.className = 'msg';
    msg.textContent = '';
    try {
      const res = await fetch('/api/delete-account-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        msg.className = 'msg success';
        msg.textContent = data.message;
        document.getElementById('form').style.display = 'none';
      } else {
        msg.className = 'msg error';
        msg.textContent = data.error || 'Something went wrong. Please try again.';
        btn.disabled = false;
        btn.textContent = 'Delete my account permanently';
      }
    } catch {
      msg.className = 'msg error';
      msg.textContent = 'Network error. Please check your connection and try again.';
      btn.disabled = false;
      btn.textContent = 'Delete my account permanently';
    }
  });
</script>
</body>
</html>`;

app.get("/delete-account", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(DELETE_ACCOUNT_HTML);
});

// POST /api/delete-account-request — unauthenticated deletion by email (for web form)
app.post("/api/delete-account-request", async (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required." });
  }
  try {
    const result = await db.delete(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
    // Return the same message whether or not the account existed (prevents email enumeration)
    return res.json({ message: "If an account with that email exists, it has been permanently deleted." });
  } catch (err) {
    console.error("delete-account-request error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

// 404 — return JSON not Express default HTML
app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Global error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Something went wrong." });
});

export default app;
