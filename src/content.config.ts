import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/* ============================================================================
   PROJECT RECORDS — preview + Authoring Record.

   Two halves, deliberately separated:

   PREVIEW   the homepage card. Required on every project, always.
   STUDY     the full case study, matching the locked Case Study Template.
             Optional while a project is still a skeleton — but the moment
             `studyPending` is set to false, the ENTIRE authoring record
             becomes mandatory and the build fails without it.

   This restores compile-time enforcement of the guarantees agreed in
   Case-Study-Template.md, which regressed when the schema was simplified for
   the preview cards:

     "No omissions"        -> every beat required, with minimum lengths.
     "This shows X"        -> evidence.shows required and non-trivial.
     "Tradeoff named"      -> spread.tradeoff required.
     "No invented metrics" -> claimLedger required; each claim names what it
                              rests on. A study cannot be published without it.

   Authoring-only fields (disclosure, assetsRequired, claimLedger,
   openQuestions) are NEVER rendered. They exist so the record and the page
   cannot drift apart.
   ========================================================================= */

/* ----------------------------------------------------------------------------
   PLACEHOLDER GUARD — field level.

   Four `outcome` rows carrying the literal string "TODO" reached a live
   project page. Every existing check passed them: they were non-empty strings
   of adequate length, which is all the schema asked for.

   So the vocabulary is now closed against markers as well as against empty
   values. Matched whole-string after trimming, never as a substring: a real
   value is allowed to contain these letters, it just may not consist of them.

   `authoring` is deliberately exempt — it is never rendered, and it is the one
   place where an open question is supposed to be written down rather than
   resolved. See the walk in `assertNoPlaceholders`.
   -------------------------------------------------------------------------- */
const PLACEHOLDER = /^(todo|tbd|fixme|n\/a|tba|coming soon|lorem ipsum|replace_me|-{1,2}|\?+)$/i

/** Walks every rendered string in a project record and reports each marker. */
const assertNoPlaceholders = (
  value: unknown,
  ctx: z.RefinementCtx,
  path: (string | number)[] = []
): void => {
  if (typeof value === 'string') {
    if (PLACEHOLDER.test(value.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path,
        message:
          `"${value}" is a placeholder, and this field is rendered. Supply a ` +
          `real value or remove the entry — a marker on a live page is worse ` +
          `than an absent section.`,
      })
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertNoPlaceholders(v, ctx, [...path, i]))
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      /* Never rendered, and the designated home for unresolved questions. */
      if (k === 'authoring') continue
      assertNoPlaceholders(v, ctx, [...path, k])
    }
  }
}

/** A narrative beat. Long enough that a one-word placeholder fails. */
const beat = z
  .string()
  .trim()
  .min(40, 'Beat is too thin to carry its position in the template.')

/** The full Authoring Record — the locked Case Study Template, as a schema. */
const study = z.object({
  /* Header — the scan layer */
  oneLine: z
    .string()
    .trim()
    .min(30, 'The one-line must stand alone with no surrounding context.')
    .max(180, 'The one-line is a sentence, not a paragraph.'),
  sector: z.string().trim().min(1),
  size: z.string().trim().min(1),
  /** Designed / built / advised. Ambiguity here reads as inflation. */
  role: z.string().trim().min(1),
  period: z.string().trim().min(1),
  /** Optional factual qualifier, e.g. "since March 2026". Never estimated. */
  statusDetail: z.string().trim().optional(),

  /* The four narrative beats */
  context: beat,
  problem: beat,
  constraints: beat,
  decision: beat,

  /* The spread — the signature object */
  spread: z.object({
    exists: beat,
    notBuilt: beat,
    /** Replaced the cut "Lessons / Takeaways" section: judgment stated as a
        cost, not a retrospective. */
    tradeoff: z
      .string()
      .trim()
      .min(30, 'Name the tradeoff accepted — this replaced "Lessons".'),
  }),

  /* Evidence specification — the strongest evidence wins */
  evidence: z.object({
    type: z.enum([
      'diagram',
      'annotated-screenshot',
      'workflow-map',
      'system-architecture',
      'before-after',
      'operational-output',
      'combination',
    ]),
    /** The mandatory test. If this sentence cannot be written, the artifact
        is not evidence — it is an image, and it is cut. */
    shows: z
      .string()
      .trim()
      .min(25, 'Write "this shows X" or cut the artifact.'),
    caption: z.string().trim().min(1),
    /** Ordered annotation callouts. Also the assembly sequence. */
    callouts: z.array(z.string().trim().min(1)).min(1),
    src: z.string().trim().optional(),
    alt: z.string().trim().optional(),
  }),

  /** Substrate only. Always present — absence creates uneven depth for the
      technical reader. This is where AI belongs, never the positioning. */
  technical: z.string().trim().min(20),

  /* --- Authoring record: never rendered ---------------------------- */
  authoring: z.object({
    /** Decided BEFORE an asset is made, not after. */
    disclosure: z.string().trim().min(1),
    assetsRequired: z
      .array(
        z.object({
          asset: z.string().trim().min(1),
          state: z.enum(['have', 'must-make', 'cannot-get']),
        })
      )
      .min(1),
    /** Every factual claim and what it rests on. The enforcement mechanism
        for the no-invented-metrics rule — nothing unverifiable ships. */
    claimLedger: z
      .array(
        z.object({
          claim: z.string().trim().min(1),
          restsOn: z.string().trim().min(1),
        })
      )
      .min(1, 'A published study must account for its claims.'),
    openQuestions: z.array(z.string().trim().min(1)).default([]),
  }),
})

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z
    .object({
      /* --- Preview: required on every project --------------------- */
      order: z.number().int().positive(),
      name: z.string().trim().min(1),
      /** Closed vocabulary. No invented states, no upgrading a pilot.
          The enum is the single definition of the vocabulary: renaming a
          state here fails the build on every project still carrying the old
          label, which is what stops the two drifting apart. */
      status: z.enum([
        'In Production',
        'Pilot',
        'Internal Product',
        'Active Development',
      ]),
      problem: z.string().trim().min(30),
      solution: z.string().trim().min(30),
      highlights: z.array(z.string().trim().min(1)).min(1).max(6),
      stack: z.array(z.string().trim().min(1)).min(1).max(6),

      /* --- Outcome: optional, and silent when absent ---------------
         Label/value pairs stating what the system does in operation. Optional
         because a project without measured numbers must be able to say
         nothing rather than say something invented — the same rule the claim
         ledger enforces for the study. A project omitting the field renders
         no Outcome section at all. */
      outcome: z
        .array(
          z.object({
            label: z.string().trim().min(1),
            value: z.string().trim().min(1),
          })
        )
        .optional(),

      /* --- Gallery: optional screenshots ---------------------------
         Paths are site-absolute and resolved from `public/`, e.g.
         `/screenshots/<slug>-1.jpg`. This is the owner-supplied raster path;
         the build-time `shots` glob in the project page reads authored
         captures from src/assets instead, and the two do not collide.

         `width` and `height` are the image's intrinsic pixel dimensions.
         They are optional only because a caller may not have them to hand —
         supplying them is what removes layout shift, so the renderer falls
         back to a reserved aspect box when they are absent. */
      gallery: z
        .array(
          z.object({
            src: z.string().trim().min(1),
            alt: z.string().trim().min(1),
            caption: z.string().trim().min(1),
            width: z.number().int().positive().optional(),
            height: z.number().int().positive().optional(),
          })
        )
        .optional(),

      /* --- Study: gated ------------------------------------------- */
      /** True while the project is a skeleton. Setting it false asserts the
          case study is publishable, and the schema then demands the receipts. */
      studyPending: z.boolean().default(true),
      study: study.optional(),
    })
    .superRefine((data, ctx) => {
      assertNoPlaceholders(data, ctx)

      if (!data.studyPending && !data.study) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['study'],
          message:
            'studyPending is false, so the full Authoring Record is required: ' +
            'beats, the decision spread with its tradeoff, an evidence spec ' +
            'with its "this shows X" line, disclosure, assets, and a claim ledger.',
        })
      }
    }),
})

export const collections = { projects }
