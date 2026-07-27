// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap';

// Static output. This is a document, not an application — nothing here needs
// a server at runtime.
/* Canonical origin, resolved at build time.
 *
 * Every canonical URL, Open Graph tag and sitemap entry derives from this, so
 * a wrong value is worse than an obviously-broken one: a real-but-incorrect
 * domain gets silently indexed, while an unresolvable one fails loudly.
 *
 * Resolution order:
 *   1. SITE_URL                        — set this once a real domain exists.
 *   2. VERCEL_PROJECT_PRODUCTION_URL   — injected by Vercel; the stable
 *      production hostname, not the per-deployment preview URL, so canonicals
 *      stay constant across deploys.
 *   3. `.invalid`                      — reserved by RFC 2606 and guaranteed
 *      never to resolve for anyone. Deliberately NOT a plausible-looking
 *      placeholder such as `my-portfolio.vercel.app`: those subdomains are
 *      claimable, so a guessed one can point at a stranger's live site.
 */
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://set-production-domain-here.invalid')

// Static output. This is a document, not an application — nothing here needs
// a server at runtime.
export default defineConfig({
  site,

  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [sitemap()],
})