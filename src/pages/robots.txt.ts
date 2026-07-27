import type { APIRoute } from 'astro'

/* robots.txt as a route rather than a static file in public/, so the sitemap
   URL is derived from `site` in astro.config.mjs. A hardcoded copy would
   silently keep pointing at the old domain the moment `site` changes — the
   exact class of stale-URL bug the `.invalid` placeholder exists to prevent.

   Nothing is disallowed: every route in the build is public, and the only
   non-indexable page (404) already carries a `noindex` meta tag, which is the
   correct mechanism. Blocking it here instead would stop crawlers reading
   that tag at all. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
