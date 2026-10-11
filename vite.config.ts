import { defineConfig, type Plugin } from 'vite';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderBody, renderICS, esc } from './src/render';
import { weddingConfig } from './src/data/weddingConfig';

/**
 * DEPLOYMENT PATHS
 * ----------------
 * base: './'  — every asset URL is relative, so the same build works at
 *   https://<user>.github.io/<any-repo-name>/, at a custom domain, or locally.
 *   You never need to hard-code the repository name.
 *
 * SITE_URL — the absolute public URL of the site (with trailing slash). Only
 *   used for link-preview tags (og:image must be absolute for WhatsApp).
 *   The GitHub Actions workflow sets it automatically from GitHub Pages.
 *   For a manual build:  SITE_URL=https://me.github.io/wedding-invitation/ npm run build
 */
const SITE_URL = (process.env.SITE_URL || '').replace(/\/?$/, process.env.SITE_URL ? '/' : '');

function invitation(): Plugin {
  const ics = fileURLToPath(new URL('./public/wedding-events.ics', import.meta.url));
  return {
    name: 'prerender-invitation',
    buildStart() {
      // calendar file generated from weddingConfig.events
      writeFileSync(ics, renderICS());
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const s = weddingConfig.share;
        const og = SITE_URL ? `${SITE_URL}social-preview.jpg` : 'social-preview.jpg';
        return html
          .replace(/%SHARE_TITLE%/g, esc(s.title))
          .replace(/%SHARE_DESC%/g, esc(s.description))
          .replace(/%THEME_COLOR%/g, s.themeColor)
          .replace(/%OG_IMAGE%/g, og)
          .replace('%OG_URL%', SITE_URL ? `<meta property="og:url" content="${SITE_URL}" />` : '')
          .replace('<!--APP-->', renderBody());
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [invitation()],
  build: {
    target: 'es2019',
    assetsInlineLimit: 0,
  },
});
