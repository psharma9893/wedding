#!/usr/bin/env python3
"""
Rebuild the website's image assets from the original invitation sources.

Usage (from the project root):
    pip install pypdf pillow numpy
    python3 scripts/prepare_images.py "path/to/Invitation.pdf" "path/to/rsvp.png" ["path/to/cover.png"]

What it does
  * Pulls the ORIGINAL embedded image out of every PDF page (no re-rendering,
    so no quality loss), in PDF order.
  * Trims the phone-screenshot borders/watermark present on pages 4 and 6.
  * Writes, per image, into public/images/:
        <name>-640.webp    small variant  (phones, srcset)
        <name>.webp        full-resolution variant (original pixel size)
        <name>-blur.webp   48px-wide thumbnail used as a blurred ambient backdrop
  * Builds public/social-preview.jpg (1200x630) for WhatsApp / Open Graph.

Page order -> filenames is defined in ORDER below and mirrored in
src/data/imageManifest.ts. Keep them in sync if you change anything.
"""
import io
import sys
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images"

# (pdf page number, asset name, optional crop box as fractions l,t,r,b)
ORDER = [
    (1, "01-ganesh-invocation", None),
    (2, "02-save-the-date", None),
    # page 3 (festive lane) intentionally not used on the site
    # page 4 is a phone screenshot: black bar at bottom, rounded corners, watermark
    (4, "04-two-people-getting-married", (12 / 704, 0, 668 / 704, 1385 / 1527)),
    (5, "05-couple-names", None),
    # page 6: trim the generator watermark at the bottom-right
    (6, "06-formal-invitation", (0, 0, 1, 1388 / 1527)),
    (7, "07-mehndi", None),
    (8, "08-haldi", None),
    (9, "09-sangeet-lounge", None),
    (10, "10-sangeet-thumka-night", None),
    (11, "11-sangeet-evening", None),
    (12, "12-wedding-day", None),
]
RSVP_NAME = "13-rsvp-blessings"
COVER_NAME = "00-cover"  # opening page shown right after the envelope (cover.png)


def page_image(reader: PdfReader, page_no: int) -> Image.Image:
    page = reader.pages[page_no - 1]
    imgs = list(page.images)
    if not imgs:
        raise SystemExit(f"Page {page_no} has no embedded image")
    # one large image per page in this PDF; pick the biggest just in case
    best = max(imgs, key=lambda im: im.image.width * im.image.height)
    return best.image.convert("RGB")


def crop(im: Image.Image, box):
    if not box:
        return im
    w, h = im.size
    l, t, r, b = box
    return im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))


def save_variants(im: Image.Image, name: str):
    OUT.mkdir(parents=True, exist_ok=True)
    w, h = im.size
    im.save(OUT / f"{name}.webp", "WEBP", quality=84, method=6)
    small = im.resize((640, round(h * 640 / w)), Image.LANCZOS)
    small.save(OUT / f"{name}-640.webp", "WEBP", quality=80, method=6)
    tiny = im.resize((48, round(h * 48 / w)), Image.LANCZOS)
    tiny.save(OUT / f"{name}-blur.webp", "WEBP", quality=60)
    print(f"  {name}: {w}x{h}")
    return w, h


def social_preview(names_card: Image.Image):
    """1200x630 crop around the 'Nishtha & Pranshu' card on page 5."""
    w, h = names_card.size
    target_ratio = 1200 / 630
    cw = w
    ch = round(cw / target_ratio)
    cy = round(h * 0.69)  # vertical centre of the names card
    top = max(0, min(h - ch, cy - ch // 2))
    prev = names_card.crop((0, top, cw, top + ch)).resize((1200, 630), Image.LANCZOS)
    prev.save(ROOT / "public" / "social-preview.jpg", "JPEG", quality=86, optimize=True, progressive=True)
    print("  social-preview.jpg: 1200x630")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        raise SystemExit(1)
    pdf, rsvp = Path(sys.argv[1]), Path(sys.argv[2])
    reader = PdfReader(str(pdf))
    print(f"PDF has {len(reader.pages)} pages")
    sizes = {}
    for page_no, name, box in ORDER:
        im = crop(page_image(reader, page_no), box)
        sizes[name] = save_variants(im, name)
        if name == "05-couple-names":
            social_preview(im)
    sizes[RSVP_NAME] = save_variants(Image.open(rsvp).convert("RGB"), RSVP_NAME)
    if len(sys.argv) > 3:
        sizes[COVER_NAME] = save_variants(Image.open(sys.argv[3]).convert("RGB"), COVER_NAME)
    print("\nDimensions (copy into src/data/imageManifest.ts if they changed):")
    for k, (w, h) in sizes.items():
        print(f"  {k}: {w} x {h}")


if __name__ == "__main__":
    main()
