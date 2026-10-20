# Website Studio 2.0 (Presentation-Ready Vertical Slice)

An intelligent, business-aware website-generation engine and component-composition pipeline built on validated structured data, strict schema boundaries, and the BrandScalers design library visual tokens.

---

## 1. Quick Start

### Prerequisites
- Node.js `v20+` (verified on Node `v24.20.0` and npm `11.19.0`)
- Optional: `GEMINI_API_KEY` for live AI generation with `gemini-3` and `gemini-3.1-flash-lite`. (If omitted, the engine runs completely offline with verified benchmark fixtures).

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional)
cp .env.example .env

# 3. Run automated tests
npm test

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the generator and live preview.

---

## 2. Architecture & Design Principles

1. **AI Plans & Selects, Deterministic Code Validates & Renders:**  
   The model never writes arbitrary React or HTML code. It outputs structured JSON conforming to strict Zod schemas (`BusinessProfile`, `SitePlan`, `WebsiteDocument`).
2. **Strict 250-Credit Guard:**  
   Every AI build tracks token consumption against a 250-credit ceiling. Generations exceeding the budget are blocked before API dispatch. Failed builds are charged 0 credits.
3. **Reusable Design Tokens:**  
   Tokens compile into CSS custom properties and data attributes on a scoped `.bs` container, preserving 100% visual fidelity to the BrandScalers library with zero CSS leakage into builder UI.
4. **Isolated from Production Studio:**  
   Zero mutation to existing databases or production workflows. Documented adapter ready for Studio integration behind a feature flag.

---

## 3. Supported Core Components (12 Manifest Pieces)

- `site-header`
- `hero-split`
- `hero-centered`
- `service-grid`
- `feature-row`
- `testimonial-list`
- `faq-accordion`
- `gallery-grid`
- `call-to-action`
- `contact-form`
- `location-hours`
- `site-footer`

---

## 4. Future Studio Integration Contract

The standalone engine exposes a clean boundary interface (`src/engine/export/`):
- `createBusinessProfile(input)`
- `planWebsite(profile)`
- `generateWebsite(plan, options)`
- `validateWebsiteDocument(document)`
- `renderWebsite(document)`
- `editWebsiteSection(document, sectionId, patch)`
- `runWebsiteQA(document)`
- `exportWebsiteDocument(document)`

Schema version: `1.0`. All payloads are JSON serializable.

---

## 5. Reviewer Presentation Walkthrough

Follow these steps to demonstrate all capabilities during review:

1. **Explore Benchmark Archetypes:**
   - Click `🏥 Dental Clinic` to inspect trust-focused clinical layout with `Warm clinic` preset and Figtree typography.
   - Click `🏺 Concept Shop` to view high-aesthetic editorial layout with `Quiet luxury` preset and Cormorant Garamond typography.
   - Click `💻 Tech Agency` to see high-impact dark theme layout with `Dark premium` preset.
2. **Test Responsive Viewports:**
   - In the top toolbar, switch between `🖥️ Desktop`, `📱 768px (Tablet)`, `📱 390px (Mobile)`, and `📱 360px (Compact Mobile)`. Notice clean wrapping without horizontal overflow.
3. **Multi-Page Navigation:**
   - Use the subbar or the site header to navigate between `/home`, `/about`, `/services`, and `/contact`. Notice active indicators and consistent tokens.
4. **Interactive Contact Form & CTAs:**
   - Navigate to `/contact`, enter test data, and submit. Observe truthful demo feedback ("No emails were dispatched. Demo Mode").
   - Click any CTA button to observe action dispatching toast.
5. **In-Place Section Editing:**
   - Click `✏️ Edit Section` in the toolbar. Select a section, change its headline or lead copy, toggle its card style (`flat`, `outlined`, `raised`, `tinted`), or toggle visibility. Notice the preview updates live while other sections remain strictly bitwise identical (0 credits charged).
6. **Deterministic QA Engine:**
   - Click `🔍 Run QA` in the toolbar. Review the 10 automated checks (schema, single H1, broken links, budget cap, demo disclosure) and verify the 100% score and GO verdict.
7. **Generate New Site:**
   - Click `✨ New AI Build`. Enter a custom brief and click `🚀 Generate Website` to watch the site plan and sections generate within the 250-credit guard.
8. **Export Integration Bundle:**
   - Click `📦 Export` to inspect the portable JSON contract ready for production Website Studio adoption.
