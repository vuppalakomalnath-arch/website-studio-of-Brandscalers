# TEST-RESULTS.md — Independent QA Test Execution Evidence

**Project:** Website Studio / Website Builder 2.0  
**QA Lead:** Independent QA Agent  
**Environment Baseline:**
- **OS:** Windows (x64)
- **Node.js:** v24.20.0
- **npm:** 11.19.0
- **Test Runner:** Vitest v3.2.7
- **Date:** October 2026 (Milestone 2 Re-Test)

---

## 1. Test Harness Architecture & Execution Matrix

All test results recorded here reflect actual terminal command outputs, assertion results, and live browser CDP evidence.

### Test Matrix Structure:
1. **Suite 1: Static & Schema Integrity (`schema.test.ts`)**
   - Rejection of unregistered component types, unsafe URLs (`javascript:`, data URIs), unvalidated actions.
   - Positive validation of compliant `WebsiteDocument` and `BusinessProfile`.
2. **Suite 2: Credit Budget Ledger (`budget.test.ts`)**
   - Block requests projecting >250 credits prior to model dispatch.
   - Transactional safety: Ensure 0 credits debited when simulated generation fails.
3. **Suite 3: Trusted Component Renderer (`renderer.test.ts`)**
   - All 12 manifest components mount without error with minimal and full props.
   - Accessible names, exactly one `<h1>` per page.
4. **Suite 4: Live Gemini Integration (`gemini.test.ts`)**
   - Real model calls to `gemini-3.5-flash-lite` with active `GEMINI_API_KEY`.
   - Structured JSON schema validation and token/credit metering.
5. **Suite 5: Functional Navigation & Interactions (E2E / Browser Smoke)**
   - Multi-page navigation: Switching Home -> About -> Services -> Contact.
   - Primary CTA dispatches allowed actions.
   - Contact form validates required inputs and displays truthful demo feedback.
6. **Suite 6: In-Place Section Editing (`editor.test.ts`)**
   - Modifying Section $k$ updates Section $k$ props while leaving neighbor sections bitwise identical; 0 credits debited.
7. **Suite 7: Security & Secret Sanitization (`env.test.ts`)**
   - Zero exposure of production database keys or unisolated client secrets.
8. **Suite 8: Headless Browser CDP Suite (`live-browser-test.js`)**
   - Live browser evaluation of hydration, viewports (1440px, 768px, 390px, 360px), form submission, and in-app QA engine.

---

## 2. Test Execution Log (Post-Re-Test)

| Test Run ID | Target Suite / Check | Command Executed | Exit Code | Result | Evidence / Log Excerpt |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TR-ENV-01** | Node.js Runtime Check | `node -v` | 0 | **PASS** | `v24.20.0` verified. |
| **TR-ENV-02** | npm Runtime Check | `npm -v` | 0 | **PASS** | `11.19.0` verified. |
| **TR-UNIT-ALL** | Automated Unit Test Suite | `npm test` | 0 | **PASS** | 26 tests passed across 8 test files in 4.87s. |
| **TR-GEMINI-LIVE** | Live Gemini Model Integration | `npx vitest run tests/gemini.test.ts` | 0 | **PASS** | `gemini-3.5-flash-lite` generated structured plan via active API key in 3.2s. |
| **TR-HTTP-01** | Application Shell HTTP Smoke | `node tests/smoke.js` | 0 | **PASS** | `GET /` returned 200 OK; contains builder header and `.bs` styling container. |
| **TR-HTTP-02** | Brief Planning Route | `node tests/smoke.js` | 0 | **PASS** | `POST /api/plan` returned 200 OK; generated 4-page site plan with primary CTA. |
| **TR-HTTP-03** | Live Website Generation Route | `node tests/smoke.js` | 0 | **PASS** | `POST /api/generate` returned 200 OK; actual credits: **168 / 250 cap**; `isMocked: false`. |
| **TR-RESP-01** | Real Window Mobile Navigation | Headless Edge CDP | 0 | **PASS** | On viewport <= 768px, desktop nav collapses and mobile toggle appears. |
| **TR-RESP-SIM** | In-App Desktop Simulated Frame | Headless Edge CDP | — | **DEFECT-01B (P2)** | Clicking `📱 390` in toolbar on a desktop monitor does not trigger `@media (max-width: 768px)` because outer window is 1440px. Header CTA button clipped by `overflow-x: hidden`. |
| **TR-RESP-02** | 360px Card Grid Layout | Headless Edge CDP | 0 | **PASS** | `minmax(min(100%, 280px), 1fr))` fits within 328px content width at 360px viewport; card clipping eliminated. |
| **TR-DIV-01** | Brief Hero Diversity | Unit Inspection | 0 | **PASS** | `creative`/`modern` selects `hero-centered`; `local-service`/`editorial` selects `hero-split`. |

---

## 3. Detailed Command Outputs

### TR-UNIT-ALL: Full Vitest Execution (26 Passed)
```
> website-builder-2.0@0.1.0 test
> vitest run

 RUN  v3.2.7 E:/website-builder-2.0

 ✓ tests/env.test.ts (2 tests) 5ms
 ✓ tests/budget.test.ts (3 tests) 9ms
 ✓ tests/editor.test.ts (3 tests) 14ms
 ✓ tests/qa.test.ts (3 tests) 17ms
 ✓ tests/schema.test.ts (6 tests) 22ms
 ✓ tests/generation.test.ts (3 tests) 29ms
 ✓ tests/renderer.test.ts (4 tests) 74ms
 ✓ tests/gemini.test.ts (2 tests) 3734ms

 Test Files  8 passed (8)
      Tests  26 passed (26)
   Duration  4.87s
```

### TR-HTTP-03: Live Gemini Generation Output
```
=== STARTING HTTP SMOKE TESTS ===

Test 1: GET / (Main Builder Application UI) -> Status: 200 OK
Test 2: POST /api/plan (Brief planning route) -> Status: 200 OK
Test 3: POST /api/generate (Full website generation route)
Status: 200
Document ID: proj-mvgj4zqv
Pages generated: home, about, services, contact
Actual credits charged: 168 / 250 credits
Is Mocked/Demo Mode: false
✓ POST /api/generate passed with valid schema and budget safety.

=== ALL HTTP SMOKE TESTS PASSED! ===
```
