/**
 * Pure HTML renderers. These run at BUILD TIME (see vite.config.ts) so the
 * whole invitation is pre-rendered into index.html — it loads fast, works
 * without JavaScript, and link-preview bots can read it.
 * src/main.ts only layers motion and interactivity on top.
 */
import { weddingConfig as C, type WeddingEvent } from './data/weddingConfig';
import { images, type ImageAsset } from './data/imageManifest';

/* ---------- helpers ---------- */

export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const IMG_DIR = 'images/'; // relative => works under any GitHub Pages sub-path

interface PicOpts {
  cls?: string;
  sizes?: string;
  eager?: boolean;
  alt?: string;
}

function pic(a: ImageAsset, o: PicOpts = {}): string {
  const small = `${IMG_DIR}${a.file}-640.webp`;
  const full = `${IMG_DIR}${a.file}.webp`;
  const alt = o.alt ?? a.alt;
  return `<img class="${o.cls ?? ''}" src="${small}" srcset="${small} 640w, ${full} ${a.width}w" sizes="${
    o.sizes ?? '(min-width: 900px) 520px, 92vw'
  }" width="${a.width}" height="${a.height}" alt="${esc(alt)}" ${
    o.eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'
  }>`;
}

/** Tiny blurred copy of an image used as a soft, glowing backdrop. */
const ambient = (a: ImageAsset): string =>
  `<div class="ambient" aria-hidden="true"><img src="${IMG_DIR}${a.file}-blur.webp" alt="" width="48" height="${Math.round(
    (a.height * 48) / a.width,
  )}" decoding="async"></div>`;

const orn = (cls = ''): string =>
  `<svg class="orn ${cls}" viewBox="0 0 220 20" aria-hidden="true" focusable="false"><path d="M4 10h82M134 10h82" stroke="currentColor" stroke-width=".8" fill="none"/><circle cx="92" cy="10" r="1.3" fill="currentColor"/><circle cx="128" cy="10" r="1.3" fill="currentColor"/><g transform="translate(110 10)" fill="currentColor"><path d="M0-8C1.6-3.4 3.4-1.6 8 0 3.4 1.6 1.6 3.4 0 8-1.6 3.4-3.4 1.6-8 0-3.4-1.6-1.6-3.4 0-8Z" opacity=".9"/><circle r="1.6" fill="var(--paper,#fbf4e8)"/></g></svg>`;


/** White kolam (dot-and-loop) motif, as on the plum reference wall. */
const kolam = (cls = ''): string =>
  `<svg class="kolam ${cls}" viewBox="0 0 140 62" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.3">${[
    [70, 9],
    [59, 24], [81, 24],
    [48, 39], [70, 39], [92, 39],
    [37, 54], [59, 54], [81, 54], [103, 54],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.2"/><path d="M${x - 6.2} ${y}q6.2 -11 12.4 0"/>`)
    .join('')}</g><g fill="currentColor">${[
    [70, 9], [59, 24], [81, 24], [48, 39], [70, 39], [92, 39], [37, 54], [59, 54], [81, 54], [103, 54],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`)
    .join('')}</g></svg>`;

let lotusId = 0;
/** A gold lotus hanging from a bead chain, as on the plum reference. */
const lotus = (cls = ''): string => {
  const id = `lotus-g${++lotusId}`;
  return `<svg class="lotus ${cls}" viewBox="0 0 40 106" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8e3a0"/><stop offset=".55" stop-color="#dcae4f"/><stop offset="1" stop-color="#a87a2a"/></linearGradient></defs><path d="M20 0v60" stroke="#d9b05a" stroke-width="1"/><g fill="url(#${id})"><circle cx="20" cy="10" r="2.4"/><circle cx="20" cy="22" r="2.6"/><circle cx="20" cy="34" r="2.4"/><circle cx="20" cy="46" r="2.8"/><path d="M15 58h10l-2 4h-6z"/><path d="M20 92C11 93 3 88 0 82c8-1 15 3 20 10zM20 92c9 1 17-4 20-10-8-1-15 3-20 10z" opacity=".85"/><path d="M20 92c-8-4-13-12-14-22 7 3 12 10 14 22zM20 92c8-4 13-12 14-22-7 3-12 10-14 22z"/><path d="M20 64c5 8 5 20 0 28-5-8-5-20 0-28z"/><ellipse cx="20" cy="94" rx="9" ry="2.6"/><circle cx="20" cy="101" r="2.2"/></g></svg>`;
};

const icon = {
  calendar:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="9.8" r="2.3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1 1 8.6 18.6Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 9.5c.3 2.2 2.3 4.3 4.6 4.8l1-1.1 1.6.8-.4 1.4c-3.7.2-7.5-3.4-7.6-7.3l1.4-.5.8 1.6Z" fill="currentColor"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.2 3.8 9.5 4.4l1.1 3.9-2 1.4a10.6 10.6 0 0 0 5.7 5.7l1.4-2 3.9 1.1.6 2.3c-.2 1.6-1.6 2.9-3.2 2.8C9.9 19.3 4.7 14.1 4.4 7c-.1-1.6 1.2-3 2.8-3.2Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  music:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 17.5V6l10-2v11.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="6.8" cy="17.5" r="2.3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="16.8" cy="15.5" r="2.3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
};

const digits = (phone: string): string => phone.replace(/[^\d]/g, '');

const mapsBtn = (url: string, label = 'Get directions'): string =>
  url
    ? `<a class="btn btn--line" href="${esc(url)}" target="_blank" rel="noopener">${icon.pin}<span>${esc(label)}</span></a>`
    : '';

const A = C.couple.first; // first name shown (Pranshu)
const B = C.couple.second;
const names = `${A} &amp; ${B}`;

/* ---------- reusable blocks ---------- */

/** Event detail tile: centred, compact, no directions button (maps live in the schedule). */
function ticket(e: WeddingEvent, extraCls = '', showName = false): string {
  return `<article class="ticket ticket--center ${extraCls}" aria-labelledby="t-${e.id}">
  <h3 class="${showName ? 'ticket__name' : 'sr-only'}" id="t-${e.id}">${esc(showName ? e.tagline : e.name)}</h3>
  <p class="ticket__date">${esc(e.dateLabel)}</p>
  <p class="ticket__time">${esc(e.timeLabel)}</p>
  <p class="ticket__venue">${icon.pin}<span>${esc(e.venue)}</span></p>
  ${e.dressCode ? `<p class="ticket__dress"><span>Dress code</span>${esc(e.dressCode)}</p>` : ''}
  ${e.note ? `<p class="ticket__note">${esc(e.note)}</p>` : ''}
</article>`;
}

const ev = (id: string): WeddingEvent => {
  const e = C.events.find((x) => x.id === id);
  if (!e) throw new Error(`Missing event "${id}" in weddingConfig.events`);
  return e;
};

interface PlateOpts {
  id: string;
  a: ImageAsset;
  heading: string;
  headingVisible?: boolean;
  body?: string;
  flip?: boolean;
  tone?: 'ivory' | 'blush' | 'cream' | 'night' | 'day';
  cardCls?: string;
}

/** A "plate": the invitation artwork presented as a framed card over a soft
 * glow of itself, with an optional readable text panel beside / below it. */
function plate(o: PlateOpts): string {
  const h = o.headingVisible
    ? `<h2 class="plate__title reveal">${o.heading}</h2>`
    : `<h2 class="sr-only">${o.heading}</h2>`;
  return `<section class="plate tone-${o.tone ?? 'ivory'}${o.flip ? ' plate--flip' : ''}${
    o.body ? '' : ' plate--solo'
  }" id="${o.id}">
  ${ambient(o.a)}
  <div class="plate__inner">
    <figure class="plate__card reveal ${o.cardCls ?? ''}" style="--ar:${(o.a.width / o.a.height).toFixed(3)}">
      ${pic(o.a)}
    </figure>
    ${o.body ? `<div class="plate__text">${h}${o.body}</div>` : h}
  </div>
</section>`;
}


/* ---------- sections, in PDF order ---------- */



const WAX_EDGE = 'M97.1 50.0C97.2 54.0 92.9 58.0 91.6 62.2C90.2 66.4 91.2 71.7 89.0 75.0C86.7 78.4 81.4 79.6 78.1 82.4C74.7 85.1 72.5 89.1 68.9 91.5C65.4 93.9 60.9 96.8 56.7 96.9C52.6 97.0 48.2 93.2 43.9 92.3C39.6 91.4 34.8 93.0 31.1 91.3C27.5 89.7 25.2 85.0 22.1 82.2C18.9 79.4 14.8 77.6 12.1 74.3C9.5 71.1 7.1 66.9 6.2 62.9C5.4 58.8 6.9 54.3 7.1 50.0C7.2 45.7 6.4 41.6 6.9 37.3C7.4 33.1 7.7 27.7 10.2 24.4C12.6 21.1 18.3 20.2 21.7 17.4C25.2 14.6 27.1 9.8 30.7 7.7C34.3 5.5 39.1 5.2 43.4 4.3C47.8 3.4 52.6 1.7 56.8 2.4C61.1 3.1 65.3 6.0 69.1 8.3C72.8 10.6 75.3 13.8 79.3 16.2C83.3 18.5 91.0 18.8 93.0 22.4C94.9 26.0 90.3 33.4 91.0 38.0C91.6 42.6 97.0 46.0 97.1 50.0Z';
let sealId = 0;
/** Poured wax seal: melted irregular edge, raised rim, pressed centre, embossed monogram. */
function waxSeal(cls: string, attrs = ''): string {
  const id = `wax${++sealId}`;
  return `<span class="${cls} wax" ${attrs}><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs>
<radialGradient id="${id}a" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#b3303f"/><stop offset=".42" stop-color="#6f0e1f"/><stop offset="1" stop-color="#36040d"/></radialGradient>
<radialGradient id="${id}b" cx="60%" cy="66%" r="70%"><stop offset="0" stop-color="#8c1828"/><stop offset=".7" stop-color="#5e0b19"/><stop offset="1" stop-color="#3f0611"/></radialGradient>
<linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb0b6" stop-opacity=".75"/><stop offset=".5" stop-color="#ff9aa2" stop-opacity="0"/><stop offset="1" stop-color="#2a0008" stop-opacity=".5"/></linearGradient>
</defs>
<path d="${WAX_EDGE}" fill="url(#${id}a)"/>
<path d="${WAX_EDGE}" fill="none" stroke="url(#${id}c)" stroke-width="1.4"/>
<circle cx="50" cy="50" r="33.5" fill="none" stroke="#5a0b19" stroke-opacity=".55" stroke-width="3"/>
<circle cx="50" cy="50" r="32" fill="url(#${id}b)"/>
<circle cx="50" cy="50" r="32" fill="none" stroke="url(#${id}c)" stroke-width="1.2" transform="rotate(180 50 50)"/>
<circle cx="50" cy="50" r="27" fill="none" stroke="#3d0610" stroke-opacity=".35" stroke-width=".8" stroke-dasharray="1.2 2.2"/>
<path d="M30 30 C 36 22, 46 19, 54 20" fill="none" stroke="#ffe0e3" stroke-opacity=".5" stroke-width="2.8" stroke-linecap="round"/>
<g font-family="'Playfair Display', Georgia, serif" font-weight="600" text-anchor="middle">
<text x="50.6" y="58.2" font-size="22" fill="#ff9fab" fill-opacity=".6">${esc(A[0])}<tspan font-size="14" font-style="italic" dx="1">&amp;</tspan><tspan dx="1">${esc(B[0])}</tspan></text>
<text x="49.4" y="57" font-size="22" fill="#2a0309" fill-opacity=".85">${esc(A[0])}<tspan font-size="14" font-style="italic" dx="1">&amp;</tspan><tspan dx="1">${esc(B[0])}</tspan></text>
<text x="50" y="57.6" font-size="22" fill="#5c0a17">${esc(A[0])}<tspan font-size="14" font-style="italic" dx="1">&amp;</tspan><tspan dx="1">${esc(B[0])}</tspan></text>
</g></svg></span>`;
}

/** Slowly turning gold mandala behind the envelope. */
function mandala(): string {
  const ring = (n: number, r: number, rx: number, ry: number) =>
    Array.from({ length: n }, (_, i) => `<ellipse cx="0" cy="${-r}" rx="${rx}" ry="${ry}" transform="rotate(${(360 / n) * i})"/>`).join('');
  const dots = (n: number, r: number, d: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((Math.PI * 2) / n) * i;
      return `<circle cx="${(Math.sin(a) * r).toFixed(1)}" cy="${(-Math.cos(a) * r).toFixed(1)}" r="${d}"/>`;
    }).join('');
  return `<svg class="mandala" viewBox="-200 -200 400 400" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1">${ring(
    12, 48, 10, 26)}${ring(24, 110, 9, 30)}${ring(36, 168, 7, 22)}<circle r="22"/><circle r="78"/><circle r="140"/><circle r="194"/></g><g fill="currentColor">${dots(
    24, 78, 2.2)}${dots(48, 140, 1.8)}${dots(72, 194, 1.4)}</g></svg>`;
}

/** One palace door for the royal reveal: carved arch, lotus-bud kalash finial, jaali dots. */
function door(side: 'l' | 'r'): string {
  const jaali = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => `<circle cx="${70 + c * 20}" cy="${236 + r * 34}" r="2.2"/>`).join(''),
  ).join('');
  return `<div class="door door--${side}"><svg class="door__art" viewBox="0 0 200 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><g fill="none" stroke="#e6c46e" stroke-width="1.6"><path d="M40 560V196q0-62 60-114 60 52 60 114v364z"/><path d="M52 548V202q0-52 48-98 48 46 48 98v346z" stroke-opacity=".55"/><path d="M28 572h144" stroke-opacity=".7"/></g><g fill="#e6c46e"><path d="M100 40c7 9 7 19 0 27-7-8-7-18 0-27z"/><path d="M100 67c-9-1-15-6-17-12 8 0 13 4 17 12zM100 67c9-1 15-6 17-12-8 0-13 4-17 12z" fill-opacity=".8"/><circle cx="100" cy="34" r="3"/><g fill-opacity=".5">${jaali}</g></g></svg></div>`;
}

function envelope(): string {
  return `<div class="envelope" id="envelope" role="dialog" aria-modal="true" aria-labelledby="env-names">
  <div class="envelope__bg" aria-hidden="true">
    ${ambient(images.cover)}
    ${mandala()}
    <div class="gold-dust"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    ${lotus('lotus--env lotus--l')}${lotus('lotus--env lotus--r')}
  </div>
  <div class="doors" aria-hidden="true">${door('l')}${door('r')}<div class="doors__light"></div></div>
  <div class="envelope__stage">
    ${kolam('envelope__kolam')}
    <p class="envelope__eyebrow">${esc(C.envelope.eyebrow)}</p>
    <p class="envelope__names script" id="env-names">${esc(A)} <span class="amp">&amp;</span> ${esc(B)}</p>
    <p class="envelope__line">${esc(C.envelope.line)}</p>
    <button type="button" class="env" id="open-invite" aria-label="${esc(C.envelope.cta)}">
      <span class="env__back"></span>
      <span class="env__letter">
        ${orn('orn--sm')}
        <span class="env__letter-names script">${esc(A)} &amp; ${esc(B)}</span>
        <span class="env__letter-date">${esc(C.weddingDate.short)}</span>
      </span>
      <span class="env__pocket"></span>
      <span class="env__flap"></span>
      ${waxSeal('env__seal')}
      <span class="env__burst"></span>
    </button>
    <p class="envelope__hint" aria-hidden="true">Tap the envelope to open</p>
  </div>
</div>`;
}

function hero(): string {
  const a = images.cover;
  return `<header class="opening" id="top">
  ${ambient(a)}
  <div class="opening__decor" aria-hidden="true">${mandala()}</div>
  <div class="hero__petals" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div class="opening__inner">
    <figure class="opening__art">
      ${pic(a, { eager: true, sizes: '(min-width: 900px) 56svh, 96vw', cls: 'opening__img' })}
      <p class="opening__invocation" lang="sa">॥ श्री गणेशाय नमः ॥</p>
      <figcaption class="opening__shloka" lang="sa">
        <span>वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः ।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</span>
        <span>गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ।<br>गुरुः साक्षात् परब्रह्म तस्मै श्रीगुरवे नमः ॥</span>
      </figcaption>
    </figure>
    <div class="opening__side">
    <div class="opening__tile">
      ${lotus('lotus--l')}${lotus('lotus--r')}
      ${kolam('opening__kolam')}
      <p class="opening__eyebrow">The wedding of</p>
      <h1 class="opening__names script"><span>${esc(A)}</span><span class="amp">&amp;</span><span>${esc(B)}</span></h1>
      ${orn('orn--gold')}
      <p class="opening__date">${esc(C.weddingDate.short)}</p>
      <p class="opening__city">${esc(C.venue.city)}</p>
    </div>
    ${countdownBox()}
    </div>
  </div>
  <a class="hero__cue opening__cue" href="#family-invitation"><span>Scroll</span><i aria-hidden="true"></i></a>
</header>`;
}

/** Countdown tile — shown under the name tile on the opening page. */
function countdownBox(): string {
  return `<div class="panel countdown-tile">
    <p class="eyebrow">The countdown has begun</p>
    <div class="countdown" data-countdown="${C.weddingDate.countdownTargetISO}" role="timer" aria-live="off">
      <div><span data-unit="d">--</span><small>Days</small></div>
      <div><span data-unit="h">--</span><small>Hours</small></div>
      <div><span data-unit="m">--</span><small>Minutes</small></div>
      <div><span data-unit="s">--</span><small>Seconds</small></div>
    </div>
    <p class="countdown__done" hidden>Today is the day. Welcome!</p>
    <p class="countdown-tile__to">to the Baraat · ${esc(C.weddingDate.label)}</p>
  </div>`;
}

function formalInvitation(): string {
  const f = C.formalInvitation;
  const body = `<div class="panel panel--stationery rich-tile">
    ${kolam('rich-tile__kolam reveal')}
    <p class="inv__invocation reveal">${esc(f.invocation)}</p>
    <p class="inv__italic reveal">${esc(f.opening)}</p>
    <ul class="inv__family reveal">${f.hostFamily.map((n) => `<li>${n.split(' & ').map((part, i, all) => `<span class="nb">${esc(part)}${i < all.length - 1 ? ' &amp;' : ''}</span>`).join(' ')}</li>`).join('')}</ul>
    <p class="inv__italic reveal">${esc(f.inviteLine)}</p>
    <p class="inv__name script reveal">${esc(A)}</p>
    <p class="inv__with reveal">with</p>
    <p class="inv__name script reveal">${esc(B)}</p>
    ${orn('orn--gold reveal')}
    <p class="inv__italic reveal">${esc(f.otherParentsLine)}</p>
    <p class="inv__parents reveal">${f.otherParents.split(' & ').map((part, i, all) => `<span class="nb">${esc(part)}${i < all.length - 1 ? ' &amp;' : ''}</span>`).join(' ')}</p>
  </div>`;
  return `<section class="textpage" id="family-invitation">
  <div class="textpage__inner">
    <h2 class="sr-only">The invitation</h2>
    ${body}
  </div>
</section>`;
}

function mehndi(): string {
  return plate({
    id: 'mehndi',
    a: images.mehndi,
    heading: '<span class="script">Mehndi</span> <small>Laga ke Rakhna</small>',
    headingVisible: true,
    body: `<div class="tickets">${ticket(ev('mehndi'))}${ticket(ev('photoshoot'), 'ticket--minor', true)}</div>`,
    tone: 'blush',
  });
}

function haldi(): string {
  return plate({
    id: 'haldi',
    a: images.haldi,
    heading: '<span class="script">Haldi Hues</span> <small>In our yellow era</small>',
    headingVisible: true,
    body: `<div class="tickets">${ticket(ev('haldi'))}</div>`,
    flip: true,
    tone: 'day',
  });
}

function sangeet(): string {
  return `<div class="night">
  <div class="sparkles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  ${plate({
    id: 'sangeet',
    a: images.thumkaNight,
    heading: '<span class="script">Sangeet Night</span> <small>and Party Lights</small>',
    headingVisible: true,
    body: `<div class="tickets">${ticket(ev('sangeet'), 'ticket--night')}</div>`,
    tone: 'night',
  }).replace(ambient(images.thumkaNight), ambient(images.sangeetLounge))}
</div>`;
}

function weddingDay(): string {
  return plate({
    id: 'wedding',
    a: images.weddingDay,
    heading: '<small>The</small> <span class="script">Wedding Day</span>',
    headingVisible: true,
    body: `<p class="plate__tagline reveal">${esc(ev('wedding').tagline)}</p><div class="tickets">${ticket(ev('wedding'))}</div>`,
    flip: true,
    tone: 'day',
    cardCls: 'plate__card--wide',
  });
}

function schedule(): string {
  const rows = C.events
    .map(
      (e) => `<li class="tl__item reveal">
      <p class="tl__when"><span class="tl__date">${esc(e.dateLabel.replace(/ 2026$/, ''))}</span><span class="tl__time">${esc(e.timeLabel)}</span></p>
      <h3 class="tl__name">${esc(e.name)}</h3>
      <p class="tl__venue">${esc(e.venue)}</p>
      ${e.dressCode ? `<p class="tl__dress"><span class="tl__dress-label">Dress code</span><span class="tl__dress-value">${esc(e.dressCode)}</span></p>` : ''}
    </li>`,
    )
    .join('');
  return `<section class="schedule" id="schedule">
  <div class="schedule__inner">
    <p class="eyebrow reveal">December 2026</p>
    <h2 class="section-title reveal">The Celebrations</h2>
    ${orn('reveal')}
    <ol class="tl">${rows}</ol>
    <div class="schedule__actions reveal">
      <a class="btn btn--gold" href="wedding-events.ics" download>${icon.calendar}<span>Add all to calendar</span></a>
    </div>
  </div>
</section>`;
}

function travel(): string {
  const items = C.travel.items.filter((t) => t.text);
  if (!items.length) return '';
  return `<section class="textpage textpage--travel" id="travel">
  <div class="textpage__inner">
    <h2 class="section-title reveal">${esc(C.travel.title)}</h2>
    ${orn('reveal')}
    <dl class="travel reveal">${items
      .map((t) => `<div class="travel__item"><dt>${esc(t.label)}</dt><dd>${esc(t.text)}</dd></div>`)
      .join('')}</dl>
  </div>
</section>`;
}

function rsvp(): string {
  const r = C.rsvp;
  const msg = r.whatsappMessage ? `?text=${encodeURIComponent(r.whatsappMessage)}` : '';
  const contacts = r.contacts
    .map(
      (c) => `<li class="contact">
      <p class="contact__name script">${esc(c.name)}</p>
      <p class="contact__phone"><a href="tel:+${digits(c.phone)}">${esc(c.phone)}</a></p>
      <div class="contact__btns">
        <a class="btn btn--gold btn--sm" href="https://wa.me/${digits(c.phone)}${msg}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(
          c.name,
        )}">${icon.chat}<span>WhatsApp</span></a>
        <a class="btn btn--line btn--sm" href="tel:+${digits(c.phone)}" aria-label="Call ${esc(c.name)}">${icon.phone}<span>Call</span></a>
      </div>
    </li>`,
    )
    .join('');
  const body = `<div class="panel panel--rsvp">
    <p class="rsvp__welcome reveal">${esc(r.welcome)}</p>
    <p class="rsvp__msg reveal">${esc(r.message)}</p>
    ${orn('reveal')}
    <p class="rsvp__label reveal">RSVP</p>
    ${r.formUrl ? `<p class="reveal rsvp__form"><a class="btn btn--gold" href="${esc(r.formUrl)}" target="_blank" rel="noopener">RSVP online</a></p><p class="rsvp__or reveal">or message us</p>` : ''}
    <ul class="contacts reveal">${contacts}</ul>
    ${r.eventManager?.name ? `<div class="manager reveal">
      ${orn('orn--gold')}
      <div class="manager__grid"><div class="manager__info">
      <p class="manager__label">Event Manager</p>
      <p class="manager__note">${esc(r.eventManager.note)}</p>
      </div><div class="manager__contact">
      <p class="manager__name script">${esc(r.eventManager.name)}</p>
      <p class="contact__phone"><a href="tel:+${digits(r.eventManager.phone)}">${esc(r.eventManager.phone)}</a></p>
      <div class="contact__btns">
        <a class="btn btn--gold btn--sm" href="https://wa.me/${digits(r.eventManager.phone)}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(r.eventManager.name)}, event manager">${icon.chat}<span>WhatsApp</span></a>
        <a class="btn btn--line btn--sm" href="tel:+${digits(r.eventManager.phone)}" aria-label="Call ${esc(r.eventManager.name)}, event manager">${icon.phone}<span>Call</span></a>
      </div>
      </div></div>
    </div>` : ''}
    <div class="reveal rsvp__dir">${mapsBtn(C.venue.mapsUrl, 'Directions to venue')}</div>
  </div>`;
  return `<section class="textpage textpage--rsvp" id="rsvp">
  <div class="textpage__inner">
    <h2 class="sr-only">RSVP</h2>
    ${body}
  </div>
</section>`;
}

function closing(): string {
  return `<footer class="closing" id="blessings">
  ${ambient(images.weddingDay)}
  <div class="closing__inner">
    <div class="kids blessings-tile reveal">
      <h2 class="blessings-tile__title">${esc(C.compliments.heading)}</h2>
      <ul class="closing__names">${C.compliments.names.map((n) => `<li>${n.split(/ (&|and) /).reduce((acc: string[], part, i, all) => (i % 2 === 0 ? [...acc, `<span class="nb">${esc(part)}${all[i + 1] ? ` ${all[i + 1] === '&' ? '&amp;' : 'and'}` : ''}</span>`] : acc), []).join(' ')}</li>`).join('')}</ul>
      ${orn('orn--gold')}
      <p class="kids__to">${esc(C.kidsNote.to)}</p>
      <p class="kids__msg">${esc(C.kidsNote.message)}</p>
      <p class="kids__from">— ${esc(C.kidsNote.from)}</p>
    </div>
    ${waxSeal('closing__seal reveal', 'aria-hidden="true"')}
    <p class="closing__names-big script reveal">${names}</p>
    <p class="closing__date reveal"><span class="nb">${esc(C.weddingDate.short)}</span><br><span class="nb">${esc(C.venue.name)}, ${esc(C.venue.city)}</span></p>
    <p class="closing__signoff reveal">${esc(C.closing.signoff)}</p>
    <a class="closing__top" href="#top">Back to the beginning ↑</a>
  </div>
</footer>`;
}

function floatingRsvp(): string {
  if (!C.floatingRsvpLabel) return '';
  return `<a class="fab-rsvp" id="fab-rsvp" href="#rsvp">${esc(C.floatingRsvpLabel)}</a>`;
}

function musicControl(): string {
  if (!C.music.src) return '';
  return `<button type="button" class="music" id="music" aria-pressed="false" aria-label="Play background music" data-src="${esc(
    C.music.src,
  )}" hidden>${icon.music}<span class="music__bars" aria-hidden="true"><i></i><i></i><i></i></span></button>`;
}

/** Full <body> content. */
export function renderBody(): string {
  return [
    '<div class="page-border page-border--l" aria-hidden="true"></div><div class="page-border page-border--r" aria-hidden="true"></div>',
    envelope(),
    '<main id="invitation">',
    hero(),
    formalInvitation(),
    mehndi(),
    haldi(),
    sangeet(),
    weddingDay(),
    schedule(),
    travel(),
    rsvp(),
    '</main>',
    closing(),
    floatingRsvp(),
    musicControl(),
  ].join('\n');
}

/* ---------- calendar file ---------- */

const icsDate = (iso: string): string => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function renderICS(): string {
  const stamp = icsDate(new Date('2026-10-01T00:00:00Z').toISOString());
  const fold = (s: string) => s.replace(/[,;\\]/g, (m) => '\\' + m);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pranshu & Nishtha//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const e of C.events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}-2026@pranshu-nishtha-wedding`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsDate(e.startISO)}`,
      `SUMMARY:${fold(`${e.name} · ${A} & ${B}`)}`,
      `LOCATION:${fold(e.venue)}`,
      `DESCRIPTION:${fold(`${e.tagline} — ${e.timeLabel}${e.mapsUrl ? ` — ${e.mapsUrl}` : ''}`)}`,
      ...(e.mapsUrl ? [`URL:${e.mapsUrl}`] : []),
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
