// Local verifier for the Google Sheets logging credentials.
// Reads .env (or .env.local), signs the service-account JWT exactly like
// api/log.ts does, and appends one TEST row to your sheet.
//
//   npm run test:log
//
// If a new row shows up in the "Hits" tab, your Vercel setup will work too.

import { readFileSync, existsSync } from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- tiny .env parser (no dependency) ---
function loadEnv() {
  const file = ['.env', '.env.local'].map((f) => join(root, f)).find(existsSync);
  if (!file) {
    fail('No .env or .env.local file found. Create one from .env.example.');
  }
  const env = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[t.slice(0, i).trim()] = v;
  }
  console.log(`• Loaded ${file.replace(root + '/', '')}`);
  return env;
}

function fail(msg) {
  console.error('\n❌ ' + msg + '\n');
  process.exit(1);
}

const env = loadEnv();
const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = (env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const sheetId = env.SHEET_ID;
const range = env.SHEET_RANGE || 'Hits!A:C';

if (!email) fail('GOOGLE_SERVICE_ACCOUNT_EMAIL is missing.');
if (!privateKey.includes('BEGIN')) fail('GOOGLE_PRIVATE_KEY looks empty/invalid.');
if (!sheetId) fail('SHEET_ID is missing.');

const b64 = (x) => Buffer.from(x).toString('base64url');

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64(
    JSON.stringify({
      iss: email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const sig = crypto.sign('RSA-SHA256', Buffer.from(unsigned), privateKey).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${sig}`,
    }),
  });
  if (!res.ok) fail(`Token exchange failed (${res.status}):\n${await res.text()}`);
  return (await res.json()).access_token;
}

console.log('• Requesting access token…');
const token = await getToken();
console.log('✓ Got access token.');

const now = new Date().toISOString();
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
  range,
)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

console.log(`• Appending a TEST row to ${range}…`);
const res = await fetch(url, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ values: [[now, now.slice(0, 10), 'TEST']] }),
});

if (!res.ok) {
  const body = await res.text();
  if (res.status === 403) {
    fail(
      `Sheets API said 403 (forbidden).\n` +
        `→ Did you SHARE the sheet with ${email} as Editor?\n` +
        `→ Is the Google Sheets API enabled in your Cloud project?\n\n${body}`,
    );
  }
  fail(`Append failed (${res.status}):\n${body}`);
}

console.log('\n✅ Success! A row with "TEST" was added to your sheet.');
console.log('   Open the Hits tab to confirm, then delete that test row.\n');
