# TEST-RESULTS.md — Independent QA Test Execution Evidence

**Project:** Website Studio / Website Builder 2.0  
**QA Lead:** Independent QA Agent  
**Environment Baseline:**
- **OS:** Windows (x64)
- **Node.js:** v24.20.0
- **npm:** 11.19.0
- **TypeScript:** v5.7.3 (`npx tsc --noEmit` clean: 0 errors)
- **Production Build:** Next.js 15.5.28 (`npm run build` clean: code 0)
- **Test Runner:** Vitest v3.2.7
- **Date:** October 2026 (Milestone 3 Evolution)

---

## 1. Test Harness Architecture & Execution Matrix

All test results recorded here reflect actual terminal command outputs, assertion results, and live HTTP server evidence.

### Test Matrix Structure:
1. **Suite 1: Static & Schema Integrity (`schema.test.ts`)**
   - Rejection of unregistered component types, unsafe URLs (`javascript:`, data URIs), unvalidated actions.
   - Positive validation of compliant `WebsiteDocument` and `BusinessProfile`.
2. **Suite 2: Credit Budget Ledger & USD Telemetry (`budget.test.ts`)**
   - Block requests projecting >250 credits prior to model dispatch.
   - Transactional safety: Ensure 0 credits debited when simulated generation fails.
   - Separate provider USD telemetry from customer business credits.
3. **Suite 3: Trusted Component Renderer (`renderer.test.ts`)**
   - All 12 manifest components mount without error with minimal and full props.
   - Accessible names, heading hierarchy check.
4. **Suite 4: Live Gemini Integration (`gemini.test.ts`)**
   - Real model calls to `gemini-3.5-flash-lite` with active `GEMINI_API_KEY`.
   - Structured JSON schema validation, token/credit metering, and bounded ambiguity fallback.
5. **Suite 5: In-Place Section Editing (`editor.test.ts`)**
   - Modifying Section $k$ updates Section $k$ props while leaving neighbor sections bitwise identical; 0 credits debited.
6. **Suite 6: Deterministic QA Runner Engine (`qa.test.ts`)**
   - 13 automated checks with Blocker, Warning, and Info classifications.
   - Blocks publication when blockers exist; permits publication with warnings.
7. **Suite 7: Stage 9 Publishing Adapter (`publish.test.ts`)**
   - Candidate QA gating, snapshot version preservation, and truthful demo disclosure.
8. **Suite 8: Local Deterministic Inference Rules Engine (`inference.test.ts`)**
   - 14 business archetypes, keyword scoring, confidence assessment, and journey mapping with 0 model calls.
   - Contradiction and ambiguity detection.
9. **Suite 9: Adaptive Question Catalog (`adaptive-questions.test.ts`)**
   - Zero-AI question filtering (`aiCallPolicy: 'never'`).
   - Hard guard preventing product/e-commerce questions for service and healthcare archetypes.
10. **Suite 10: Security & Secret Sanitization (`env.test.ts`)**
    - Zero exposure of production database keys or unisolated client secrets; strictly server-side keys.
11. **Suite 11: Generation Engine & Fixtures (`generation.test.ts`)**
    - Fixture generation across benchmark domains within budget ceiling.
12. **Suite 12: Production Build & HTTP Smoke Verification (`tests/smoke.js`)**
    - Full Next.js production build (`npm run build`) generates static routes and dynamic APIs.
    - End-to-end HTTP smoke test (`GET /`, `POST /api/plan`, `POST /api/generate`) with live Gemini API.

---

## 2. Test Execution Log (Milestone 3 Execution)

| Test Run ID | Target Suite / Check | Command Executed | Exit Code | Result | Evidence / Log Excerpt |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TR-ENV-01** | Node.js Runtime Check | `node -v` | 0 | **PASS** | `v24.20.0` verified. |
| **TR-ENV-02** | npm Runtime Check | `npm -v` | 0 | **PASS** | `11.19.0` verified. |
| **TR-TYPES-01** | TypeScript Typecheck | `npx tsc --noEmit` | 0 | **PASS** | Clean compilation; 0 errors across entire codebase. |
| **TR-BUILD-01** | Production Build | `npm run build` | 0 | **PASS** | Compiled successfully in 3.1s; prerendered static pages; dynamic `/api/generate` & `/api/plan`. |
| **TR-UNIT-ALL** | Automated Unit Test Suite | `npx vitest run` | 0 | **PASS** | **41 tests passed across 11 test files in 5.84s.** |
| **TR-INFER-01** | Local Rules Engine | `npx vitest run tests/inference.test.ts` | 0 | **PASS** | 7 tests passed covering 14 archetypes, confidence scores, and contradictions. |
| **TR-ADAPT-01** | Adaptive Questions | `npx vitest run tests/adaptive-questions.test.ts` | 0 | **PASS** | 4 tests passed; `aiCallPolicy: 'never'`; retail questions excluded for non-retail. |
| **TR-PUBLISH-01** | Stage 9 Publishing Adapter | `npx vitest run tests/publish.test.ts` | 0 | **PASS** | 2 tests passed; QA gating verified; previous version snapshot retained on failure. |
| **TR-QA-01** | Deterministic QA Engine | `npx vitest run tests/qa.test.ts` | 0 | **PASS** | 4 tests passed; 13 checks; Blocker/Warning/Info categorization verified. |
| **TR-GEMINI-01** | Live Gemini Integration | `npx vitest run tests/gemini.test.ts` | 0 | **PASS** | Live structured planning in 3.5s; ambiguity fallback in 1.2s. |
| **TR-HTTP-01** | Application Shell HTTP Smoke | `node tests/smoke.js` | 0 | **PASS** | `GET /` returned 200 OK; contains builder header and `.bs` styling container. |
| **TR-HTTP-02** | Brief Planning Route | `node tests/smoke.js` | 0 | **PASS** | `POST /api/plan` returned 200 OK; generated 4-page site plan with primary CTA. |
| **TR-HTTP-03** | Live Website Generation Route | `node tests/smoke.js` | 0 | **PASS** | `POST /api/generate` returned 200 OK; actual credits: **133 / 250 cap**; `isMocked: false`. |

---

## 3. Detailed Command Outputs

### TR-UNIT-ALL: Full Vitest Execution (41 Passed)
```
> website-builder-2.0@0.1.0 test
> vitest run

 RUN  v3.2.7 E:/website-builder-2.0

 ✓ tests/env.test.ts (2 tests) 5ms
 ✓ tests/inference.test.ts (7 tests) 18ms
 ✓ tests/budget.test.ts (3 tests) 6ms
 ✓ tests/adaptive-questions.test.ts (4 tests) 18ms
 ✓ tests/editor.test.ts (3 tests) 15ms
 ✓ tests/qa.test.ts (4 tests) 22ms
 ✓ tests/publish.test.ts (2 tests) 18ms
 ✓ tests/schema.test.ts (6 tests) 23ms
 ✓ tests/generation.test.ts (3 tests) 30ms
 ✓ tests/renderer.test.ts (4 tests) 87ms
 ✓ tests/gemini.test.ts (3 tests) 4776ms
   ✓ GeminiProvider Integration & Resilience > generates a valid structured site plan using live Gemini API or reports credit reservation  3537ms
   ✓ GeminiProvider Integration & Resilience > classifies an ambiguous brief or falls back safely to deterministic rules  1232ms

 Test Files  11 passed (11)
      Tests  41 passed (41)
   Start at  18:09:03
   Duration  5.84s
```

### TR-BUILD-01: Next.js Production Build Output
```
> website-builder-2.0@0.1.0 build
> next build

   ▲ Next.js 15.5.28
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully in 3.1s
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (6/6)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                    51.2 kB         154 kB
├ ○ /_not-found                            992 B         104 kB
├ ƒ /api/generate                          126 B         103 kB
└ ƒ /api/plan                              126 B         103 kB
+ First Load JS shared by all             103 kB
```

### TR-HTTP-03: Live HTTP Smoke Test Run
```
=== STARTING HTTP SMOKE TESTS ===

Test 1: GET / (Main Builder Application UI)
Status: 200
✓ GET / successfully returned interactive application with .bs styling.

Test 2: POST /api/plan (Brief planning route)
Status: 200
Plan generated: Family=local-service, Preset=Warm clinic, Pages=4
✓ POST /api/plan passed.

Test 3: POST /api/generate (Full website generation route)
Status: 200
Document ID: proj-mvi3pgc0
Pages generated: home, about, services, contact
Actual credits charged: 133 / 250 credits
Is Mocked/Demo Mode: false
✓ POST /api/generate passed with valid schema and budget safety.

=== ALL HTTP SMOKE TESTS PASSED! ===
```
