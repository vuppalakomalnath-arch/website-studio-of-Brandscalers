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
Postgres, Supabase Storage, previously OpenAI `gpt-5.4-mini`, Pexels/Pixabay
assets, and a JSON-first generation flow. The generated JSON is rendered
through four fixed React layouts. A separate design library has been
created with plain HTML renderers, 98 pieces and 292 looks as described
by the project owner, but it is not connected to Website Studio.

The reported user problem is that generated sites look generic and
static. The likely structural limitation is that the model supplies
text/content while a small fixed layout set controls the visual
composition.

### Product outcome

Build a separate, demoable engine in Antigravity IDE that:
- Collects comprehensive business information from users.
- Creates a business-specific website plan and sitemap.
- Chooses a design family and validated design tokens from the design library.
- Generates structured page and section data using Google Gemini models (`gemini-3` and `gemini-3.5-flash-lite`).
- Renders pages using a reusable, trusted component system.
- Uses appropriate supplied/demo/stock assets, with source metadata.
- Supports real navigation and working core interactions.
- Provides desktop and mobile preview and section-level editing.
- Runs deterministic checks and automated smoke tests.
- Enforces a maximum initial generation charge of 250 business credits.
- Keeps the core engine independent from the existing Studio UI, so it can be integrated behind an adapter later.

### Success statement

A reviewer can enter a realistic business brief, generate a multi-page
site with a coherent visual direction, navigate between pages, use the
main CTA/contact form, edit a section, preview mobile layout, run QA,
and see a clear result---all without relying on arbitrary AI-generated
code.

------------------------------------------------------------------------

## 2. One-day delivery definition

### Immediate vertical slice scope

The immediate objective is to build a working, presentation-ready vertical slice within one day. This is a vertical slice, not a claim that the complete production-ready Website Studio replacement has been finished. The immediate presentation scope must remain strictly distinct from remaining requirements for production integration.

The vertical slice must demonstrate that the engine can:
1. **Collect information from users about their businesses** through structured intake covering common and category-specific needs.
2. **Generate an appropriate website from the collected information** using structured planning and content generation.
3. **Select and compose suitable design components intelligently** rather than choosing randomly or using identical layouts.
4. **Render different websites for different business categories** with distinct visual treatments, typography, and section order.
5. **Allow users to edit supported website features** (text, section visibility, surface styles, alignment) without breaking unrelated sections.
6. **Preview and test the generated websites** across multiple responsive viewports (Desktop 1440px, Tablet 768px, Mobile 390px, Compact Mobile 360px).
7. **Verify core website functionality through testing** (schema validation, link targets, contact form feedback, credit ceiling enforcement).

### Required presentation deliverable

By the end of the day, the new project must demonstrate this happy path:

1.  Enter business name, business type, location/service area, audience,
    website goal, services, differentiators, contact details, preferred
    style, and optional reference/brand notes.
2.  Review a generated sitemap/design plan.
3.  Generate a website with at least Home, About, Services, and Contact
    pages, with page structure adjusted to the business.
4.  Render at least three visibly different design directions from the
    shared component system (e.g. editorial/premium,
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

These are future roadmap capabilities for production integration. Do not fake them in the demo.

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

The owner supplied four foundational design library and sample assets:
1. `BrandScalers-Design-Library-292-looks.html` (comprehensive design library and look playground)
2. `Sample-page-Busy-clinic.html` (healthcare / clinic reference page)
3. `Sample-page-Editorial-shop.html` (retail / editorial shop reference page)
4. `Sample-page-Premium-minimal.html` (premium minimal / agency / portfolio reference page)

The main playground demonstrates:
- Design tokens via CSS custom properties (`--font-display`, `--font-body`, `--color-primary`, `--color-surface`, `--color-text`, `--radius`, `--space-unit`, `--shadow`).
- Root-level data attributes controlling buttons (`pill`, `rounded`, `sharp`), cards, images (`aspect`, `corners`), density (`compact`, `comfortable`, `spacious`), alignment, motion, heading case, and light/dark mode.
- Named presets including:
  - *Warm clinic*
  - *Quiet luxury*
  - *Editorial mono*
  - *Fresh green*
  - *Corporate navy*
  - *Warm restaurant*
  - *Playful*
  - *Dark premium*
- Font pair configurations including:
  - Inter + Inter
  - Playfair Display + Inter
  - Cormorant Garamond + Jost
  - Poppins + Inter
  - DM Serif Display + DM Sans
  - Space Grotesk + Inter
  - Fraunces + Work Sans
  - Montserrat + Open Sans
  - Figtree + Figtree
- Reusable visual patterns for headers, heroes, services, pricing, testimonials, teams, galleries, FAQs, forms, product/catalogue displays, menus, courses, property listings, and footers.
- Browser behavior patterns for interactive components such as tabs, carousels, mobile navigation drawers, overlays, and counters.
- CSS helpers for grids, cards, buttons, surfaces, image containers, spacing rhythm, and responsive behavior.

The supplied sample files use the `.bs` styling system and design variables. In the inspected sample markup, images are implemented with controlled styling and background placeholders rather than arbitrary unmanaged tags; this must not be mistaken for the final production asset storage pipeline. The sample pages also reference Google Fonts, while the production block library self-hosts fonts. The engine adheres to production policies rather than blindly copying third-party demo dependencies.

### Integration decision

**Reuse the library's visual vocabulary, design tokens, and approved component concepts; build an autonomous website-generation and composition pipeline rather than displaying a fixed template with text substitution or embedding the playground wholesale.**

The library contains 98 pieces and 292 looks. Within the one-day vertical slice:
1. Do not recreate all 98 pieces and 292 looks. Focus on the core manifest of 12 components.
2. Build a machine-readable manifest of supported components.
3. Map each component to a trusted React renderer.
4. Map design presets and typography pairings to typed token objects.
5. Reuse compatible CSS variables and utility classes in isolation, preventing leakages into builder UI chrome.
6. Use reliable local assets or explicit placeholders for the demo.
7. Record the source piece/preset name in metadata for traceability.
8. Defer the remaining library pieces until they can be validated and integrated individually.

### Component manifest (Selected for Vertical Slice)

The vertical slice implements the 12 core component types:
1. `site-header` — Responsive navigation bar, logo/brand name, nav links, and primary action button.
2. `hero-split` — Split 2-column hero with headline, value proposition, CTA buttons, and feature media/badge.
3. `hero-centered` — Focused centered hero with badge, high-impact headline, sub-headline, and dual CTAs.
4. `service-grid` — Multi-column card grid showcasing offered services/products with icons, descriptions, and links.
5. `feature-row` — Alternating zig-zag visual rows with narrative copy, supporting metrics, and imagery.
6. `testimonial-list` — Customer social proof cards with quote, client attribution, rating, and avatar.
7. `faq-accordion` — Interactive expandable accordion for common customer inquiries and objections.
8. `gallery-grid` — Visual showcase gallery with responsive grid layout and media captioning.
9. `call-to-action` — High-conversion banner with bold headline, reassurance text, and prominent conversion button.
10. `contact-form` — Functional enquiry form with name, email, phone, message fields, validation, and demo feedback.
11. `location-hours` — Business location details, service area description, operating hours table, and direct contact buttons.
12. `site-footer` — Comprehensive site footer with brand overview, navigation links, hours summary, contact info, and copyright.

*Deferred for post-vertical slice:* `pricing-grid`, `team-grid`, `product-grid`, `tabs`, `carousel`.

Each manifest entry strictly defines:
- `type` and `version`
- category and description
- supported Zod props schema
- allowed action types (`internal-link`, `tel`, `mailto`, `whatsapp`, `external-link`, `contact-form`)
- responsive behavior (mobile, tablet, desktop)
- accessibility requirements (ARIA roles, keyboard navigation, contrast)
- whether external assets or integrations are needed
- provenance/source component from the 98-piece library

**Business-aware component selection:** The engine must use collected business information (e.g., category, goals, products/services, hours) to select and sequence appropriate components, styling presets, and content structure intelligently rather than choosing randomly or using the exact same layout for every business.

Never permit model output to provide raw HTML, JavaScript, arbitrary CSS, event handlers, or unvalidated URLs.

------------------------------------------------------------------------

## 5. Complete user information collection requirements

The user intake is mandatory. It explicitly documents the information collected from the user before website generation using progressive disclosure.
Fields are classified as **Required**, **Optional**, or **Conditional**. The user must be able to proceed without supplying optional or non-applicable fields.

### A. Common business information

The intake covers the following 20 pieces of business information:

1. **Business type or category** *(Required)*: Primary industry classification (e.g., Healthcare, Restaurant, Agency, Portfolio, Retail, Education, Local Services). Drives conditional question disclosure, design preset selection, and component architecture.
2. **Business name** *(Required)*: Exact legal or trading name displayed across branding, headers, metadata, and legal footers.
3. **Business location and service area** *(Conditional/Required for local services, Optional for digital/global businesses)*: Physical street address, city, postcode, and geographical service radius/cities served.
4. **Primary website goal** *(Required)*: Core conversion objective (e.g., direct calls, online enquiries, WhatsApp messages, external bookings/reservations, portfolio showcase, product catalogue). Determines primary CTA action type and placement.
5. **Target audience or customers** *(Optional, default: "General public / Local clients")*: Description of ideal customers, demographics, and key problems solved. Guides tone of voice and narrative complexity.
6. **Products or services offered** *(Required)*: At least one primary offering with names and descriptions. Populates service grid cards and navigation anchors.
7. **Unique selling points (USPs) and differentiators** *(Optional)*: Key advantages (e.g., "15+ years experience", "Same-day appointments", "Licensed & Insured"). Informs feature row highlights and badge copy.
8. **Preferred design style and visual direction** *(Optional, default: "Recommend for me")*: Visual preference (e.g., Warm clinic, Quiet luxury, Editorial mono, Fresh green, Corporate navy, Warm restaurant, Dark premium, Playful). Guides design preset token mapping.
9. **Required website pages and sections** *(Optional, default: "Recommend for me")*: Specific requested pages (e.g., Home, About, Services, Contact, FAQ, Gallery). Informs sitemap generation.
10. **Reference or inspiration website URL** *(Optional)*: URL of a website the user admires for structure, tone, or visual rhythm.
11. **Preferred elements or styles from reference website** *(Optional)*: Specific notes on what to borrow (e.g., "clean typography", "grid layout", "card styling").
12. **Existing logo and brand assets** *(Optional)*: Uploaded logo asset ID, image file, or brand mark. If absent, engine falls back to styled typography brand name.
13. **Available business images and photos** *(Optional)*: High-resolution client photography. If not provided, fallback to verified curated demo/stock imagery with correct attribution.
14. **Existing website URL** *(Optional)*: Current live website for factual background extraction or domain migration reference.
15. **Business description and content** *(Optional)*: Extended narrative about the business history, mission, founder background, and ethos.
16. **Contact information** *(Required)*: Primary phone, email, WhatsApp number, or address corresponding to the primary website goal.
17. **Required functionality and integrations** *(Optional)*: Integration hooks (e.g., Google Maps link, external booking widget URL, Instagram feed link, PDF menu).
18. **Testimonials, certifications, and approved business proof** *(Optional)*: Real client reviews, accreditation badges, industry awards. The engine never invents fake testimonials or reviews.
19. **Social media links** *(Optional)*: URLs for Instagram, Facebook, LinkedIn, X, YouTube, TikTok. Populates social icons in header and footer.
20. **Additional requirements and notes** *(Optional)*: Custom constraints, compliance notices, disclaimer text, or specific instructions.

### B. Category-specific conditional information

Displayed conditionally only when the corresponding business category is selected:

1. **Restaurant**
   - Cuisine type (e.g., Italian, Artisanal bakery, Pan-Asian).
   - Menu highlights or URL.
   - Operating hours (lunch, dinner, days open).
   - Dietary accommodations (vegan, gluten-free, halal).
   - Delivery platform links (UberEats, Deliveroo, DoorDash).
   - Reservation links (OpenTable, Resy, SevenRooms).

2. **Healthcare / Clinic**
   - Specific treatments and procedures offered.
   - Practitioner credentials, qualifications, and registration numbers.
   - Accepted insurances or payment options.
   - Patient contact and triage methods (emergency disclaimer, booking hotline).

3. **Agency / B2B**
   - Specialized service packages.
   - Target industries and enterprise verticals.
   - Portfolio project highlights and client logos.
   - Case studies (challenge, solution, quantified outcome).

4. **Portfolio / Creative**
   - Featured projects and creative works.
   - Creator role and discipline (e.g., Art Director, UI/UX Designer, Architect).
   - Technical and creative skills.
   - High-resolution project visual assets.

5. **Retail / Catalogue**
   - Product catalogue categories and collections.
   - Featured products, descriptions, and SKU highlights.
   - Pricing display preferences (show exact prices vs request quote).
   - Product imagery slots and enquiry/order flows.

6. **Education / Training**
   - Subjects, programs, and courses offered.
   - Target age groups and skill levels.
   - Learning delivery format (in-person, hybrid, self-paced).
   - Faculty credentials and curriculum highlights.

7. **Local Services (Plumbing, Electrical, Cleaning, etc.)**
   - Defined service areas and emergency radius.
   - Emergency availability (24/7 vs standard business hours).
   - Operating schedule.
   - Specific service details, licensing, and insurance warranties.

### C. How collected information is used by the generation pipeline

- **Structured Content:** Direct business facts (name, phone, email, address, services, hours, USPs) are deterministically bound to component props. The AI model is strictly instructed never to fabricate reviews, team members, or medical claims.
- **Section Selection & Architecture:** Primary goals and category data dictate section composition (e.g., a Restaurant automatically includes `location-hours` and reservation CTAs; a Clinic includes credential badges and treatment FAQs; an Agency prioritizes `feature-row` case studies and `service-grid`).
- **Styling & Tokens:** Category and preferred style directly select the design preset (e.g., *Warm clinic* for healthcare, *Warm restaurant* for dining, *Quiet luxury* for upscale portfolio/retail).
- **Reference Websites:** If a reference website URL is provided, the engine may inspect structural cues, color harmony, and typographic feel. It must **NEVER** copy copyright text, proprietary images, or private assets from reference sites.
- **State Separation:** The normalized business profile is stored independently as `BusinessProfile` JSON and can be revised without destroying downstream customizations.

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

### Approved Model Hierarchy (Google Gemini API)

The engine standardizes on Google Gemini models via `@google/genai` or standard REST API endpoints, enforcing a strict separation of concerns between high-level reasoning and structured payload generation:

1. **Planning, IA, and Strategic Design: `gemini-3`**
   - High-reasoning model responsible for synthesizing the raw business intake into the structured `SitePlan`.
   - Generates page hierarchy, section selection, sequence, CTA strategy, color palette rationale, and preset token overrides.
   - Operates with strict JSON schemas and bounded temperature (`0.2`).

2. **Section Generation, Content Infilling, and Targeted Repair: `gemini-3.5-flash-lite`**
   - High-throughput, ultra-cost-effective model responsible for generating detailed props for individual sections (headlines, feature copy, FAQ items).
   - Handles localized section rewrites and schema repair tasks without depleting the credit budget.
   - Enforces business-specific facts, zero hallucination of reviews, and token discipline.

Vision inputs are reserved strictly for reference website screenshots or user brand asset inspection where available. No dedicated code-generation model is used, as the engine renders via a trusted React component registry.

### Provider adapter

All model calls must go through an internal, server-side interface:

``` ts
interface ModelProvider {
  generateStructured<T>(input: {
    task: "plan" | "section" | "repair";
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

Implement the provider with server-side credentials (`GEMINI_API_KEY`). Never expose keys to client-side bundles.

### Complete Credit Policy and Business Rules

The engine implements and documents the full credit economy:

1. **Initial Build Cost:** An initial successful AI website build deducts exactly **250 credits** from that business's balance.
2. **Starting Balance:** Every new business receives **1,000 starting credits** upon account onboarding.
3. **AI Edit Pricing:** AI-assisted section rewrites or targeted changes cost **5 credits per change made** (e.g., 5 AI edits = 25 credits).
4. **Free Manual Edits:** Direct user edits — including manual text edits, section reordering, show/hide toggles, styling controls, and image swaps — are completely **free (0 credits)**.
5. **Zero-Charge Failure Rule:** If a generation, edit, or repair operation fails or is rejected by schema validation, **0 credits are charged**. The business is charged only if the build or edit succeeds end-to-end.
6. **Plan Site Limits:** Tiered limits across plans:
   - *Starter Plan:* Maximum of **1 site**.
   - *Growth Plan:* Maximum of **2 sites**.
   - *Pro Plan:* Maximum of **5 sites**.
7. **Production Account Exceptions:**
   - `The Eventful Cakes`: Configured with an unlimited-AI generation exception.
   - `brandscalers@gmail.com`: Configured with a special 10-site allowance.
8. **Billing & Refills:** Monthly plan credit rollovers are deferred; credit refills are processed manually or via administrative top-up.
9. **Pre-flight Budget Guard:** The engine calculates estimated credit and token cost prior to invoking any model. If the business has fewer than 250 credits (or the estimated cost exceeds the remaining balance), the operation is blocked pre-flight before incurring provider API costs.
10. **Ledger & Audit Trail:** Every operation logs task, model name, input/output tokens, internal credits deducted, provider cost, and timestamp to a persistent ledger. Internal credits are decoupled from external provider API dollar costs.

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

## 10. Website editing requirements

The website builder provides an integrated visual and structured editor operating on the `WebsiteDocument` state. Edits are deterministic and update the live preview in real time without triggering full regenerations.

### Supported Editing Features
1. **In-place Text Editing:** Direct modification of headlines, subheadings, badge text, body paragraphs, and button CTA text.
2. **Component Property & Styling Controls:** Adjusting section-level alignment (left, center), visual density (compact, comfortable, spacious), surface backgrounds (default, subtle, brand-tint, dark), and border/radius styles.
3. **Show / Hide Sections:** Granular visibility toggle on any page section without deleting its configured properties.
4. **Section Reordering:** Moving sections up or down the page sequence to optimize narrative and conversion hierarchy.
5. **Image Swapping:** Replacing any hero, feature, or gallery image with local assets, curated demo media, or approved image URLs with alt text.
6. **AI-Assisted Targeted Editing:** AI-driven section copy polish or rewriting using `gemini-3.5-flash-lite` that returns only validated property changes for that targeted section ID.
7. **Real-time Preview Synchronization:** All edits reflect immediately in the side-by-side desktop/mobile preview and revalidate against the component's Zod schema.

### Editing Credit Rules
- **Free Manual Edits:** All user manual edits (text typing, reordering, show/hide, styling property toggles, image swaps) cost **0 credits**.
- **Credit-Incurring AI Edits:** AI-assisted section rewrites deduct **5 credits per accepted modification** (e.g., 5 AI edits = 25 credits).
- **Failed Edits:** Any rejected or errored AI edit incurs **0 credits**.
- **Honest Capability Boundaries:** The system does not claim "unlimited free AI editing" or unconstrained full-site redesign via chat.

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

## 12. Two-chat Antigravity workflow and manual testing journey

To ensure complete rigor and prevent conflict of interest, the project defines two separate agent roles operating in separate Antigravity chats, bridged by an explicit user manual testing journey.

### Explicit Execution Sequence
1. **Phase 1 — Builder Agent Implementation:** The Builder Agent develops the engine, components, intake, renderer, Gemini provider, and automated tests, verifying passing test suites (24/24 tests) and starting the local server.
2. **Phase 2 — User Interactive Journey & Verification:** Before handing the project over to the QA Agent, the user launches the application, tests the end-to-end journey personally, and validates real-world usability and responsiveness.
3. **Phase 3 — Independent QA & Monitoring Agent:** The QA Agent assumes an adversarial, read-only inspection role to audit compliance against `spec.md`, run regression suites, verify budget caps, test edge cases, and output `QA-REPORT.md`.

### Browser Preview and Local Testing Environment
- **Localhost Execution:** Development server runs continuously at `http://localhost:3000`.
- **Integrated Browser / Chrome:** The application is verified in Antigravity's integrated browser preview or desktop Google Chrome.
- **Server Persistence:** The background server process remains running during user testing and QA evaluation.

### Complete 10-Step User Testing Journey
1. **Open the Website Builder:** Launch `http://localhost:3000` and verify application chrome, credit counter (1,000 credits), and empty state.
2. **Enter Business Intake Details:** Fill out business name, category, location, primary goal, products/services, and conditional questions (e.g., healthcare treatments or restaurant cuisine).
3. **Generate Website via Gemini API:** Trigger AI generation and observe progress indicators, model status (`gemini-3` planning -> `gemini-3.5-flash-lite` infilling), and credit balance deduction (250 credits deducted).
4. **Inspect Generated Output:** Examine semantic structure, color harmony, typography pairings, authentic factual content (no fake reviews), and visual hierarchy.
5. **Check Responsive Viewport Preview:** Toggle between Desktop (1440px), Tablet (768px), and Mobile (375px/390px) screen sizes without horizontal overflow.
6. **Perform In-Place Manual Edits:** Modify headlines, change section surface styling (e.g., subtle to brand-tint), toggle section visibility, and reorder sections.
7. **Verify Real-Time Preview Updates:** Confirm all edits update the live preview instantly and preserve unrelated sections.
8. **Test Interactive Elements:** Click navigation anchor links, mobile hamburger drawer, FAQ accordion collapse/expand, and submit the contact form to verify truthful feedback.
9. **Test a Second Business Category:** Generate a contrasting business (e.g., Restaurant vs Healthcare Clinic) to verify that the engine creates an entirely different layout, token set, and section composition.
10. **Validate Error Handling & Budget Guard:** Test validation errors for missing required fields, simulation of over-budget scenarios, and non-charging failure behavior.

### Chat A — Builder / Implementation Agent Responsibilities
- Implement according to `spec.md`.
- Maintain `DECISIONS.md` and `TEST-RESULTS.md`.
- Do not mark tasks complete without running real verification commands.
- Provide clear run instructions, environment configuration, and status summaries.

### Chat B — QA / Testing / Monitoring Agent Responsibilities
- Read-only inspection of implementation files and runtime logs.
- Adversarial testing of schemas, responsive layouts, credit budget enforcement, and security boundaries.
- Verification that mocked capabilities are truthfully labeled and not presented as production-ready.
- Output comprehensive findings, issue severities (P0 to P3), and a final Go/No-Go verdict in `QA-REPORT.md`.

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

## 15. Production Website Studio integration contract

Website Builder 2.0 is developed as an isolated vertical slice and must remain strictly decoupled from the live production Website Studio. It makes zero changes to production databases, storage buckets, user sessions, or deployment workflows.

When scheduled for production integration, the engine will interface with the existing platform through a formal, versioned contract across 13 core production subsystems:

1. **Supabase `websites` Table Schema Mapping:** Mapping legacy draft/published 4-layout columns to the versioned `WebsiteDocument` JSON schema.
2. **Multi-Tenant Row-Level Security (RLS) & Ownership:** Enforcing strict `business_id` and `tenant_id` boundaries on all document reads and mutations.
3. **Supabase Storage Asset Pipeline:** Interfacing with production storage buckets for user brand uploads, logo processing, and asset attribution metadata.
4. **Credit Ledger & Billing Service:** Connecting generation and edit events to the production credit deduction RPC, handling starting balances (1,000 credits), refill hooks, and pre-flight balance checks.
5. **Special Account Exception Rules:** Respecting production rules in code/database (e.g., `The Eventful Cakes` unlimited-AI generation, `brandscalers@gmail.com` 10-site allowance).
6. **Plan Tier Enforcement:** Validating site creation limits according to subscription tiers (Starter: 1 site, Growth: 2 sites, Pro: 5 sites).
7. **Production Enquiry Form API:** Routing form submissions from the generated `contact-form` to the production lead capture webhook, CRM integration, and notification service.
8. **Subpath & Custom Domain Routing:** Integrating with production routing for vanity subpaths (`/sites/:slug`) and custom domain mapping on Vercel.
9. **SEO, Meta Tags & Analytics Pipeline:** Exposing OpenGraph tags, JSON-LD structured data, sitemap generation, and GA4 / Google Tag Manager integration hooks.
10. **Version History & Document Restore:** Supporting snapshots, revision rollbacks, and diff comparisons via the structured `WebsiteDocument` format.
11. **Production Gemini & AI Provider Infrastructure:** Transitioning from standalone API keys to enterprise secret managers and centralized model proxy gateways.
12. **Block Library Font Self-Hosting:** Aligning with the production design library policy of self-hosted typography rather than direct Google Fonts CDN runtime calls.
13. **Feature-Flagged Phased Rollout:** Enabling side-by-side Canary deployment where the new engine powers select business categories while legacy layouts remain available.

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
