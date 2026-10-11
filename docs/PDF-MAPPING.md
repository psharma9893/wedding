# PDF → website mapping

Source: `NishthawedsPranshu Wedding Invitation.pdf` (12 pages, one full-page
image per page, no selectable text) and `rsvp.png` (the RSVP card, supplied separately).
Every original image was extracted at its native resolution with
`scripts/prepare_images.py`. Nothing was re-rendered or upscaled.

## Story order (current)

| # | Source | Website section (`id`) | How it is used |
|---|--------|------------------------|----------------|
| — | — | **Envelope** | Royal opening: mandala, gold dust, lotuses; seal burst → flap → letter → palace doors open → petal shower. Dates: 11th & 12th December 2026. |
| 0 + 1 | `cover.png` + PDF p1 shlokas | **Opening page** (`#top`) | Cover art with shlokas set into it; rich name tile; the **countdown tile** sits below the name tile. |
| 2 | PDF p2 | — | Removed (its countdown moved to the opening page). |
| 3, 4 | PDF p3, p4 | — | Removed. |
| 5 | PDF p5 | — | Removed (redundant with the opening tile). |
| 6 | PDF p6 (text, rewritten for the groom's side) | **The invitation** (`#family-invitation`) | Rich framed text tile: Pranshu's grandparents and parents, "union of their son Pranshu with Nishtha, beloved daughter of Mr Sharad Kumar & Mrs Alpana". |
| 7 | PDF p7 | **Mehndi** (`#mehndi`) | Card + tiles. Dress code: shades of green / pink. |
| 8 | PDF p8 (patched to 12 PM) | **Haldi** (`#haldi`) | Card + tile. Dress code: shades of yellow. |
| 9 | PDF p9 | (background glow) | Lounge image used as the blurred glow behind the Sangeet page. |
| 10 | PDF p10 | **Sangeet Night** (`#sangeet`) | Thumka Night card with the Sangeet tile beside it. Dress code: blingy. |
| 11 | PDF p11 | — | Removed. |
| 12 | PDF p12 | **Wedding Day** (`#wedding`) | Card + tile. Dress code: traditional. |
| — | — | **The Celebrations**, **Travel & Stay**, **RSVP**, **Closing** | Framed text tiles. |

## Asset manifest

All files are in `public/images/`. Each has `<name>.webp` (full size), `<name>-640.webp` and `<name>-blur.webp`.

| File | Source | Pixel size | Processing |
|------|--------|-----------|------------|
| `01-ganesh-invocation` | PDF p1 | 1024×1536 | none |
| `02-save-the-date` | PDF p2 | 1024×1536 | none |
| `03-festive-lane` | PDF p3 | 940×1672 | none |
| `04-two-people-getting-married` | PDF p4 | 656×1385 | cropped: screenshot border and watermark |
| `05-couple-names` | PDF p5 | 1024×1536 | none (also cropped into `public/social-preview.jpg`) |
| `06-formal-invitation` | PDF p6 | 704×1388 | cropped: bottom watermark |
| `07-mehndi` | PDF p7 | 1024×1536 | none |
| `08-haldi` | PDF p8 | 1024×1536 | none |
| `09-sangeet-lounge` | PDF p9 | 1024×1536 | none |
| `10-sangeet-thumka-night` | PDF p10 | 1024×1536 | none |
| `11-sangeet-evening` | PDF p11 | 940×1672 | none |
| `12-wedding-day` | PDF p12 | 940×1672 | none |
| `13-rsvp-blessings` | rsvp.png | 1024×1536 | none |

The same mapping lives in code in `src/data/imageManifest.ts`.

## Text decisions

* All event text is real HTML, taken from `src/data/weddingConfig.ts` and checked against zoomed crops of each page.
* Card text is not run through OCR into the page. Where the artwork's text is small or important (formal invitation, event details, RSVP), the website repeats it as readable HTML next to the card.
* Corrections: Haldi "12 AM" is shown as 12 PM (confirmed). "your presence make" on the RSVP card is shown as "makes". "Sudha sharma" is capitalised as "Sudha Sharma".
