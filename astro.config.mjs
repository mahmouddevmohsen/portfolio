// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap';

// Static output. This is a document, not an application — nothing here needs
// a server at runtime.
export default defineConfig({
  // ⚠️ PLACEHOLDER — replace before the first real deployment.
  // `.invalid` is a reserved TLD that can never resolve (RFC 2606), so if this
  // ever ships by accident the failure is loud and immediate rather than a
  // silently wrong canonical URL in OG tags and sitemaps.
  site: 'https://set-production-domain-here.invalid',

  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [sitemap()],
})