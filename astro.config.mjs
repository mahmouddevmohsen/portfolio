// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SITE } from './src/config/site.ts'

/* ---------------------------------------------------------------------------
 * PLACEHOLDER GUARD — fails the build if a placeholder reaches dist/.
 *
 * This site published four `outcome` rows whose value was the literal string
 * "TODO", and they sat on a live project page. Nothing caught it: the schema
 * was satisfied (a non-empty string), the build was green, and the page
 * rendered exactly what it was told to.
 *
 * The content schema now rejects these strings at the field level too (see
 * src/content.config.ts). That check is faster and its error names the field,
 * so it is the one that normally fires. This one exists because it cannot be
 * bypassed by a route that builds its text somewhere other than a collection:
 * it reads the actual emitted HTML, which is the only artifact that is
 * definitionally what the reader receives.
 *
 * Word-bounded, so real prose containing these letters is untouched — the
 * target is a bare marker standing where a value belongs.
 */
const PLACEHOLDERS = [
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bTBD\b/,
  /\bLorem ipsum\b/i,
  /\bComing soon\b/i,
  /\bexample\.com\b/,
  /\bREPLACE_ME\b/,
]

/**
 * Every .html file under `dir`, recursively.
 * @param {string} dir
 * @returns {string[]}
 */
const htmlFilesIn = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry)
    return statSync(p).isDirectory()
      ? htmlFilesIn(p)
      : p.endsWith('.html')
        ? [p]
        : []
  })

/** @returns {import('astro').AstroIntegration} */
const placeholderGuard = () => ({
  name: 'placeholder-guard',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const root = fileURLToPath(dir)
      const hits = []

      for (const file of htmlFilesIn(root)) {
        const html = readFileSync(file, 'utf8')
        for (const pattern of PLACEHOLDERS) {
          const match = html.match(pattern)
          if (match) {
            hits.push(`${file.slice(root.length)} contains ${match[0]}`)
          }
        }
      }

      if (hits.length > 0) {
        /* Thrown, not logged. A warning here would be read past on a green
           build, which is precisely how the last one shipped. */
        throw new Error(
          `Placeholder text reached the build output:\n  ${hits.join('\n  ')}\n` +
            `Remove the element or supply a real value — never ship the marker.`
        )
      }

      logger.info(
        `no placeholders in ${htmlFilesIn(root).length} page(s)`
      )
    },
  },
})

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

    placeholderGuard(),
  ],
})