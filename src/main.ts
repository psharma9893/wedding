// Google Fonts, self-hosted (latin subset only) — no third-party requests
// Playfair Display: headings · EB Garamond: body text · Prata: small-caps labels & buttons
// Great Vibes: names & accents · Tiro Devanagari: shlokas
import '@fontsource/playfair-display/latin-500.css';
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/eb-garamond/latin-600.css';
import '@fontsource/eb-garamond/latin-500-italic.css';
import '@fontsource/prata/latin-400.css';
import '@fontsource/great-vibes/latin-400.css';
import '@fontsource/tiro-devanagari-hindi/devanagari-400.css'; // ॥ श्री गणेशाय नमः ॥ on the cover
import './styles/global.css';
import './styles/animations.css';
import './styles/theme-plum.css';

declare global {
  interface Window {
    __inviteReady?: boolean;
  }
}

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
window.__inviteReady = true;

/* ---------------- Envelope ---------------- */
function initEnvelope(): void {
  const env = document.getElementById('envelope');
  const btn = document.getElementById('open-invite') as HTMLButtonElement | null;
  if (!env || !btn) return;

  if (!root.classList.contains('env-open')) {
    env.remove();
    return;
  }
  const main = document.getElementById('invitation');
  main?.setAttribute('aria-hidden', 'true');
  // No auto-focus (it would draw a focus ring for tap users); Tab lands on the envelope.

  let opened = false;
  const open = () => {
    if (opened) return;
    opened = true;
    env.classList.add('is-opening');
    // fired inside the tap so optional music is allowed to start
    document.dispatchEvent(new CustomEvent('invite:opened'));
    const done = () => {
      root.classList.remove('env-open');
      main?.removeAttribute('aria-hidden');
      env.remove();
      document.getElementById('top')?.classList.add('is-revealed');
    };
    if (reduceMotion.matches) {
      window.setTimeout(done, 300);
      return;
    }
    // Royal sequence: seal bursts → flap opens → letter rises → palace doors
    // appear and swing open in a wash of gold light and a shower of petals.
    window.setTimeout(() => env.classList.add('is-gate'), 1350);
    window.setTimeout(() => {
      env.classList.add('is-gate-open');
      window.scrollTo(0, 0);
      document.getElementById('top')?.classList.add('is-revealed');
      showerPetals();
    }, 1950);
    window.setTimeout(done, 3500);
  };
  btn.addEventListener('click', open);
  // While the envelope is showing it is the only control: Tab always lands on it,
  // Enter/Space open it (native button), Escape skips the animation.
  const onKey = (e: KeyboardEvent) => {
    if (!document.getElementById('envelope')) return document.removeEventListener('keydown', onKey);
    if (e.key === 'Escape') open();
    if (e.key === 'Tab') {
      e.preventDefault();
      btn.focus();
    }
  };
  document.addEventListener('keydown', onKey);
}

/* ---------------- Petal & gold-leaf shower ----------------
 * Starts as the palace doors open and keeps falling gently for the whole
 * invitation. Density is 20% higher than the original opening burst
 * (34 → 41 petals on phones, 56 → 67 on larger screens). Each petal loops
 * forever on the GPU (transform/opacity only), so no JavaScript runs after start.
 */
function showerPetals(): void {
  if (document.querySelector('.shower') || reduceMotion.matches) return;
  const count = window.innerWidth < 600 ? 41 : 67;
  const box = document.createElement('div');
  box.className = 'shower';
  box.setAttribute('aria-hidden', 'true');
  const kinds = ['rose', 'rose-deep', 'rose', 'rose-crimson', 'rose-deep']; // red rose petals
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.className = `shower__p shower__p--${kinds[i % kinds.length]}`;
    const size = 10 + Math.random() * 10;
    const dur = 5 + Math.random() * 4; // 5–9 s per fall
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * 1.25}px;--dx:${(Math.random() - 0.5) * 160}px;--rot:${
      360 + Math.random() * 540
    }deg;animation-duration:${dur.toFixed(2)}s;animation-delay:-${(Math.random() * dur).toFixed(2)}s`;
    box.appendChild(p);
  }
  document.body.appendChild(box);
}

/* ---------------- Reveal on scroll ---------------- */
function initReveal(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  // stagger siblings inside the same container
  const groups = new Map<Element, number>();
  els.forEach((el) => {
    const p = el.parentElement!;
    const i = groups.get(p) ?? 0;
    groups.set(p, i + 1);
    el.style.setProperty('--d', `${Math.min(i, 8) * 90}ms`);
  });
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------------- Pinned scenes (scroll progress -> --p) ---------------- */
function initScenes(): void {
  const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
  if (!scenes.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    if (reduceMotion.matches) {
      scenes.forEach((s) => s.style.setProperty('--p', '1'));
      return;
    }
    const vh = window.innerHeight;
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const travel = Math.max(1, r.height - vh);
      const p = Math.min(1, Math.max(0, -r.top / travel));
      s.style.setProperty('--p', p.toFixed(3));
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reduceMotion.addEventListener?.('change', onScroll);
  update();
}

/* ---------------- Countdown ---------------- */
function initCountdown(): void {
  const el = document.querySelector<HTMLElement>('[data-countdown]');
  if (!el) return;
  const target = new Date(el.dataset.countdown!).getTime();
  if (Number.isNaN(target)) return;
  const units = {
    d: el.querySelector<HTMLElement>('[data-unit="d"]')!,
    h: el.querySelector<HTMLElement>('[data-unit="h"]')!,
    m: el.querySelector<HTMLElement>('[data-unit="m"]')!,
    s: el.querySelector<HTMLElement>('[data-unit="s"]')!,
  };
  const pad = (n: number) => String(n).padStart(2, '0');
  let timer = 0;
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      window.clearInterval(timer);
      el.hidden = true;
      const done = el.parentElement?.querySelector<HTMLElement>('.countdown__done');
      if (done) done.hidden = false;
      return;
    }
    const s = Math.floor(diff / 1000);
    units.d.textContent = String(Math.floor(s / 86400));
    units.h.textContent = pad(Math.floor((s % 86400) / 3600));
    units.m.textContent = pad(Math.floor((s % 3600) / 60));
    units.s.textContent = pad(s % 60);
    el.setAttribute('aria-label', `${Math.floor(s / 86400)} days to go`);
  };
  tick();
  timer = window.setInterval(tick, 1000);
}

/* ---------------- Background music ----------------
 * Browsers only allow sound after a user gesture, so the music starts on the
 * envelope tap and fades in gently. A small, subtle mute button stays in the
 * bottom-left corner; the guest's choice is remembered. Music pauses while the
 * tab is hidden and resumes when they come back.
 */
function initMusic(): void {
  const btn = document.getElementById('music') as HTMLButtonElement | null;
  if (!btn?.dataset.src) return;
  const target = Math.min(1, Math.max(0, parseFloat(btn.dataset.volume || '0.55')));
  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'none';
  audio.src = btn.dataset.src;
  let muted = false;
  try {
    muted = localStorage.getItem('invite-muted') === '1';
  } catch {
    /* storage unavailable */
  }
  let fadeTimer = 0;
  let wantPlay = false; // true once the guest has opened the invite (or tapped unmute)

  const render = () => {
    btn.classList.toggle('is-muted', muted);
    btn.setAttribute('aria-pressed', String(muted));
    btn.setAttribute('aria-label', muted ? 'Play music' : 'Mute music');
  };
  const fadeTo = (v: number, ms: number, done?: () => void) => {
    window.clearInterval(fadeTimer);
    const start = audio.volume;
    const t0 = performance.now();
    fadeTimer = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      try {
        audio.volume = start + (v - start) * k; // ignored on iOS (fixed volume) — harmless
      } catch {
        /* ignore */
      }
      if (k >= 1) {
        window.clearInterval(fadeTimer);
        done?.();
      }
    }, 50);
  };
  const play = () => {
    if (muted) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => fadeTo(target, 2500))
      .catch(() => {
        /* autoplay blocked: the button still lets the guest start it */
      });
  };
  const pause = () => fadeTo(0, 400, () => audio.pause());

  audio.addEventListener('error', () => btn.remove()); // missing / unsupported file: hide quietly

  // Warm up the file while the guest looks at the envelope, so it starts instantly on tap.
  const warm = () => {
    audio.preload = 'auto';
    audio.load();
  };
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(warm, { timeout: 2500 });
  else setTimeout(warm, 1500);

  btn.hidden = false;
  render();
  btn.addEventListener('click', () => {
    muted = !muted;
    try {
      localStorage.setItem('invite-muted', muted ? '1' : '0');
    } catch {
      /* ignore */
    }
    render();
    if (muted) pause();
    else {
      wantPlay = true;
      play();
    }
  });
  // Envelope tap = user gesture, so sound is allowed to start here.
  document.addEventListener('invite:opened', () => {
    wantPlay = true;
    play();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!audio.paused) audio.pause();
    } else if (wantPlay && !muted) play();
  });
}

/* ---------------- Floating RSVP button ---------------- */
function initFab(): void {
  const fab = document.getElementById('fab-rsvp');
  const hero = document.getElementById('top');
  if (!fab || !hero || !('IntersectionObserver' in window)) return;
  const hideNear = ['rsvp', 'blessings'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
  const state = { heroVisible: true, endVisible: new Set<Element>() };
  const sync = () => fab.classList.toggle('is-visible', !state.heroVisible && state.endVisible.size === 0);
  new IntersectionObserver(([e]) => { state.heroVisible = e.isIntersecting; sync(); }, { threshold: 0.15 }).observe(hero);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? state.endVisible.add(e.target) : state.endVisible.delete(e.target)));
    sync();
  });
  hideNear.forEach((el) => io.observe(el));
}

initEnvelope();
initFab();
initReveal();
initScenes();
initCountdown();
initMusic();
if (!document.getElementById('envelope')) {
  document.getElementById('top')?.classList.add('is-revealed');
  showerPetals();
}
