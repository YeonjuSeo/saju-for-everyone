# 60-Gapja Day Pillar artwork

Drop one image per Day Pillar here. Filenames can be **Korean + hanja** or the
plain **romanization** — both are recognized:

```
신해(辛亥).png     ✅   (Korean + hanja in parentheses)
갑인(甲寅).jpg     ✅
sinhae.png        ✅   (romanization)
gapin.jpg         ✅
```

Supported extensions: `png · jpg · jpeg · webp · gif · avif`.

After adding or renaming images, regenerate the manifest the app reads:

```bash
npm run images
```

- Recommended size: **4:3** (≈800×600), under ~150 KB each.
- Until an image exists for a pillar, the site shows an automatic fallback
  (element-colored gradient + zodiac animal + hanja), so the page always looks
  complete.
- `node scripts/list-image-keys.mjs` prints all 60 pillar keys as a checklist.
