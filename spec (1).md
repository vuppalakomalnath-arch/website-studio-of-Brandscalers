# Website Studio 2.0 --- Single Source of Truth (`spec.md`)

**Status:** One-day, presentation-ready vertical-slice specification\
**Owner:** Project developer\
**Target environment:** Antigravity IDE with two independent
chats/agents\
**Integration target:** Existing BrandScalers AI marketing platform /
Website Studio\
**Hard constraint:** Initial AI website generation must never exceed 250
business credits\
**Primary objective:** Demonstrate a distinctly designed, responsive,
editable, functional multi-page business website generated from a
business brief, using the existing BrandScalers design library where
feasible.

> **Scope honesty:** A single day is sufficient for a disciplined,
> presentation-ready vertical slice if existing code/library pieces can
> be reused. It is not a realistic commitment for a fully
> production-hardened replacement for every Website Studio capability.
> The one-day deliverable must demonstrate the core generation pipeline
> and prove that it can be integrated later. Do not fake completed
> capabilities.

------------------------------------------------------------------------

## 0. Non-negotiable instructions for every agent

1.  Read this `spec.md` completely before changing files.
2.  Treat this document as the single source of truth. If code, an agent
    assumption, or a prompt conflicts with this spec, stop and report
    the conflict.
3.  Do not modify the existing production Website Studio or production
    database. Work in a new project/repository and use isolated
    local/test Supabase resources only.
4.  Do not copy secrets, production customer data, API keys,
    credentials, or `.env` files into the new project.
5.  Do not invent business facts, reviews, certifications, addresses,
    prices, or customer claims. Mark demo data as demo data.
6.  Do not generate a whole website as arbitrary AI-written React code.
    The AI produces validated structured website data; trusted renderer
    code produces the page.
7.  Reuse the supplied design library only after inspecting and testing
    the relevant component/rendering contracts. Do not blindly paste the
    1.5 MB playground HTML into the application.
8.  Do not claim a test passed unless it was actually run and its result
    was observed.
9.  Do not remove tests, weaken assertions, hide console errors, or
    change requirements to make the build appear green.
10. The builder agent owns implementation. The independent QA agent
    reviews requirements, runs tests, captures evidence, and reports
    defects; it must not silently rewrite implementation.
11. Any scope reduction must be recorded in `DECISIONS.md` and approved
    by the user. Preserve a working build at every checkpoint.
12. Prefer a small complete vertical slice over many unfinished
    features.
13. Never spend or charge credits for failed builds. Credit charging
    must be transactional and idempotent in any integrated
    implementation.
14. Before finishing, report what is implemented, what was tested, what
    failed, what remains mocked, and what is not production-ready.

------------------------------------------------------------------------

## 1. Product problem and outcome

### Current situation

The existing Website Studio uses Next.js/React on Vercel, Supabase
Postgres, Supabase Storage, OpenAI `gpt-5.4-mini`, Pexels/Pixabay
assets, and a JSON-first generation flow. The generated JSON is rendered
through four fixed React layouts. A separate design library has been
created with plain HTML renderers, 98 pieces and 292 looks as described
by the project owner, but it is not connected to Website Studio.

The reported user problem is that generated sites look generic and
static. The likely structural limitation is that the model supplies
text/content while a small fixed layout set controls the visual
composition.

### Product outcome

Build a separate, demoable engine that: - Collects a concise but useful
business brief. - Creates a business-specific website plan and
sitemap. - Chooses a design family and validated design tokens. -
Generates structured page and section data. - Renders pages using a
reusable component system. - Uses appropriate supplied/demo/stock
assets, with source metadata. - Supports real navigation and working
core interactions. - Provides desktop/mobile preview and section-level
editing. - Runs deterministic checks and a browser smoke test. -
Enforces a maximum initial generation charge of 250 business credits. -
Keeps the core engine independent from the existing Studio UI, so it can
be integrated behind an adapter later.

### Success statement

A reviewer can enter a realistic business brief, generate a multi-page
site with a coherent visual direction, navigate between pages, use the
main CTA/contact form, edit a section, preview mobile layout, run QA,
and see a clear result---all without relying on arbitrary AI-generated
code.

------------------------------------------------------------------------

## 2. One-day delivery definition

### Required presentation deliverable

By the end of the day, the new project must demonstrate this happy path:

1.  Enter business name, business type, location/service area, audience,
    website goal, services, differentiators, contact details, preferred
    style, and optional reference/brand notes.
2.  Review a generated sitemap/design plan.
3.  Generate a website with at least Home, About, Services, and Contact
    pages, with page structure adjusted to the business.
4.  Render at least three visibly different design directions from the
    shared component system (e.g. editorial/premium,
    local-service/trust-focused, modern/creative).
5.  Navigate between pages.
6.  Use at least one working CTA and a validated contact form in demo
    mode.
7.  Edit text and change a section's supported design properties without
    regenerating the whole site.
8.  Switch desktop/mobile preview and show a responsive layout.
9.  Run a QA report with actual deterministic checks.
10. Show estimated/actual generation cost and demonstrate the 250-credit
    guard.
11. Display a clear "demo/local mode" status for any integrations that
    are mocked.

### Explicitly out of scope for the one-day prototype

Do not attempt to deliver all of these in one day: - Full replacement of
production Website Studio. - Arbitrary website/application code
generation. - Native ecommerce checkout or payment processing. - Native
booking engine. - Membership/authentication for published websites. -
Full CMS/blog publishing. - Production custom-domain
purchase/management. - Complete GA4, GTM, Search Console, and sitemap
deployment integration. - Production multi-tenant security
certification. - Full import/migration of every one of the 98 pieces/292
looks. - Perfect visual parity with Lovable or Wix. - A guarantee that
every generated site is publish-ready without human review.

These are future roadmap capabilities. Do not fake them in the demo.

------------------------------------------------------------------------

## 3. Architecture and boundaries

### Architecture principle

**AI plans and selects; deterministic code validates and renders.**

The model must never be trusted as the authority for executable code,
arbitrary URLs, CSS, or unsupported component names.

### Logical flow

`Business brief → normalized business profile → site plan → design specification → page/section JSON → schema validation → trusted renderer → browser preview → deterministic QA → targeted repair → user approval → export/integration adapter`

### Required modules

1.  **Intake module** --- form state and business profile validation.
2.  **Planner** --- creates sitemap, page goals, section order, CTA
    plan, and missing-information warnings.
3.  **Design selector** --- selects a design family, tokens, and
    component variants from an allowlist.
4.  **Content generator** --- creates factual, business-specific content
    in structured fields.
5.  **Schema validator** --- rejects unknown component types, invalid
    properties, unsupported actions, excessive content, and unsafe
    values.
6.  **Renderer** --- maps approved component types to trusted React
    components.
7.  **Asset resolver** --- maps asset IDs to local/demo assets or
    approved provider results and stores attribution metadata.
8.  **Editor** --- edits the structured document, not raw generated
    code.
9.  **QA runner** --- validates data, links, required pages, form
    schema, responsive viewport, and browser console/errors.
10. **Usage ledger** --- estimates/records usage and enforces the
    250-credit cap.
11. **Export adapter** --- serializes the project in a stable, versioned
    format for later integration with the existing platform.

### Suggested stack for this isolated prototype

Use the stack that can be bootstrapped and tested fastest in the
available environment. Preferred default: - Next.js + TypeScript +
React. - Tailwind CSS or the existing library CSS, but do not create
competing styling systems unnecessarily. - Zod for runtime schema
validation. - OpenAI server-side SDK through a provider adapter. -
Playwright for browser smoke tests if install/runtime time allows. -
Local in-memory demo state or local fixture data first. Supabase is
optional for the one-day prototype; use a separate test project only if
credentials and schema are already available. - No secrets in
client-side code. - No direct database writes from the browser.

Do not introduce a queue, vector database, microservices, complex agent
framework, or a second backend unless an actual requirement demands it.

### Repository structure

Use this as the target, adapting only when the existing framework
requires a different convention:

``` text
website-studio-engine/
  spec.md
  README.md
  DECISIONS.md
  .env.example
  package.json
  src/
    app/
      page.tsx
      api/
        generate/route.ts
        qa/route.ts
    components/
      intake/
      editor/
      preview/
      ui/
    engine/
      schemas/
        business-profile.ts
        site-plan.ts
        website-document.ts
      planner/
      design/
        tokens.ts
        presets.ts
        manifest.ts
      generation/
        provider.ts
        openai-provider.ts
        prompts.ts
        budget.ts
      renderer/
        WebsiteRenderer.tsx
        registry.ts
        components/
      assets/
        resolver.ts
      qa/
        checks.ts
      export/
        export-project.ts
    fixtures/
      demo-business.json
      demo-website.json
  tests/
    schema.test.ts
    budget.test.ts
    renderer.test.ts
    generation.test.ts
    e2e/
      happy-path.spec.ts
```

The agent may adjust paths to the current framework, but must preserve
the logical module boundaries.

------------------------------------------------------------------------

## 4. Design library analysis and integration strategy

### What has been supplied

The owner supplied: - `BrandScalers-Design-Library-292-looks.html` -
`Sample-page-Busy-clinic.html` - `Sample-page-Editorial-shop.html` -
`Sample-page-Premium-minimal.html`

The main playground demonstrates: - Design tokens via CSS custom
properties. - Root-level data attributes controlling buttons, cards,
images, density, alignment, motion, heading case, and light/dark mode. -
Named presets including Warm clinic, Quiet luxury, Editorial mono, Fresh
green, Corporate navy, Warm restaurant, Playful, and Dark premium. -
Font pair configurations including Inter, Playfair Display + Inter,
Cormorant Garamond + Jost, Poppins, DM Serif Display + DM Sans, Space
Grotesk + Inter, Fraunces + Work Sans, Montserrat + Open Sans, and
Figtree. - Reusable visual patterns for headers, heroes, services,
pricing, testimonials, teams, galleries, FAQs, forms, product/catalogue
displays, menus, courses, property listings, and more. - Browser
behavior for components such as tabs, carousels, overlays, and
counters. - CSS helpers for grids, cards, buttons, surfaces, image
shapes, spacing, and responsive behavior.

The supplied sample files use the `.bs` styling system and design
variables. The inspected sample markup contains no ordinary `<img>`
elements; image placeholders and styles must not be mistaken for proof
of the production asset pipeline. The sample pages also reference Google
Fonts, while the owner reports that the production block library
self-hosts fonts. Verify and follow the production policy rather than
copying demo dependencies.

### Integration decision

**Reuse the library's design vocabulary and approved component concepts;
do not embed the whole playground as a single page or blindly copy its
HTML.**

For the one-day prototype: 1. Build a small machine-readable manifest of
8--12 supported components. 2. Map each component to a trusted React
renderer. 3. Map design presets to a typed token object. 4. Reuse
compatible CSS variables/classes after verifying they do not leak into
the builder UI. 5. Use local assets or explicit placeholders for the
demo. 6. Keep component behaviors isolated and accessible. 7. Record the
source piece/preset name in metadata where available. 8. Defer the
remaining library pieces until they can be individually validated.

### Minimum component manifest

Support at least: - `site-header` - `hero-split` - `hero-centered` -
`service-grid` - `feature-row` - `testimonial-list` (only with
supplied/demo-labeled data) - `faq-accordion` - `gallery-grid` -
`call-to-action` - `contact-form` - `location-hours` - `site-footer`

Optional if time permits: - `pricing-grid` - `team-grid` -
`product-grid` - `tabs` - `carousel`

Each manifest entry must define: - `type` and `version` - category and
description - supported props schema - allowed action types - responsive
behavior - accessibility requirements - whether it requires assets or
external integration - test cases - provenance/source component, when
applicable

Never permit model output to provide raw HTML, JavaScript, arbitrary
CSS, event handlers, or unvalidated URLs.

------------------------------------------------------------------------

## 5. User intake specification

Use progressive disclosure. The initial form should be short enough to
complete quickly, while supporting business-specific follow-up
questions.

### Required fields

-   `businessName`
-   `businessType`
-   `primaryGoal`
-   `targetAudience` (allow "not sure")
-   `servicesOrProducts` (at least one item or "help me define them")
-   `locationOrServiceArea` where relevant
-   `preferredDesignDirection` or "choose for me"
-   `requiredPages` or "recommend for me"
-   `contactMethod` appropriate to the primary goal

### Optional fields

-   Existing website URL.
-   Inspiration reference URL or uploaded screenshot.
-   Logo, brand kit, photos, and product/service images.
-   Brand colors and preferred fonts.
-   Differentiators and approved proof points.
-   Competitor/reference notes.
-   Business hours, address, service areas, phone, email, social links.
-   Approved testimonials/reviews and attribution.
-   Legal/privacy/cookie requirements relevant to the business.
-   Additional instructions.

### Conditional questions

-   Restaurant: cuisine, menu, hours, location, external
    booking/delivery links.
-   Clinic: treatments, credentials, contact route, location; do not
    create unsupported health claims.
-   Agency: services, industries, approved portfolio/case studies.
-   Portfolio: projects, role, media, preferred presentation.
-   Retail catalogue: categories, product details, prices if supplied,
    desired enquiry/purchase flow.
-   Education: courses, audience/age groups, delivery format, curriculum
    and contact.
-   Local services: service areas, operating hours, availability,
    service details.

### Intake rules

-   Do not ask users to repeat information already extracted from their
    supplied content; show it for confirmation.
-   Do not invent facts to fill blanks.
-   Do not make every optional question mandatory.
-   If a requested capability is unsupported, state the limitation and
    propose an external integration or a non-functional preview only if
    clearly labeled.
-   Save the normalized business profile separately from the generated
    website document.

------------------------------------------------------------------------

## 6. Data contracts

Use Zod or equivalent schemas. Keep types versioned and stable.

### Business profile (conceptual)

``` ts
type BusinessProfile = {
  schemaVersion: "1.0";
  businessName: string;
  businessType: string;
  location?: string;
  serviceArea?: string[];
  audience?: string;
  primaryGoal:
    | "enquiries"
    | "calls"
    | "whatsapp"
    | "bookings_external"
    | "portfolio"
    | "brand"
    | "catalogue";
  servicesOrProducts: Array<{
    id: string;
    name: string;
    description?: string;
    source: "user" | "verified_existing_site" | "ai_draft";
  }>;
  differentiators?: string[];
  brand?: {
    colors?: string[];
    fontPreference?: string;
    tone?: string;
    logoAssetId?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    address?: string;
    website?: string;
  };
  reference?: {
    url?: string;
    analysisSummary?: string;
    permissionConfirmed?: boolean;
  };
  assets: Array<{
    id: string;
    kind: "logo" | "photo" | "document";
    source: "user" | "stock" | "demo";
    attribution?: string;
  }>;
};
```

### Website document (conceptual)

``` ts
type WebsiteDocument = {
  schemaVersion: "1.0";
  projectId: string;
  businessProfileId: string;
  design: {
    family: "editorial" | "local-service" | "modern" | "creative";
    preset: string;
    tokens: Record<string, string | number>;
  };
  pages: Array<{
    id: string;
    slug: string;
    title: string;
    purpose: string;
    seo: {
      title: string;
      description: string;
    };
    sections: Array<{
      id: string;
      type: string;
      version: number;
      visible: boolean;
      props: Record<string, unknown>;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
  generation: {
    model: string;
    promptVersion: string;
    estimatedCredits: number;
    actualCredits?: number;
  };
};
```

This is a conceptual contract. The implementation must create strict
per-component prop schemas; `Record<string, unknown>` is not a
substitute for validating every section.

### Required validation

-   Reject unknown `type` values.
-   Reject unknown/unsafe props.
-   Limit strings, arrays, number of pages, number of sections, and
    total payload size.
-   Sanitize text and encode it through normal React rendering.
-   Permit only known action types such as `internal-link`, `tel`,
    `mailto`, `whatsapp`, `external-link`, and `contact-form`.
-   Validate external URLs and restrict unsafe protocols.
-   Do not allow untrusted content to inject HTML or scripts.
-   Ensure each page and section has a stable unique ID.
-   Validate slugs and prevent collisions.
-   Validate that internal links target existing pages.

------------------------------------------------------------------------

## 7. Generation pipeline

### Step 1 --- Normalize intake

Validate the business profile and identify missing critical information.
Ask follow-up questions only when the answer materially affects the
website.

### Step 2 --- Plan

Generate a compact `SitePlan` with: - business summary - audience and
primary goal - proposed sitemap - page purpose - ordered sections for
each page - primary/secondary CTA - design family and rationale - assets
required - missing facts or assumptions - unsupported capabilities

Do not generate all page content before the plan is valid.

### Step 3 --- Design selection

Select an allowlisted design family and preset. Generate only permitted
token overrides. Use design variation intentionally: section order, hero
composition, image/text proportions, alignment, density, and background
rhythm should vary based on the business and brief---not just the accent
color.

### Step 4 --- Content generation

Generate structured content for each planned section. Use specific
business information. Avoid generic repeated phrases, duplicated
headings, fake reviews, fake statistics, invented prices, fake
certifications, and fabricated team members.

### Step 5 --- Build the document

Merge the plan, design, content, and asset IDs into a `WebsiteDocument`.
Validate it before rendering.

### Step 6 --- Render

Render only registered components. Use design tokens and responsive
rules. All CTAs must resolve to an allowed action or be visibly marked
as unavailable.

### Step 7 --- QA

Run deterministic schema and content checks, then browser smoke tests.
Collect screenshots and console/network failures if available.

### Step 8 --- Targeted repair

If a test fails, repair only the failing page/section/property. Do not
rerun the entire generation pipeline by default. Repair calls must use
the same usage ledger and budget ceiling.

### Step 9 --- Review and export

Show the user the result, plan, and QA report. Export the structured
document with a schema version. Do not publish to production domains
from the prototype.

------------------------------------------------------------------------

## 8. Model selection and usage policy

### Initial model strategy

-   Use one capable model for planning and complex design decisions.
-   Use a cost-efficient model for structured content if it performs
    adequately in benchmark tests.
-   Use vision input only when a reference screenshot or visual
    comparison materially improves the result.
-   Do not add a dedicated code-generation model to the
    website-generation path. The prototype uses a trusted renderer.
-   Use image generation only if required; prefer supplied assets and
    approved stock assets.

The existing product uses OpenAI `gpt-5.4-mini`. Treat it as a benchmark
candidate, not an unquestioned default. Compare it against at least one
alternative model that is available under the company's account.
Evaluate on the same briefs and schemas.

### Provider adapter

All model calls must go through an internal interface such as:

``` ts
interface ModelProvider {
  generateStructured<T>(input: {
    task: string;
    input: unknown;
    schemaName: string;
    maxOutputTokens: number;
  }): Promise<{
    data: T;
    usage?: { inputTokens?: number; outputTokens?: number };
    model: string;
  }>;
}
```

Implement the provider with server-side credentials. Do not expose keys
to the browser.

### Credit policy

The owner's existing policy states: - Initial successful AI website
build costs 250 credits from that business's own balance. - AI edits
cost 5 credits per change made. - Manual text edits, reordering,
show/hide, and image swaps are free. - Failed AI edits are free. - A
build is charged only if it succeeds. - Each new business currently
receives 1,000 starting credits. - Starter/Growth/Pro plan site limits
are 1/2/5. - Monthly plan credits are deferred; refills are manual. -
`The Eventful Cakes` has a special unlimited-AI exception. -
`brandscalers@gmail.com` has a special 10-site allowance.

The standalone prototype must not copy or reimplement production
exceptions or balances unless explicitly asked. Use a test-only budget
of 250 credits per initial generation.

Required budget controls: 1. Create a usage ledger per generation
attempt. 2. Estimate cost before each model call. 3. Reserve a safety
margin for QA/repair. 4. Stop new calls when the remaining budget is
insufficient. 5. Cap retries and output tokens. 6. Record model, task,
usage, estimated credits, actual credits, and outcome. 7. Do not
double-charge on retry, browser refresh, or repeated request. 8. Charge
only after the full generation is validated as successful in the
integrated product. 9. If actual provider billing differs from internal
credits, store both values separately. 10. Demonstrate that a request
that would exceed 250 credits is blocked before the call.

The 250 credits are the product's internal allowance; do not assume they
equal 250 tokens or a fixed dollar amount. Calibrate the internal cost
formula from real usage.

------------------------------------------------------------------------

## 9. Design quality and visual diversity

### Requirements

-   At least three distinct design families in the demo.
-   At least two different hero compositions.
-   Multiple section backgrounds and spacing rhythms.
-   Distinct typography pairings.
-   Controlled variations in image shape, card style, button style,
    density, and alignment.
-   Business-specific component selection.
-   Responsive behavior at mobile/tablet/desktop widths.
-   Consistent design tokens within one website.
-   No random style changes that break cohesion.
-   No repeated generic sections just to increase page length.

### Design acceptance criteria

For two meaningfully different business briefs, reviewers should see
differences in: - information architecture - section selection and
ordering - typography and composition - CTA placement and purpose -
imagery - density and spacing - business-specific functionality

Changing only the color or business name does not count as design
diversity.

------------------------------------------------------------------------

## 10. Editing requirements

For the one-day prototype: - Edit text in place. - Change a section's
supported alignment/background/style properties. - Hide/show a
section. - Reorder sections if safe to implement. - Replace an image
with a known asset or placeholder. - Undo the last change or reset to
the previous saved document if time allows. - Preserve unrelated
sections when editing one section. - Revalidate the document after each
change.

AI section rewrite is optional for the demo if time is short. If
implemented, return only the validated property changes for the targeted
section; do not replace the whole website.

All edits should operate on stable section IDs and update the structured
document.

------------------------------------------------------------------------

## 11. QA and monitoring agent specification

The QA agent is independent from the builder. Its job is to detect
whether the implementation matches this spec, not to make the
implementation look successful.

### Required QA checks

**Static/schema** - TypeScript/build succeeds. - Every generated
document passes schema validation. - Unknown components are rejected. -
Invalid links and unsupported actions are rejected. - Duplicate
page/section IDs and duplicate slugs are rejected. - Missing required
page/CTA/contact configuration is reported.

**Rendering** - Each supported component renders with minimal and full
props. - No runtime exceptions. - No broken image references in the
demo. - No horizontal overflow at 360px, 390px, 768px, and 1440px
widths. - One H1 per page unless an explicit documented exception
exists. - Buttons and links have accessible names. - Forms have labels
and error/success states.

**Functional** - Header navigation works. - Internal links reach the
correct page. - Primary CTA has the expected action. - Contact form
validates required fields. - Demo form submission gives truthful success
feedback and is labeled as demo mode if not persisted. - Editing a
section updates the preview. - Switching viewport changes the preview
layout. - Budget cap blocks an over-budget generation. - Failed
generation does not charge credits.

**Visual** - Capture screenshots for each design family at desktop and
mobile. - Compare the outputs against the accepted design intent. - Flag
identical section sequences across unrelated briefs. - Flag excessive
repeated card grids, generic filler, awkward text wrapping, poor
contrast, empty image slots, and uneven spacing. - Visual judgments must
be accompanied by screenshots and specific observations, not just a
score.

**Security** - No secrets in client bundles. - No arbitrary
HTML/JavaScript from model output. - No unsafe URL protocols. - No
cross-tenant access in any backend implementation. - No production data
or production keys used in the prototype.

### QA severity

-   **P0 / Blocker:** security exposure, data loss, production mutation,
    uncontrolled credit spend.
-   **P1 / Critical:** app cannot run, generation fails, renderer
    crashes, primary CTA/form/navigation broken.
-   **P2 / Major:** responsive defects, major visual mismatch, incorrect
    business content, edit corrupts unrelated sections.
-   **P3 / Minor:** cosmetic issue with a safe workaround.

The QA agent must report: - requirement ID - test performed - exact
command or steps - observed result - expected result - severity -
screenshot/log/evidence - reproducibility - pass/fail/block status

------------------------------------------------------------------------

## 12. Two-chat Antigravity workflow

The owner wants two separate Antigravity chats. Create them manually in
the IDE if the environment does not support programmatic chat creation.
Keep the same `spec.md` available to both chats.

### Chat A --- BUILDER / IMPLEMENTATION AGENT

Paste this as its first message:

> You are the implementation agent for Website Studio 2.0. Read
> `spec.md` fully and obey it as the single source of truth. Inspect the
> repository and the supplied design-library files before coding. Do not
> modify the existing production Website Studio. Build the smallest
> complete, presentation-ready vertical slice in the new project. Reuse
> validated design tokens and component concepts from the BrandScalers
> library; do not embed the playground wholesale or recreate all 98
> pieces/292 looks. Implement the structured website schema, business
> intake, planning/generation flow, design family selection, trusted
> renderer, at least three distinct design families, working
> navigation/contact demo, section editing, responsive preview, QA
> report, and hard 250-credit guard. Use server-side model calls through
> an adapter. Never render raw model-generated HTML/JS. Add tests for
> schemas, budget rules, renderer, and happy path. Work in small
> checkpoints and keep the project runnable after each checkpoint.
> Before each major change, state the intended files and acceptance
> criteria. Do not claim success without running the relevant checks.
> Maintain `DECISIONS.md` for assumptions and scope reductions. At the
> end, provide changed files, commands run, actual test results, known
> gaps, and how to demo the application.

### Chat B --- QA / TESTING / MONITOR AGENT

Paste this as its first message:

> You are the independent QA, testing, and monitoring agent for Website
> Studio 2.0. Read `spec.md` fully. Do not implement product features or
> silently edit the builder agent's files. First create a requirement
> checklist and test plan from the spec. Inspect the repository
> independently and identify risks, missing requirements, unsafe
> assumptions, and likely failure points. As the builder progresses,
> review its reported checkpoints and run read-only inspections and
> tests where possible. Test schema validation, design diversity, page
> navigation, contact-form behavior, responsive layouts, section
> editing, credit caps, error handling, and security boundaries. Inspect
> screenshots at mobile and desktop sizes. Record every issue with
> severity, exact reproduction steps, expected vs observed behavior, and
> evidence. Never mark a test passed unless it ran. Do not weaken tests
> to make the build pass. If a test fails, report the smallest
> reproducible defect and a suggested fix to the builder agent. Maintain
> `QA-REPORT.md` and a final go/no-go verdict. Distinguish tested,
> untested, mocked, and production-ready features. The presentation must
> not claim functionality that is only mocked.

### How the two chats should communicate

Antigravity may not share live context between chats. Do not assume one
chat can see the other's messages. Use files as the coordination layer:

-   `spec.md` --- requirements.
-   `DECISIONS.md` --- accepted assumptions and scope changes.
-   `QA-REPORT.md` --- independent defects and test evidence.
-   `README.md` --- setup and demo instructions.
-   `TEST-RESULTS.md` --- final command output and status.

The builder should pause at checkpoints and ask the QA agent to review
the current state. The QA agent should write findings to `QA-REPORT.md`
and message the builder with the exact issue IDs. The builder fixes the
defects, then QA reruns the failed tests.

Do not let both agents modify the same source files concurrently. The QA
agent should normally operate read-only except for its own test/report
files.

------------------------------------------------------------------------

## 13. One-day schedule and checkpoint gates

The timeline is intentionally aggressive. Cut optional features rather
than skipping quality gates.

### First 30 minutes --- Environment and source audit

-   Confirm Node/package manager and available model credentials.
-   Inspect supplied library and sample files.
-   Confirm clean repository and project creation.
-   Write setup instructions and `.env.example`.
-   QA agent creates initial checklist.

**Gate:** application can be bootstrapped; no production files or
secrets are touched.

### Next 60--90 minutes --- Schema and design foundation

-   Implement business profile, site plan, website document, component
    manifest, design tokens, and budget guard.
-   Implement at least three design presets/families.
-   Add fixture data and schema tests.

**Gate:** a fixed fixture passes validation and renders without AI.

### Next 90 minutes --- Renderer and demo website

-   Implement header, two hero styles, service grid, feature row, FAQ,
    CTA, contact form, footer.
-   Add multi-page navigation.
-   Add responsive styles and safe action handling.
-   Build one polished demo business.

**Gate:** a complete fixture-based website works without any AI call.

### Next 90 minutes --- AI pipeline

-   Implement the provider adapter.
-   Generate a site plan and structured page data.
-   Validate model output.
-   Add bounded retries and budget checks.
-   Keep a deterministic fixture fallback for the presentation if the
    API is unavailable.

**Gate:** AI-generated structured data can be rendered, or the fallback
is clearly disclosed.

### Next 60 minutes --- Editing and QA

-   Add section-level editing.
-   Add mobile preview.
-   Run schema, budget, rendering, and browser smoke tests.
-   Capture screenshots and fix critical issues.

**Gate:** all P0/P1 defects fixed or clearly block the release.

### Final 30--45 minutes --- Presentation rehearsal

-   Run the project from a clean start.
-   Verify `.env.example` and README.
-   Test the happy path twice.
-   Record screenshots and actual QA results.
-   Prepare a short demo script and known-limitations slide.

**Gate:** the demo is repeatable and honest about what is mocked.

If time runs short, preserve this order: 1. Working fixture-based
renderer. 2. Three distinct design directions. 3. Structured generation
with schema validation. 4. Budget enforcement. 5. Navigation and contact
demo. 6. Responsive preview and section editing. 7. Automated QA. 8.
Optional advanced components.

Do not sacrifice the first seven priorities for animations, ecommerce,
database persistence, or a large component count.

------------------------------------------------------------------------

## 14. Acceptance criteria

### AC-01 --- Brief intake

A valid business brief can be entered and normalized. Missing required
fields show useful validation errors.

### AC-02 --- Site planning

A site plan contains page slugs, page purposes, section order, primary
CTA, selected design family, and missing-information warnings.

### AC-03 --- Schema safety

Invalid model output is rejected and does not reach the renderer.

### AC-04 --- Design diversity

Three design families produce visibly different layouts and token
combinations. Difference is not limited to color/name.

### AC-05 --- Multi-page rendering

At least Home, About, Services, and Contact render from structured data,
with working navigation.

### AC-06 --- Functional CTA

The main CTA performs its declared allowed action or displays an honest
demo/unsupported state.

### AC-07 --- Contact form

Required fields validate. Submission gives truthful feedback.
Persistence is not claimed unless verified.

### AC-08 --- Responsive preview

The site is usable at 360px, 390px, 768px, and 1440px widths, with no
critical horizontal overflow.

### AC-09 --- Editing

Editing one section changes that section without unexpectedly
overwriting unrelated sections.

### AC-10 --- Budget

The generation controller refuses a request that would exceed 250
credits before making the call. A failed generation is not charged.

### AC-11 --- QA evidence

The QA report includes actual test results and identifies anything not
tested.

### AC-12 --- Integration readiness

The website document is versioned, serializable, and independent of the
builder UI. An adapter contract is documented for the existing Website
Studio.

### AC-13 --- Demo integrity

Mocked functionality and local/demo-only integrations are explicitly
labeled. No unsupported production claims are made.

------------------------------------------------------------------------

## 15. Integration contract for the existing Website Studio

Do not integrate by importing the entire new app into the old app. Keep
the engine's core framework-independent where practical.

The integration boundary should expose: -
`createBusinessProfile(input)` - `planWebsite(profile)` -
`generateWebsite(plan, options)` - `validateWebsiteDocument(document)` -
`renderWebsite(document)` -
`editWebsiteSection(document, sectionId, patch)` -
`runWebsiteQA(document)` - `exportWebsiteDocument(document)` -
usage/cost metadata for each operation

The existing Studio can later replace its four-layout renderer with the
new renderer behind a feature flag, while keeping its current Supabase
`websites` table and publication flow initially.

Before production integration, explicitly map: - existing website
draft/published/version data to the new schema - Supabase row ownership
and business/tenant ID - Supabase Storage asset IDs and attribution -
existing OpenAI usage and credit ledger - enquiry form endpoint - route
handling for `/sites/<name>` - custom domains and Vercel configuration -
analytics and SEO metadata - version restore semantics - existing
special credit/site-limit exceptions

Do not alter production credit rules, site limits, or customer
exceptions as part of the standalone demo.

------------------------------------------------------------------------

## 16. Final report template

At the end of the day, the builder and QA agent must produce a combined
report:

``` text
PROJECT:
Commit/hash:
Local run command:
Demo URL or local URL:

IMPLEMENTED:
- ...

TESTED:
- Test:
- Command:
- Result:
- Evidence:

FAILED / BLOCKED:
- ...

MOCKED:
- ...

NOT PRODUCTION READY:
- ...

CREDIT BUDGET:
- Hard cap:
- Estimated usage:
- Actual usage if available:
- Over-budget test result:

INTEGRATION:
- Adapter available:
- Schema version:
- Production changes made: NO

GO / NO-GO:
- ...
```

------------------------------------------------------------------------

## 17. Final engineering principles

1.  Do not equate a large component count with high-quality websites.
2.  Do not equate successful JSON generation with a successful website.
3.  Do not equate a responsive screenshot with responsive behavior.
4.  Do not equate a button being visible with the action working.
5.  Do not use AI to do work that deterministic code can do more
    reliably.
6.  Do not regenerate the whole site to fix one section.
7.  Do not allow a failed test to be hidden by the builder agent.
8.  Do not charge a customer for an unsuccessful build.
9.  Do not let the prototype mutate production data.
10. Reuse the existing design library where it is validated, and extend
    it through a manifest rather than rewriting it.
11. Keep the engine's structured website document as the source of
    truth.
12. Optimize for customer acceptance, functional correctness, design
    diversity, and cost per successful site---not generation speed
    alone.

**Final instruction:** Start with the audit and fixture-based renderer.
Get a complete website working without AI first. Then connect the AI
planner and structured generator. This ensures that if model generation
fails or the credit limit is reached, the core rendering system still
works and the next-day presentation remains reliable.
