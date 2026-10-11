/**
 * Image manifest — maps every picture to its source in the invitation PDF
 * and to the website section that uses it. Order here == story order.
 *
 * Each image exists in public/images/ as:
 *   <file>.webp        full resolution (original pixel size from the PDF)
 *   <file>-640.webp    phone-sized variant
 *   <file>-blur.webp   48px thumbnail, used as a blurred ambient backdrop
 *
 * Regenerate with:  python3 scripts/prepare_images.py <pdf> <rsvp.png>
 */

export interface ImageAsset {
  file: string;
  source: string;
  section: string;
  width: number;
  height: number;
  alt: string;
}

const img = (
  file: string,
  source: string,
  section: string,
  width: number,
  height: number,
  alt: string,
): ImageAsset => ({ file, source, section, width, height, alt });

export const images = {
  cover: img(
    '00-cover', 'cover.png (supplied separately)', 'Opening page — shown right after the envelope', 1024, 1536,
    'Lord Ganesha seated on a lotus throne inside an ivory carved arch, framed by jasmine, roses, lanterns and diyas.',
  ),
  ganesh: img(
    '01-ganesh-invocation', 'PDF page 1', 'Hero — Shri Ganesh invocation', 1024, 1536,
    'Lord Ganesha seated on a lotus-strewn ghat at sunset, with the Vakratunda Mahakaya and Guru Brahma shlokas written below.',
  ),
  saveTheDate: img(
    '02-save-the-date', 'PDF page 2', "We've picked the date", 1024, 1536,
    "A floral arch reading: We've picked the date. Now all that's missing is you.",
  ),
  // PDF page 3 (festive lane, no text) was removed from the invitation at the couple's request.
  twoPeople: img(
    '04-two-people-getting-married', 'PDF page 4', 'Two people are getting married', 656, 1385,
    'Somewhere between all the flowers and festivities… two people are getting married.',
  ),
  coupleNames: img(
    '05-couple-names', 'PDF page 5', 'Couple names', 1024, 1536,
    'A parchment card at a sunset palace terrace reading: Nishtha & Pranshu are making forever official.',
  ),
  formalInvitation: img(
    '06-formal-invitation', 'PDF page 6', 'Formal invitation from the families', 704, 1388,
    'The formal invitation card from the families of Nishtha and Pranshu, set in a candlelit hall.',
  ),
  mehndi: img(
    '07-mehndi', 'PDF page 7', 'Mehndi', 1024, 1536,
    'Mehndi Laga ke Rakhna — invitation card framed in flowers, lanterns and mehndi cones.',
  ),
  haldi: img(
    '08-haldi', 'PDF page 8', 'Haldi', 1024, 1536,
    'Haldi Hues, In our yellow era — a marigold-filled lane in yellow and pink.',
  ),
  sangeetLounge: img(
    '09-sangeet-lounge', 'PDF page 9', 'Scene: Sangeet night (establishing shot)', 1024, 1536,
    'A velvet lounge under disco balls and chandeliers with a glowing sign: A Night Made for Dancing.',
  ),
  thumkaNight: img(
    '10-sangeet-thumka-night', 'PDF page 10', 'Sangeet — Thumka Night', 1024, 1536,
    'Join us for a Thumka Night and Party Lights — a bride in a lehenga dances beside a neon Sangeet Vibes Only sign.',
  ),
  sangeetEvening: img(
    '11-sangeet-evening', 'PDF page 11', 'Sangeet — an evening of rhythm', 940, 1672,
    'An evening filled with rhythm, laughter and cheer. Join us as our happiest moments draw near. Dance more, love always.',
  ),
  weddingDay: img(
    '12-wedding-day', 'PDF page 12', 'The Wedding Day', 940, 1672,
    'The Wedding Day — Two hearts, one forever. A floral arch overlooking the Ganga and the hills of Rishikesh.',
  ),
  rsvp: img(
    '13-rsvp-blessings', 'RSVP card (rsvp.png, supplied separately)', 'RSVP & blessings', 1024, 1536,
    'RSVP card framed in roses and lanterns with contact numbers and family blessings.',
  ),
} as const;

export type ImageKey = keyof typeof images;
