// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap';

import { SITE } from './src/config/site.ts'

/* Canonical origin — the origin THIS build is served from.
 *
 * Resolved in src/config/site.ts from the build environment: a preview
 * deployment resolves to its own hostname, production and local builds to the
 * production domain. Everything derived from `Astro.site` therefore describes
 * the document the reader actually loaded, which is what a canonical is for.
 * Changing the domain remains a one-line edit in the config.
 */
const site = SITE.domain

// Static output. This is a document, not an application — nothing here needs
// a server at runtime.
export default defineConfig({
  site,

  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [
    /* The sitemap is a statement about the SITE, not about this build, so
     * every entry is rewritten to the production origin even when the build
     * is a preview. A preview sitemap advertising preview URLs would invite a
     * crawler to index a throwaway deployment; one that names the production
     * URLs is merely redundant, which is the safe failure.
     *
     * The integration has no origin option — it derives entries from `site`
     * above — so the origin is swapped per entry here. A no-op on production,
     * where the two values are already identical.
     */
    sitemap({
      serialize: (item) => ({
        ...item,
        url: new URL(
          new URL(item.url).pathname,
          SITE.productionDomain
        ).href,
      }),
    }),
  ],
})