/* ============================================================================
   SITE CONFIG — the single source of truth for every personal value.

   Everything here is a fact about the person or the deployment, not copy.
   Prose stays in the page that says it; identifiers, addresses and feature
   switches live here so that changing one is a one-line edit rather than a
   grep across the build.

   The rule this file enforces: no email address, origin, or profile URL is
   written down anywhere else in the repository. `astro.config.mjs` reads the
   resolved origin, the layout derives canonical and Open Graph URLs from it,
   robots.txt and the JSON-LD record derive from the production origin, and
   the footer reads the address and the switches below.

   The empty strings are not placeholders waiting to be filled with a guess —
   each one is read as "this channel does not exist yet", and the control it
   would render is omitted from the markup entirely. A hidden-but-declared
   button invites someone later to point it at a URL that was never verified.
   ========================================================================= */

/* The authoritative origin. One place to change the domain, per Rule 0.
   No trailing slash. */
const PRODUCTION_DOMAIN = 'https://mahmouddev.duckdns.org'

/* Build-time environment.

   Read through `process.env`, NOT `import.meta.env`. Astro sets Vite's
   `envPrefix` to `PUBLIC_`, so only PUBLIC_-prefixed variables are exposed on
   `import.meta.env` — `import.meta.env.VERCEL_ENV` and `.VERCEL_URL` are
   always `undefined`, which would make the resolution below collapse to
   PRODUCTION_DOMAIN in every environment while appearing to work. That is the
   silent failure this function exists to prevent, so it must not depend on it.

   Guarded on `typeof process` so that importing this module from a client
   bundle can never throw at runtime. Nothing does so today — every consumer
   is build-time — and this keeps that from becoming a landmine if one does. */
const env: Record<string, string | undefined> =
  typeof process !== 'undefined' && process.env ? process.env : {}

/* Preview deployments must not claim to be the canonical copy of the site.
   A preview emitting production canonicals tells a crawler that a throwaway
   build is authoritative; a preview emitting its own origin is merely
   uninteresting, which is the correct outcome.

   Falls back to production when nothing identifies the environment — local
   builds and `astro preview` then behave exactly as the live site does. */
const resolveDomain = (): string => {
  if (env.VERCEL_ENV === 'production') return PRODUCTION_DOMAIN
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return PRODUCTION_DOMAIN
}

export const SITE = {
  /* The origin THIS build is served from. Canonical, og:url and og:image use
     it, because those must describe the document the reader actually loaded. */
  domain: resolveDomain(),

  /* The origin the site claims as authoritative, regardless of where this
     build runs. The sitemap, robots.txt and the JSON-LD identity record use
     it: all three are statements about the site itself, not about a build. */
  productionDomain: PRODUCTION_DOMAIN,

  /* Identity, used by the JSON-LD Person record and wherever the name is an
     identifier rather than part of a sentence. */
  name: 'Mahmoud Mohsen',
  /* Must match what the headline claims. This is the canonical machine-
     readable statement of the work, and an engineering job title against a
     headline selling business outcomes would contradict the positioning at
     the one place a search engine reads it literally. */
  jobTitle: 'Business Systems Designer',

  /* The one contact channel. Rendered as both the visible label and the
     mailto target, so the address a reader copies is the address that
     receives. */
  email: 'mahmoudmohsen.work@gmail.com',

  githubUrl: 'https://github.com/mahmouddevmohsen',
  /* Hides the GitHub link everywhere while false — the footer link and the
     structured-data `sameAs` entry both.

     Re-enabled once the profile stopped contradicting the site. Two of the
     four projects here now have real public repositories behind them
     (Commerce Hub, JARVIS OS), alongside this site's own source. The other
     two are client systems whose case studies state outright that their data
     is anonymised, so their absence is consistent with what those pages
     already claim rather than a hole in them. */
  showGithub: true,

  /* Each empty string hides its control. Fill one in and the button appears;
     nothing else needs to change. */
  calendlyUrl: '',
  cvUrl: '',
  whatsappUrl: '',
} as const
