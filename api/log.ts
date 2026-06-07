import crypto from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Anonymous usage logger.
//
// PRIVACY: This endpoint deliberately ignores the request body. It records only:
//   - a UTC timestamp
//   - the date (for daily-hit roll-ups)
//   - the visitor's country, derived from Vercel's edge geo header (never the IP)
// No birth data, no IP, no cookies, no identifiers are ever stored.
//
// If the Google Sheets env vars are not configured, it silently no-ops so the
// site keeps working in local dev and on forks.

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface SheetEnv {
  email: string;
  privateKey: string;
  sheetId: string;
  range: string;
}

function readEnv(): SheetEnv | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.SHEET_ID;
  if (!email || !rawKey || !sheetId) return null;
  return {
    email,
    // Vercel stores the key with literal "\n"; restore real newlines.
    privateKey: rawKey.replace(/\\n/g, '\n'),
    sheetId,
    range: process.env.SHEET_RANGE || 'Hits!A:C',
  };
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

/** Mint a Google OAuth access token from a service account (RS256 JWT grant). */
async function getAccessToken(env: SheetEnv): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: env.email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signature = crypto
    .sign('RSA-SHA256', Buffer.from(unsigned), env.privateKey)
    .toString('base64url');
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function appendRow(env: SheetEnv, token: string, row: string[]): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.sheetId}/values/${encodeURIComponent(
    env.range,
  )}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) {
    throw new Error(`Sheets append failed: ${res.status} ${await res.text()}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Always succeed for the client; logging is best-effort and must never block.
  const env = readEnv();
  if (!env) {
    res.status(204).end();
    return;
  }

  const country =
    (req.headers['x-vercel-ip-country'] as string | undefined) || 'XX';
  const nowIso = new Date().toISOString();
  const date = nowIso.slice(0, 10); // YYYY-MM-DD for daily roll-ups

  try {
    const token = await getAccessToken(env);
    await appendRow(env, token, [nowIso, date, country]);
  } catch (err) {
    // Swallow — never surface logging failures to visitors.
    console.error('[log] failed:', err);
  }
  res.status(204).end();
}
