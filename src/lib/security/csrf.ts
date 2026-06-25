import { createHash, randomBytes } from "node:crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString("hex");

export function generateCsrfToken(sessionId: string): string {
  const timestamp = Date.now().toString(36);
  const payload = `${sessionId}:${timestamp}`;
  const hmac = createHash("sha256").update(`${payload}:${CSRF_SECRET}`).digest("hex").slice(0, 16);
  return `${timestamp}.${hmac}`;
}

export function validateCsrfToken(token: string, sessionId: string): boolean {
  try {
    const [timestamp, hmac] = token.split(".");
    if (!timestamp || !hmac) return false;
    const payload = `${sessionId}:${timestamp}`;
    const expected = createHash("sha256").update(`${payload}:${CSRF_SECRET}`).digest("hex").slice(0, 16);
    if (hmac !== expected) return false;
    const age = Date.now() - parseInt(timestamp, 36);
    return age < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
