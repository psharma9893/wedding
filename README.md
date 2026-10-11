# Nishtha & Pranshu: Wedding Invitation

A cinematic, mobile-first wedding invitation website, built from the invitation
artwork (PDF pages 1–12 plus the RSVP card), in their original order.
It opens with an envelope, moves through the pages as framed scenes, and ends
with RSVP and blessings. It is a static site, free to host on GitHub Pages.

* **Stack:** Vite + TypeScript, no framework. The page is pre-rendered from
  `src/data/weddingConfig.ts` at build time, so it loads fast, works without
  JavaScript, and WhatsApp can read its preview. The JavaScript adds motion only (≈2 KB gzipped).
* **Fonts (Google Fonts, self-hosted via Fontsource):** Playfair Display (headings), EB Garamond (body), Prata (labels & buttons), Great Vibes (names), Tiro Devanagari Hindi (shlokas).
* **Page ↔ section mapping:** see [`docs/PDF-MAPPING.md`](docs/PDF-MAPPING.md).

---

## A. Install

You need **Node.js 20 or newer** ([nodejs.org](https://nodejs.org)).

```bash
cd wedding-invitation
npm install
```

## B. Run locally

```bash
npm run dev          # http://localhost:5173 — live reload
npm run build        # production build into dist/ (also runs a broken-link check)
npm run preview      # serve the production build
```

Tip: to see the envelope again, reload the page **without** a `#section` in the URL.

## C. Replace or add images

Images live in `public/images/` as three WebP files each:
`name.webp` (full), `name-640.webp` (phones), `name-blur.webp` (48 px glow).

**Easiest: regenerate everything from a new PDF.**

```bash
pip install pypdf pillow numpy
python3 scripts/prepare_images.py "path/to/Invitation.pdf" "path/to/rsvp.png"
```

The script prints each image's pixel size. If any changed, update `width`/`height`
in `src/data/imageManifest.ts` (they prevent layout jumps while loading).

**To swap one picture by hand:** export it as WebP in the three sizes above with
the same file name, then update its size and `alt` text in `src/data/imageManifest.ts`.

The link-preview image is `public/social-preview.jpg` (1200 × 630).

## D. Edit wedding details

Everything editable is in **`src/data/weddingConfig.ts`**: names, dates, times, venues,
the Google Maps link, RSVP phone numbers, the WhatsApp message, family names,
the kids' note and the link-preview title. No design files need touching.

* Leave a field as `''` to hide it (for example `mapsUrl: ''` hides a Directions button).
* `countdownTargetISO` drives the countdown. Keep the `+05:30` (India time).
* `startISO` on each event drives the **Add to calendar** file (generated automatically on build).
* **Music (optional):** put an MP3 you have rights to at `public/audio/music.mp3` and set
  `music.src: 'audio/music.mp3'`. A small play/pause button appears. Music starts only
  after the guest taps "Open Your Invitation" and never blocks the invitation. If the file
  is missing, the button quietly disappears.

### Newer options in the config

* `dressCode` on any event shows on its tile and in the schedule (Haldi is set to "Shades of yellow").
* `rsvp.formUrl`: paste a Google Form link to add an **RSVP online** button.
* `travel.items`: the Travel & Stay tiles. Clear an item's text to hide it.
* `floatingRsvpLabel`: the floating RSVP button. Set to `''` to remove it.

### Details you may still want to add

| Field | Status |
|-------|--------|
| Mehndi venue address | The card says "at our residence". There is no address or map link, so no Directions button is shown. Add `mapsUrl` to the `mehndi` event if you want one. |
| End times | Not on the cards. Calendar entries have start times only. |
| Music | None supplied, so the control is hidden. |

## E. Repository name (sub-path)

Nothing to configure. The build uses **relative paths** (`base: './'` in `vite.config.ts`),
so it works at `https://<user>.github.io/<any-repo-name>/`, at a custom domain, or locally.
The deploy workflow fills in the absolute URL needed for link previews (`SITE_URL`) from
GitHub Pages automatically.

Building by hand for another host?
`SITE_URL=https://example.com/invite/ npm run build`

## F. Push to GitHub

1. Create an **empty public repo** on github.com, for example `wedding-invitation` (no README).
   Free GitHub Pages needs a public repo.
2. From this folder:

```bash
git init
git add .
git commit -m "Wedding invitation"
git branch -M main
git remote add origin https://github.com/<your-username>/wedding-invitation.git
git push -u origin main
```

## G. Enable GitHub Pages

Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
That's all. The included workflow (`.github/workflows/deploy.yml`) builds and deploys
on every push to `main`. You can also run it manually from the **Actions** tab ("Run workflow").

## H. Verify the deployment

1. **Actions** tab → "Deploy to GitHub Pages" should go green (≈1 minute).
2. Open `https://<your-username>.github.io/wedding-invitation/`.
3. Check: the envelope opens, images load, and the WhatsApp, Call and Directions buttons work on your phone.
4. Check the link preview with a debugger such as [opengraph.xyz](https://www.opengraph.xyz/),
   or send the link to yourself on WhatsApp.

> **About WhatsApp previews:** WhatsApp caches a link's preview the first time anyone
> shares it. If you change the title or preview image later, old chats may keep showing
> the old one for a while. Sharing the link with a harmless suffix such as `?v=2` forces a fresh preview.

## I. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Page is blank or 404 | Make sure Pages **Source** is *GitHub Actions* (not "Deploy from a branch"), and that the latest workflow run succeeded. |
| Images missing after deploy | File names are case-sensitive on GitHub. They must match `imageManifest.ts` exactly. `npm run build` fails with a list of any missing files. |
| Paths point to `/images/...` | Don't add a leading `/` to asset paths. Keep them relative, as in `render.ts`. |
| WhatsApp shows no picture | The preview needs the absolute URL, which only the GitHub Actions build sets. Check `og:image` in the page source starts with `https://`. |
| Workflow fails at `npm ci` | Commit `package-lock.json` along with `package.json`. |
| Changes to `weddingConfig.ts` don't show in `npm run dev` | The dev server restarts on save. If it doesn't, stop it and run `npm run dev` again. |

## J. Update the site later

Edit `src/data/weddingConfig.ts` (or images), then:

```bash
git add .
git commit -m "Update details"
git push
```

The site redeploys in about a minute.

### Optional: custom domain

Repo → Settings → Pages → *Custom domain*. No code changes are needed, because paths are relative and the
workflow picks up the new URL for previews automatically.

---

## Project structure

```
wedding-invitation/
├── .github/workflows/deploy.yml   GitHub Pages build + deploy
├── docs/PDF-MAPPING.md            PDF page → section mapping, asset manifest
├── index.html                     <head>, meta/OG tags; body is pre-rendered into it
├── public/
│   ├── images/                    13 images × 3 WebP sizes (from the PDF)
│   ├── social-preview.jpg         1200×630 link preview
│   ├── favicon.svg, apple-touch-icon.png
│   └── wedding-events.ics         generated on build from weddingConfig.events
├── scripts/
│   ├── prepare_images.py          extract + optimise images from the PDF
│   └── check-dist.mjs             post-build broken-reference check
├── src/
│   ├── data/weddingConfig.ts      ← all wedding text
│   ├── data/imageManifest.ts      ← image ↔ PDF page ↔ section
│   ├── render.ts                  section markup (runs at build time)
│   ├── main.ts                    envelope, reveals, scenes, countdown, music
│   └── styles/global.css, animations.css
└── vite.config.ts
```

## Privacy note

GitHub Pages sites are public. Anyone with the link can see the names, phone numbers
and venue on the invitation. The site is not listed anywhere, but it is not password-protected.
