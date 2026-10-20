# Architecture & Technical Decisions (DECISIONS.md)

**Project:** Website Studio 2.0 (Presentation-Ready Vertical Slice)  
**Spec Reference:** `spec.md` (Single source of truth)  
**Status:** Approved Architectural Blueprint  
**Date:** 2026-10-20  

---

## Decision 1: Isolated Greenfield Architecture
* **Context:** The existing production Website Studio operates on Next.js/React, Supabase, and OpenAI with 4 rigid layouts. Spec constraint #5 requires complete isolation from production database, deployment, and customer workflows.
* **Decision:** Build Website Studio 2.0 as an isolated, modular Next.js + TypeScript application in `e:\website-builder-2.0`. Decouple the core engine (`src/engine/`) cleanly from the UI shell (`src/components/` and `src/app/`) so that the engine can be consumed as a standalone package or adapter inside production Website Studio later.
* **Impact:** Zero risk to production assets; clean migration path via documented adapter.

---

## Decision 2: Controlled Component Subset (12 Core Pieces)
* **Context:** The BrandScalers design library contains 98 pieces and 292 looks. Recreating all 98 pieces in React in a single-day vertical slice is impossible and explicitly prohibited by spec constraint #3.
* **Decision:** Implement a rock-solid, production-grade subset of 12 core components that cover all required page types (Home, About, Services, Contact):
  1. `site-header` (brand, nav links, CTA button, mobile drawer)
  2. `hero-split` (eyebrow, title, lead, primary/secondary CTA, offset media/stats)
  3. `hero-centered` (high-impact title, lead, dual CTA, optional background treatment)
  4. `service-grid` (grid of service tiles with icons, tags, descriptions)
  5. `feature-row` (alternating text + media story block)
  6. `testimonial-list` (quotes with client attribution and verified/demo badge)
  7. `faq-accordion` (expandable question/answer list)
  8. `gallery-grid` (curated media grid with captions and aspect control)
  9. `call-to-action` (conversion banner with primary action and trust markers)
  10. `contact-form` (validated fields: name, email, phone, message, demo feedback)
  11. `location-hours` (address, opening hours, interactive map placeholder, phone)
  12. `site-footer` (copyright, navigation links, business details, disclaimer)
* **Impact:** Maximizes visual quality and complete responsive behavior across all required pages without scope bloat.

---

## Decision 3: Design System & Token Extraction Strategy
* **Context:** The design library relies on CSS custom properties (`--accent`, `--ink`, `--bg`, `--surface`, `--footer-bg`, `--r`, `--pad`, etc.) and container data-attributes (`data-buttons`, `data-cards`, `data-images`, `data-density`, `data-align`, `data-motion`, `data-case`, `data-mode`) applied to a root `.bs` container.
* **Decision:** Extract the `.bs` CSS rules directly into a dedicated stylesheet (`src/styles/brandscalers-library.css`). Scope all rules strictly under `.bs` to avoid CSS leakage into the builder/editor interface. Implement a pure TypeScript `designToVars(tokens)` module that deterministically maps design families and presets (`Warm clinic`, `Quiet luxury`, `Editorial mono`, `Fresh green`, `Corporate navy`, `Warm restaurant`, `Playful`, `Dark premium`) to CSS variables and data attributes.
* **Impact:** 100% visual fidelity to the BrandScalers design library while guaranteeing zero CSS collisions with the builder tool UI.

---

## Decision 4: Deterministic Schema Validation & Safe Rendering
* **Context:** AI models must never generate arbitrary HTML or JavaScript (spec constraint #4).
* **Decision:** Enforce a strict Zod schema pipeline (`src/engine/schemas/`). The model only generates structured JSON adhering to `WebsiteDocument` schema. All props, actions (`internal-link`, `tel`, `mailto`, `whatsapp`, `external-link`), and slugs are validated at the API boundary. Unrecognized component types, invalid props, or dangerous URLs are rejected before reaching the renderer.
* **Impact:** Eliminates XSS and rendering crashes; guarantees predictable rendering.

---

## Decision 5: Strict 250-Credit Budget & Usage Ledger
* **Context:** Spec constraint #7 mandates a hard budget ceiling of 250 credits per initial generation. Failed generations must never charge credits.
* **Decision:** Implement a `UsageLedger` and `BudgetGuard` in `src/engine/generation/budget.ts`. Every generation step (Planning, Content Generation) calculates an estimated token cost before invocation. If `currentSpent + estimatedCost > 250`, the transaction is blocked immediately with a budget error. Actual tokens are converted to credits according to an explicit formula, recorded immutably, and only committed upon successful validation.
* **Impact:** Prevents runaway model spend and fulfills AC-10.

---

## Decision 6: Dual-Mode Model Adapter (Google Gemini API & Deterministic Fixtures)
* **Context:** Presentation reliability is paramount (spec section 13). Rather than relying on OpenAI, the project uses the Google Gemini API with server-side structured outputs. Model selection follows spec section 8 (one capable model for planning and design, one cost-efficient model for structured section content):
  - `gemini-3`: Used for site planning, information architecture, and design family/preset selection.
  - `gemini-3.1-flash-lite`: Used for cost-efficient, ultra-fast structured section content generation and targeted schema repairs to stay strictly within the 250-credit budget.
* **Decision:** Build a unified `ModelProvider` interface with two implementations:
  1. `GeminiProvider`: Uses the official Google Gen AI SDK (`@google/genai`) with `gemini-3` and `gemini-3.1-flash-lite`, using structured JSON schema outputs (`responseSchema` and `responseMimeType: "application/json"`) and budget metering.
  2. `FixtureProvider`: Deterministic, high-quality domain generators for 3 benchmark business types (Clinic, Editorial Shop, Creative Agency) that simulate planning and generation with realistic delays and token accounting.
  When credentials are not present or upon request, the UI clearly displays `[DEMO / LOCAL FIXTURE MODE]` in compliance with AC-13.
* **Impact:** State-of-the-art reasoning for planning (`gemini-3`), paired with ultra-efficient generation (`gemini-3.1-flash-lite`) guaranteed to respect the 250-credit limit; foolproof presentation resilience; satisfies AC-13 and AC-10.

---

## Decision 7: Granular Section-Level Editing
* **Context:** AC-09 requires section-level editing without regenerating the entire site.
* **Decision:** The editor manipulates the immutable `WebsiteDocument` state directly in React. Users can edit text, toggle visibility, change card/surface styles, and switch alignment. Any edit produces a new document revision that is re-validated via Zod.
* **Impact:** Instant preview feedback with zero token cost for manual edits.

---

## Decision 8: Automated & In-App QA Verification
* **Context:** AC-11 mandates deterministic QA checks for schema, links, forms, viewport responsiveness, and credit caps.
* **Decision:** Build two QA layers:
  1. Automated test suite using Vitest/Playwright for CLI regression tests.
  2. Built-in interactive QA Panel in the UI (`src/engine/qa/`) that evaluates the active `WebsiteDocument` against 15+ automated checks (H1 count, slug uniqueness, link resolution, CTA validity, form fields, viewport compliance) and outputs an interactive score and log.
* **Impact:** Visible proof of quality directly inside the presentation demo.
