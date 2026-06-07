# What's My Saju? — Korean Day Pillar (Ilju) Finder 🇰🇷

A free, private web app that lets anyone in the world discover their **Korean Saju
(사주, Four Pillars)** — with the spotlight on their **Day Pillar (일주, Ilju)**, one
of the 60 Gapja, shown in Korean romanization (e.g. **sinhae** · 신해 · 辛亥).

Built as the top of a funnel for a future global **K-Saju YouTube Shorts** channel:
curious foreigners check their Ilju here, then head to the channel.

```
Birth date · time · place
        │   (true-solar-time + lunar/solar correction, in the browser)
        ▼
  사주팔자  Year · Month · Day · Hour   →   Day Pillar headline + 60-gapja artwork
```

## Features

- **Day Pillar headline** in Korean romanization, hangul, and hanja.
- **Full Four Pillars** (년·월·일·시) with five-element color coding and zodiac animals.
- **Solar _or_ lunar** birth dates (with leap-month 윤달 support).
- **True solar time correction** at the birthplace — longitude + equation of time
  (균시차), with **historical DST / timezone** changes resolved via the IANA tz
  database (e.g. Korea's 1988 Olympic daylight saving, US wartime time, etc.).
- **자시 23:00 day boundary** — births from 23:00–24:00 roll to the next day's Ilju.
- **Privacy by design**: birth data is processed entirely in the browser and is
  **never transmitted or stored**. Stated plainly in the UI.
- **Graceful artwork fallback**: each Ilju can have its own illustration; until one
  exists, an element-colored card with the zodiac animal is shown.
- **Anonymous, privacy-safe analytics** (optional): daily hits + country, via a
  Vercel function → Google Sheets. No birth data, no IP, no cookies.

## Tech stack

React 18 · TypeScript · Vite 5 · TailwindCSS 3 · Vitest · luxon (timezones) ·
lunar-typescript (干支 / 절기 / 음양력 engine) · Vercel (hosting + serverless).

## Local development

```bash
npm install
npm run dev        # http://localhost:5191
npm test           # run the Vitest suite
npm run build      # typecheck + production build to dist/
```

## How the Saju is calculated

All logic lives in `src/lib/` and is fully unit-tested:

| File | Responsibility |
|------|----------------|
| `solarTime.ts` | Converts birthplace civil time → UTC (with historical DST) → **true local solar time** (longitude + equation of time). |
| `saju.ts` | Resolves lunar→solar, applies the solar-time correction, runs the pillar engine with the **23:00 자시 boundary**, returns the Four Pillars. |
| `ganzhi.ts` | The 10 stems / 12 branches with hangul + romanization, elements, zodiac, and the 60-gapja cycle. |

**Design decisions** (chosen for this project):

- **Time basis:** true solar time at the *birthplace* (the standard for accurate
  Saju), not a conversion to Korean Standard Time.
- **Day boundary:** the 자시 (zi hour) begins the day at **23:00**.
- **Accuracy note:** the Day Pillar is a continuous 60-day count and is robust. The
  Year/Month pillars use the solar-term (절기) calendar and can shift right at a term
  boundary; treat edge-of-term results with care.

> For entertainment and cultural curiosity — Saju is a tradition of self-reflection.

## Adding the 60-gapja artwork

Drop images into `public/images/`. Filenames can be either:

- **Korean + hanja** (easiest): `신해(辛亥).png`, `갑인(甲寅).jpg`, …
- or plain **romanization**: `sinhae.png`, `gapin.jpg`, …

Any of `png · jpg · jpeg · webp · gif · avif` works. After adding or renaming
files, regenerate the lookup manifest:

```bash
npm run images     # scans public/images → writes src/data/iljuImages.ts
```

`scripts/list-image-keys.mjs` prints all 60 expected pillars if you want a checklist.
Recommended: 4:3 (≈800×600), optimized under ~150 KB. Missing images fall back
automatically, so you can ship now and fill them in over time.

## Deploy to Vercel (free)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — the Vite preset is detected.
3. (Optional) Add the analytics env vars below in **Project → Settings → Env Vars**.
4. Deploy. The `/api/log` function and country detection (`x-vercel-ip-country`)
   work automatically on Vercel's network.

> GitHub Pages also works for the static site, but country detection + the logging
> function need Vercel's serverless layer (or a Google Apps Script endpoint).

## Anonymous analytics → Google Sheets (optional)

The `/api/log` function records **only** `[timestamp, date, country]` per visit —
nothing about the user's birth input. See `.env.example` for the full setup:

1. Create a Google Cloud **service account**, enable the **Google Sheets API**.
2. Create a JSON key → copy `client_email` and `private_key`.
3. Create a Sheet with a tab named **`Hits`**, and **share it with the service
   account email** (Editor).
4. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `SHEET_ID` in Vercel.

Build a daily-hits chart or a country pivot directly in Google Sheets from columns
`date` and `country`.

## YouTube funnel

When the channel is live, set `YOUTUBE_URL` at the top of `src/App.tsx` to reveal a
"Watch K-Saju shorts" call-to-action under the result.

## Privacy

- Birth date, time, and place **never leave the browser**.
- The optional analytics call sends an empty event; the server derives only the
  country from the request edge header and writes an anonymous row.
- No accounts, no tracking cookies.
