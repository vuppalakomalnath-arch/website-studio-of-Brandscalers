# Website Studio 2.0 — Existing-Project Evolution Specification

**Repository:** https://github.com/vuppalakomalnath-arch/website-studio-of-Brandscalers  
**Purpose:** Single source of truth for the next implementation phase.  
**Hard constraint:** Continue the existing Website Studio 2.0 repository and application. Do not scaffold a new project, create a parallel builder, or replace working code without a verified migration.

## 0. Mandatory rules

1. Read this entire file and inspect the current `README.md`, `spec.md`, `spec (1).md`, `DECISIONS.md`, `PROJECT-REPORT.md`, `QA-REPORT.md`, `TEST-RESULTS.md`, `package.json`, `.env.example`, source files and tests before changing code.
2. Treat this as the governing specification for the next phase. Map each requirement to existing files and tests before implementation. Do not assume file paths or trust historical reports as proof of the current working tree.
3. Continue inside this repository. Do not create a new Next.js project, repository, replacement application, or parallel Website Studio.
4. Preserve the current Next.js + TypeScript + React architecture, Zod schemas, generation engine, BrandScalers design library, component manifest, renderers, editor, responsive preview, QA, fixtures and tests wherever they already meet the requirements.
5. Keep production customer data, production databases, credentials, API keys, billing, published websites and customer workflows safe. Do not make destructive migrations or production changes without explicit approval, a verified integration contract and rollback plan.
6. Never copy secrets or production data into source control, fixtures, prompts, client code, exports or logs. API keys must remain server-side.
7. The model may return structured data only. Never trust it to produce executable React, HTML, JavaScript, CSS, SQL, event handlers, arbitrary URLs or unsupported components.
8. Never invent business facts, reviews, testimonials, credentials, certifications, awards, addresses, hours, prices, customer logos or quantified outcomes. Use verified/user-provided content; mark demo fixtures and placeholders clearly.
9. Do not weaken/delete tests, suppress console errors, or claim a test passed unless it was actually run and observed.
10. Failed builds and failed AI edits must cost zero business credits. Accounting must be server-side, transactional and idempotent.
11. Mark every mocked/simulated integration clearly. Never claim simulated publish, email, booking, payment, enquiry delivery, domain or analytics events are real.
12. Make small changes, retain a working checkpoint, and run tests after each logical phase. Record important architecture/scope decisions in `DECISIONS.md`.
13. Avoid adding a queue, vector database, agent framework, microservice or second backend without a demonstrated requirement.
14. Final handoff must list files changed, tests and results, measured model usage/cost, mocked capabilities, known defects and production blockers.

## 1. Goal

Improve the existing Website Studio 2.0 so users provide only a few initial business details, receive relevant adaptive questions, review a business-specific website plan, generate a visually distinctive multi-page website, edit it safely, run QA and continue through the existing publishing workflow.

The current pain points are too many generic questions, irrelevant questions for the business type, generic/static-looking layouts and cost concerns. Success means better business-specific results with fewer unnecessary questions and model calls—not “more AI.”

## 2. Repository baseline and preflight audit

The public repository documents an existing Next.js/React + TypeScript application with Zod schemas, planning/generation endpoints, a structured website document, a BrandScalers design library, component renderers, editing, responsive preview, QA and a 250-business-credit generation ceiling. Its current `package.json` lists Google Gemini SDK dependencies. Repository reports are historical evidence; verify the current checked-out code before acting.

Inspect and document:
- actual app entry points and route handlers (including `/api/plan` and `/api/generate` if present);
- source modules for business profile, site plan, website document, provider, prompts, budget, renderer, assets, editor, QA and export;
- current inference/category rules and question flow;
- current BrandScalers CSS, tokens, presets, manifest and component registry;
- tests, fixtures, known QA defects and current command scripts;
- current provider/model/fallback, token usage, credit ledger and failure handling;
- real production contracts for auth, Supabase, storage, publishing, versions, domains, enquiries and analytics, if accessible.

Create a requirement-to-file map and baseline test report before changing code. Do not assume the isolated demo has production access. Do not create `spec (2).md`, `spec-new.md` or another duplicate specification; maintain one canonical `spec.md`.

## 3. Architecture principles

**AI interprets and plans; deterministic code validates, renders and controls money.**

`Existing login/session → minimal intake → local inference → adaptive questions → confirmed profile → site plan → design selection → structured document/content → schema validation → trusted renderer → preview/editor → QA → approval → existing publishing adapter`

- Continue the current Next.js, TypeScript, React and Zod stack.
- Reuse the current engine, schemas, design library, manifest, renderer, editor, fixtures and tests.
- Keep model provider access behind a typed server-side adapter.
- Keep deterministic/fixture mode working without an API key; tests must not require paid calls.
- No raw model-generated executable website code.
- Do not add a new backend/database unless inspection proves it necessary.

## 4. Preserve the existing Google/Gemini provider

**Do not migrate from Google/Gemini to OpenAI.** The owner has explicitly chosen to keep the existing Google model provider. Continue development using the repository's current Google/Gemini SDK, provider abstraction, configured model and existing environment-variable conventions.

1. Audit the current Google/Gemini provider, model configuration, prompts, routes, usage accounting and tests before changing anything.
2. Keep the existing Google/Gemini provider as the live provider. Do not add OpenAI SDK dependencies, `OPENAI_API_KEY`, `OPENAI_MODEL`, or an OpenAI migration path as part of this work.
3. Do not change the current model name or provider configuration unless a separate, explicitly approved decision requires it.
4. Use the provider's currently supported structured-output/JSON-schema capability where compatible with the configured model; validate every model response again with Zod and known enum/manifest allowlists.
5. Add or preserve timeouts, bounded retries, maximum output tokens, safe error mapping and usage telemetry using the existing provider integration.
6. Keep fixtures/no-key mode working. Unit tests must not make paid API calls.
7. Do not remove or replace Google/Gemini dependencies or provider code. Refactor the provider abstraction only if needed to support the adaptive architecture while retaining Google as the active provider.
8. Keep credentials server-side and use the repository's existing Google/Gemini environment variable names. Never expose API keys, raw sensitive provider errors, unnecessary personal data or full prompt/response payloads to the browser/logs.
9. Verify current official Google/Gemini model capabilities and pricing when implementing cost calculations; do not hard-code historical prices or assume an example rate is current.

## 5. Complete user flow

### Stage 0 — Login and existing account context
Use existing Website Studio authentication; do not introduce a second login. Local demo mode may use fixtures but must be labelled. Load business and credit balance via trusted server logic. Never trust a browser-supplied balance. Opening the builder must not trigger generation.

### Stage 1 — Minimal business details
Ask only:
1. Business name (required).
2. Business category (required, including “Not sure / Recommend for me”).
3. What the business offers (required short free-text description).

Examples:
- `Lakshmi Dental Clinic` / Healthcare / dental checkups, braces and root canal treatment.
- `Mango & Mint` / Not sure / cafe serving coffee, pastries and brunch.
- `Studio Anu` / Not sure / wedding photography and pre-wedding films.
- `Northstar` / Not sure / bookkeeping and tax preparation for small businesses.

Category is a prior, not the final answer. Combine category, name and offer. If they conflict, use confidence-aware inference or one concise clarification. Do not ask the same thing twice.

### Stage 2 — Local inference (zero model calls in the normal path)
Implement a pure TypeScript rules engine. It must make no network/API calls.

Supported archetypes at minimum:
- ecommerce/product retail;
- product catalogue/local retail without checkout;
- local service;
- professional/B2B/agency;
- portfolio/creator;
- restaurant/cafe/food;
- healthcare/clinic;
- education/course/tutor;
- event/venue;
- hospitality/accommodation;
- nonprofit/community;
- personal brand;
- general lead-generation/informational;
- mixed/other.

The typed `BusinessInference` result should contain: schema version, primary/secondary archetype, confidence band, likely goal, customer journey, candidate pages, required capabilities, missing high-impact information, contradictions, recommended question IDs, source (`rules`, `ai_fallback`, `user_confirmed`) and rules version.

Use transparent rules and tests; avoid a large pile of business-name-specific hacks. A user must be able to correct the inferred archetype.

**Critical:** a clinic, consultant, portfolio, restaurant or other non-retail business must not be asked “Do you want to sell products?” unless their description suggests product sales.

### Stage 3 — Google/Gemini ambiguity fallback (exceptional)
Call the existing Google/Gemini model only when:
- local confidence is low or signals conflict; and
- ambiguity can change the sitemap, primary customer journey or required functionality; and
- a short user clarification is not preferable.

Do not call AI to render a question, branch a UI, restate a known category or do a deterministic operation.

Send only minimum necessary data: name, category, offer description and supported enum options. Do not send contact details, account IDs, uploaded files or unnecessary personal data.

Require strict structured output with primary/secondary archetypes, confidence, goal, journey, candidate pages, required capabilities, ambiguities, recommended question IDs and reason codes. Zod-validate it; reject unknown enum values, unsupported question IDs, invalid confidence, unexpected actions and malformed results.

On timeout, provider failure, invalid JSON/schema or budget limit, fall back to local inference and ask one clear clarification. Do not retry indefinitely. Cache only validated results where safe, using normalized input + schema/rules version and strict tenant/privacy boundaries. Allow user correction.

### Stage 4 — Adaptive follow-up questions
The question engine must be deterministic. Selecting an answer updates state and re-evaluates rules; it must not trigger a model call. Each question definition needs a stable ID, label, input type/options, applicability conditions, required/optional status, why it is needed, affected plan fields, validation, default/skip behavior and an AI-call policy defaulting to `never`.

Ask only what is missing and materially affects structure or functionality. Common fields, only when not already known:
- main goal;
- audience;
- location/service area when relevant;
- primary CTA/contact channel;
- tone/style or “Recommend for me”;
- existing logo/photos/brand assets;
- reference/existing website (optional);
- requested pages (optional);
- non-negotiable constraints.

Conditional questions:

**Ecommerce / retail**
- Website catalogue, online checkout, physical store, WhatsApp/social sales, or a combination.
- Product categories and approximate catalogue size.
- Shipping, pickup/delivery and checkout provider only if applicable.
- Inventory/import requirements only when needed.
Never claim payment, checkout, inventory or shipping functionality works without a real verified integration.

**Catalogue/local shop**
- Visit store, call, WhatsApp, external order or online purchase as primary action.
- Location/hours and product/category highlights if relevant.
- Show prices only when provided/approved.

**Services**
- Primary services and service area.
- Booking link, quote form, phone, WhatsApp or general enquiry.
- Existing external booking provider, if any.
- Do not invent availability or business hours.

**Professional/B2B/agency**
- Main services, target industries, desired conversion.
- Approved case studies, real portfolio, verified outcomes and client logos only if supplied.

**Portfolio/creator**
- Work categories, featured projects, audience and CTA (enquiry, call, résumé, view work or social links). Do not show checkout questions unless selling is indicated.

**Restaurant/cafe**
- Menu URL/file, cuisine/menu highlights, location/hours if provided.
- Visit, reservation, takeaway, delivery or external ordering.
- Dietary options only if supplied. Reservation/ordering is real only if integrated.

**Healthcare/clinic**
- Treatments, location/service area, contact method, appointment method and existing external booking link.
- Credentials only when verified and supplied.
- Never collect patient medical data for the website intake; no diagnostic or emergency-triage claims.

**Education**
- Subjects/courses, target audience, delivery mode, and enquiry/trial/application/course catalogue goal.
- Registration/payment only when actually supported and requested.

**Event/venue/hospitality**
- Type, location, primary CTA and dates/availability only if relevant.
- Use verified external booking links unless a real booking integration exists.

**Nonprofit/community**
- Mission, programs, volunteer/donation/contact goal.
- Donations are real only with verified payment integration; otherwise link externally.

**Mixed/unclear**
Ask one concise disambiguating question, e.g. “Do customers mainly book your service or buy products from you?” Never show all category questions at once.

**Recommend for me**
Recommend pages and sections from the confirmed business profile, audience, goal and available assets. Include About, Testimonials/Reviews and FAQ when useful and factually supported. Never invent reviews, awards, company history, policies or credentials. If testimonials are unavailable, omit the section or use a clearly marked draft placeholder that must be replaced/removed before publishing. Users can add/remove recommended pages and sections.

A new AI call is allowed only if new free text creates a genuinely new ambiguity that could alter the architecture. This should be exceptional, bounded and visible in telemetry.

### Stage 5 — Plan review before generation
Show a concise editable summary:
- inferred business type and confidence;
- audience and customer problem;
- primary goal/CTA and customer journey;
- recommended sitemap and section order;
- required functionality/integrations;
- selected design direction and rationale;
- assumptions, missing facts and placeholders;
- estimated API usage/cost status and credit impact under existing policy.

Let users correct type, goal, pages, CTA, style and answers. Do not start expensive generation until the plan is confirmed.

Page candidates may include Home, About/Story, Services/Offerings, Product catalogue/detail, Menu, Portfolio/Projects/Case studies, Courses/Programs, FAQ, verified Testimonials/Reviews, Gallery, Contact/Location, booking/enquiry landing pages, and required legal/privacy pages. Do not force every page on every business or create empty/duplicate pages.

### Stage 6 — Design and generation
Use existing BrandScalers design library, CSS tokens, presets, manifest and renderers. Do not replace the library with a generic theme system.

Vary actual composition, section order, visual hierarchy, typography, spacing, image treatment and approved component variants—not only accent colours. Use stable page/section IDs and the existing structured document schema. Resolve assets through existing asset resolver or approved user/stock assets with source metadata. Use reference sites only for high-level inspiration; do not copy their text or assets.

Every page needs meaningful metadata, internal links, clear primary CTA and sensible headings. Only use allowlisted component types and design tokens. Reject arbitrary CSS, raw HTML, scripts, event handlers, unsafe URLs, unsupported actions and unknown component names. Draft placeholders must be marked and not silently published.

### Stage 7 — Preview and editor
Retain and extend the existing editor/preview. Support desktop/tablet/mobile at 1440, 768, 390 and 360px. The selected preview width must actually constrain the preview frame; changing a label alone is insufficient.

Support real internal navigation and section-level editing of supported text, visibility, order if implemented, image and approved style tokens. Preserve stable IDs and untouched sections. Local deterministic edits must not call AI. AI edits must patch only the requested section/page, validate the patch and show the resulting preview. Do not regenerate the whole site for a local change. Keep undo/version history where available.

On edit failure, preserve the previous valid version and charge zero credits. Follow existing billing: successful AI edit = 5 credits/change unless the verified production contract says otherwise; failed AI edit = 0. Local non-AI edits must not accidentally incur AI charges.

### Stage 8 — QA and publish readiness
Run deterministic QA on the exact document/version proposed for publishing.

Minimum checks:
- schema/version, allowlisted components/actions/properties;
- required pages and sensible navigation;
- internal link targets, primary CTA and forms;
- no placeholders/demo content on production publish unless explicitly approved;
- no invented proof, credentials, pricing or business claims;
- one primary H1 per page and sensible heading hierarchy;
- image source metadata and alt text;
- responsive overflow at all four widths;
- keyboard use, focus visibility, labels, accessible names and contrast where automatable;
- form validation and truthful success/error state;
- console errors and failed assets;
- broken links and unsupported external actions;
- title/description and basic SEO;
- unsafe URLs, injected markup/scripts, secrets and unsafe embeds;
- usage ledger and budget correctness;
- real integration status and publish prerequisites.

Classify issues as Blocker, Warning or Info. Critical security/schema/data-leakage/core-journey/unverified-claim failures block publishing. Warnings are shown to the user with remediation. Never show a passed check that did not run. Rerun affected checks after edits.

### Stage 9 — Existing publish workflow
Before implementation, locate and document actual contracts for the production `websites` records (draft/published/version/history/edit/domain state), Supabase Storage including `website-stock`, existing publishing/BrandScalers URL/custom-domain handling, enquiries, analytics, auth/tenant isolation and credit accounting. Do not guess table columns or make direct production schema changes based on this spec.

Publish sequence:
1. User requests publish.
2. Run QA on the exact candidate version.
3. Block on critical issues and explain warnings.
4. Ask for explicit confirmation.
5. Recheck ownership, permissions, business balance and document version server-side.
6. Save an immutable/versioned snapshot using existing mechanisms.
7. Invoke existing publication adapter.
8. Report success only after the real publishing service confirms it.
9. Show actual URL/domain and status.
10. On failure, preserve last published version and draft, then show a recoverable error.

Custom domains, DNS/SSL, checkout/payments, booking, email, analytics and Search Console are real only if existing production integration verifies them. Otherwise display “not connected” or “demo only”; never fake success.

### Stage 10 — Returning user
Resume drafts and existing profiles without repeating intake. Preserve saved answers, versions, live published site, enquiries, analytics and domains. Editing a live site must create/review a draft and not silently overwrite live content. Reopening the editor must not duplicate a site or deduct credits. Respect existing deletion, retention and tenant-isolation rules.

## 6. Cost-efficient model-call policy

**Adaptive questions must not mean one model call per question.**

Expected normal flow:
- Initial details: zero calls.
- Local inference: zero calls.
- Adaptive question display/answers: zero calls.
- Ambiguous inference: zero or one short fallback call.
- Plan generation: one bounded structured-output call where practical.
- Website content: batch related fields where quality, context size and validation permit.
- Local edits: zero calls.
- AI edit: one targeted call.
- QA: deterministic code, zero calls by default.
- Publish: zero calls.

Separate planning/content calls if measurements show better total cost, quality or reliability. Never repeat full generation to change one section. Limit retries; no unbounded agent loops.

### API-cost telemetry
Record model/provider, purpose, input/output tokens, actual or estimated USD cost, latency, retries, outcome, cache hit/miss and correlation ID. Do not log secrets or unnecessary business/personal content. Clearly mark estimated values where exact usage is unavailable.

Measure:
- calls per successful build by stage;
- input/output tokens and API cost;
- failure/retry rate;
- time to first preview and total generation time;
- business credits charged;
- percent of intakes completed without AI fallback;
- percent of users correcting inference;
- schema repair frequency and targeted-edit success rate.

**Acceptance target:** a clearly described ordinary business completes adaptive questions with zero Google/Gemini calls; low-confidence cases make at most one classification fallback call. Keep limits configurable and tested.

### Keep provider dollars separate from business credits
Provider API cost (USD) is a usage metric; business credits are the existing customer-facing billing unit. Never assume 250 credits equals a particular dollar amount.

Preserve the existing production contract unless the owner explicitly approves a change:
- 250 credits per successful website build;
- 5 credits per successful AI edit/change;
- failed builds and failed AI edits cost 0;
- 1,000 credits for new accounts if still the verified current entitlement;
- manual refill and current balance workflow remain unchanged.

Inspect the real production credit service before coding. If it differs, document the discrepancy; do not silently rewrite billing.

Enforce preflight budget, server-side balance checks, idempotency keys, transactional deduction on the existing definition of success, duplicate/concurrent request protection and safe rollback/refund if a reservation was made. Ledger entries should connect operation ID, business/tenant, model, tokens, cost estimate, credits, status and timestamp. Browser-supplied balance/cost is never authoritative.

## 7. Data contracts

Extend existing Zod schemas instead of creating duplicate incompatible schemas. Preserve backward compatibility with existing saved documents; version schema changes.

`BusinessInference`: schema version, archetypes, confidence, goal, journey, candidate pages, required capabilities, missing information, contradictions, question IDs, inference source and rules version.

`AdaptiveQuestion`: stable ID, label, explanation, type/options, conditions, required/optional, default/skip policy, affected plan fields, validation and `aiCallPolicy` defaulting to `never`.

`ConfirmedBusinessProfile`: normalized identity/category, description/offers, user-confirmed archetype, audience, location/service area when relevant, goal/CTA/contact channel, approved proof/assets, answers, unknowns/assumptions and required consent flags.

`SitePlan`: versioned sitemap, page objectives, audience, section order, component choices, CTA strategy, design family/preset/token IDs, asset needs, integration requirements/status, factual content requirements, missing-data warnings and budget estimate.

`WebsiteDocument`: continue the existing versioned document; stable page/section IDs; allowlisted components and structured props only. It must not store model-generated executable source as the canonical site.

`UsageRecord`: idempotency/operation ID, business/tenant reference according to existing conventions, operation type, provider/model, tokens, cost basis and amount, credits reserved/charged/refunded, status, safe reason code, timestamp and correlation ID. Avoid unnecessary personal data.

## 8. Security, privacy and reliability

- Google/Gemini calls remain server-side only; validate every inbound request and model response.
- Enforce existing authentication, authorization, ownership and tenant isolation.
- Do not trust browser-supplied IDs, balances, costs, publish permission, URLs or operation status.
- Apply request size limits, rate limits, timeouts, bounded retries and abuse protection to expensive endpoints.
- Treat business descriptions, uploaded files, reference-site text and model output as untrusted; prompt injection must not override policy or enable code execution.
- Allowlist URL protocols/actions; reject `javascript:`, unsafe data URLs, unknown embeds and arbitrary scripts.
- Use React text rendering rather than raw HTML wherever possible; validate/sanitize any allowed URL.
- Never store API keys in website documents, exports, client logs or published HTML.
- Do not send patient, payment, authentication or unnecessary personal data to the model.
- Use least privilege for database/storage; retain existing server-side data access.
- A failure must preserve the last valid draft and published version.
- Never retry non-idempotent credit/publish operations without checking operation state.

## 9. Test requirements

Add to the existing suite; do not replace it.

### Inference/question tests
- Clinic does not see product-sale questions.
- Portfolio asks about work and CTA, not checkout.
- Restaurant asks about menu and visit/reservation/order only as relevant.
- Retail distinguishes catalogue, store, WhatsApp and online checkout.
- Service distinguishes booking link, quote, phone, WhatsApp and enquiry.
- “Not sure” is inferred where possible.
- Conflicting signals trigger safe clarification/fallback.
- High-confidence local inference performs zero network/model calls.
- Selecting any ordinary answer does not call the Google/Gemini model.
- Unknown model question IDs are rejected.
- User can override inference; subsequent flow follows override.
- Back navigation preserves answers.

### Provider/budget tests
- No Google/Gemini API key still supports deterministic fixtures.
- API key is absent from browser bundles and responses.
- Structured outputs are validated with Zod.
- Invalid outputs, timeout, rate limit and provider failures fall back safely.
- Retries/calls are bounded.
- Usage telemetry contains no secrets or unnecessary raw payloads.
- Budget blocks requests before dispatch.
- Failed build/edit charges zero.
- Duplicate/concurrent requests cannot double-charge.
- API dollars and customer credits remain separate.

### Website/editor/QA/publish tests
- Archetypes get appropriate page plans and CTA strategies.
- Composition is business-aware, not random or the same template with different text.
- About/testimonial/FAQ content is factually safe.
- Raw HTML, arbitrary CSS, unsafe URLs and unsupported components are rejected.
- Real internal navigation and CTA actions work.
- Preview width actually changes the rendered viewport.
- Editing one section preserves all unrelated section data.
- Failed edit preserves prior document and charges zero.
- Local edits make no model calls.
- Critical QA issues block publishing.
- Mock publish is clearly labelled.
- Real publish is confirmed only by the actual adapter.
- Publish failure preserves last published version.
- Existing auth, credits, domains, enquiries, analytics, storage and history regressions are checked.

Run the actual scripts defined in the repository, at minimum where available:
- `npm test`
- `npx tsc --noEmit`
- `npm run build`
- existing API/HTTP smoke tests
- browser/E2E tests for the complete happy path and conditional archetypes.

Record exact commands and observed outcomes. Mark unrun tests as “not run” and explain why.

## 10. Implementation sequence

**Phase 1 — Audit:** inspect source/docs; run baseline tests/type-check/build/smoke tests; map requirements to files; record current failures and real production integration contracts.

**Phase 2 — Inference/questions:** add pure deterministic inference and question catalogue; wire into existing UI; test archetypes and prove normal flow makes no model calls.

**Phase 3 — Google/Gemini provider hardening:** retain the current provider and model configuration; add/verify structured outputs, validation, telemetry, timeouts, bounded retries and fallback; keep fixture mode. Do not migrate providers.

**Phase 4 — Plan/composition:** connect inference to editable sitemap, journey, sections, design presets and BrandScalers renderer; add regression tests.

**Phase 5 — Editing/QA/accounting:** ensure targeted patches and zero-call local edits; preserve credit contract/idempotency; fix responsive preview and accessibility defects; expand QA.

**Phase 6 — Production publishing:** integrate only through verified existing adapters, auth and feature flags; preserve versions, domains, enquiries, analytics and billing. If unavailable, keep clearly unconnected rather than faking it.

**Phase 7 — Independent verification:** test all branches, model call counts, cost telemetry, credits and failure recovery; update reports with evidence and known limitations.

## 11. Definition of done

The phase is done only when:
1. Changes are inside the existing repository/application; no parallel project exists.
2. The intake starts with business name, category and offer description.
3. Common cases use deterministic inference with no model call.
4. Follow-up questions are relevant; unrelated category questions are not shown.
5. “Recommend for me” is business-aware and editable.
6. Users can correct inference and review the plan before generation.
7. Google/Gemini calls are server-side, structured, validated, bounded and observable.
8. Adaptive question display/answer selection makes no model calls.
9. Generation uses existing schemas, BrandScalers assets/tokens/manifest and trusted renderer.
10. Targeted edits do not regenerate unrelated sections.
11. API cost is tracked separately from business credits.
12. Existing billing and production workflows are preserved.
13. QA is honest, evidence-based and blocks critical publish defects.
14. Publishing uses a verified existing adapter and preserves the prior live version on failure.
15. Existing and new tests, type-check and build pass—or failures are explicitly documented.
16. Every mock is clearly identified; no false production-success claims exist.
17. Handoff lists exact changed files, test evidence, measured API call counts/cost, risks and next steps.

## 12. Required completion report

- **Implemented:** requirements completed.
- **Files changed:** exact paths and purpose.
- **User flow:** tested steps and archetypes.
- **AI usage:** Google/Gemini model configuration, calls by stage, tokens, API-cost basis and fallback.
- **Business credits:** verified success/failure/edit behavior.
- **Tests run:** exact commands and observed results.
- **Not implemented/mocked:** explicit list.
- **Known defects/risks:** severity and evidence.
- **Production integration:** verified adapters and anything unconnected.
- **Next action:** smallest concrete remaining task.

Never say “complete,” “tested,” “production-ready,” or “deployed” without evidence for that exact claim.
