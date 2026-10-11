# One-off fix: the printed Haldi card says '12 AM'; this repaints it as '12 PM'.
# Input: raw page-8 image extracted from the PDF (pdfimages -png); output: p-007-patched.png.
# Then: python3 -c "import sys;sys.path.insert(0,'scripts');import prepare_images as P;from PIL import Image;P.save_variants(Image.open('p-007-patched.png'),'08-haldi')"
# Needs: pip install opencv-python-headless pillow numpy
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
src = Image.open('raw/p-007.png').convert('RGB')
a = np.asarray(src).copy()
Y0, Y1 = 836, 869               # line box
AX0, AX1 = 442, 466             # 'A' glyph box
REST0, REST1 = 466, 632         # 'M onwards'
font = ImageFont.truetype('/home/claude/wedding-invitation/node_modules/@fontsource/lora/files/lora-latin-600-normal.woff', 30)
# size P so its cap height matches the original (rows 841..863 => 23px)
for size in range(20, 44):
    font = ImageFont.truetype(font.path, size)
    b = font.getbbox('P')
    if b[3] - b[1] >= 22: break
pb = font.getbbox('P'); pw = pb[2] - pb[0]
shift = (AX1 - AX0 - 2) - pw  # how far to pull 'M onwards' left
print('font size', size, 'P width', pw, 'shift', shift)

# 1) erase 'A' + rest, inpaint background
mask = np.zeros(a.shape[:2], np.uint8)
dark = (a[Y0:Y1, AX0:REST1].astype(int).sum(2) < 470).astype(np.uint8) * 255
mask[Y0:Y1, AX0:REST1] = cv2.dilate(dark, np.ones((3, 3), np.uint8), iterations=2)
rest = a[Y0:Y1, REST0:REST1].copy()
restmask = mask[Y0:Y1, REST0:REST1].copy()
clean = cv2.inpaint(a, mask, 4, cv2.INPAINT_TELEA)

# 2) paste 'M onwards' back, shifted left, using its own glyph mask (soft)
out = clean.copy()
alpha = cv2.GaussianBlur((restmask > 0).astype(np.float32), (3, 3), 0)[..., None]
dst = out[Y0:Y1, REST0 - shift:REST1 - shift].astype(np.float32)
out[Y0:Y1, REST0 - shift:REST1 - shift] = (rest * alpha + dst * (1 - alpha)).astype(np.uint8)

# 3) draw 'P' in the card's olive ink
img = Image.fromarray(out)
d = ImageDraw.Draw(img)
ink = (58, 62, 6)
x = AX0 + 1 - pb[0]
y = 863 - pb[3]  # baseline match
d.text((x, y), 'P', font=font, fill=ink)
img.save('p-007-patched.png')
img.crop((360, 790, 700, 875)).resize((1020, 255)).save('h3.png')
