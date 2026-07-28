import type { APIRoute } from 'astro'
import { SITE } from '../config/site'

/* robots.txt as a route rather than a static file in public/, so the sitemap
   URL is derived from the config. A hardcoded copy would silently keep
   pointing at the old domain the moment the domain changes — the exact class
   of stale-URL bug this indirection exists to prevent.

   Built from the PRODUCTION origin rather than the resolved one: like the
   sitemap it points at, this file is a statement about the site, not about
   the build serving it. A preview's robots.txt naming its own sitemap would
   invite a crawler to index the preview.

   Nothing is disallowed: every route in the build is public, and the only
   non-indexable page (404) already carries a `noindex` meta tag, which is the
   correct mechanism. Blocking it here instead would stop crawlers reading
   that tag at all. */
export const GET: APIRoute = () => {
  const sitemap = new URL('sitemap-index.xml', SITE.productionDomain).href

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
