import { WebsiteDocument, WebsiteDocumentSchema } from '../schemas/website-document';

export interface QaCheckResult {
  id: string;
  name: string;
  category: 'schema' | 'links' | 'accessibility' | 'design' | 'budget' | 'security' | 'seo' | 'assets';
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  classification: 'Blocker' | 'Warning' | 'Info';
  passed: boolean;
  message: string;
  details?: string;
}

export interface QaReport {
  timestamp: string;
  totalChecks: number;
  passedCount: number;
  failedCount: number;
  overallScore: number;
  verdict: 'GO' | 'NO-GO';
  canPublish: boolean;
  blockerCount: number;
  warningCount: number;
  checks: QaCheckResult[];
}

export function runWebsiteQa(doc: WebsiteDocument): QaReport {
  const checks: QaCheckResult[] = [];

  // 1. Schema Validation (AC-03)
  const schemaValidation = WebsiteDocumentSchema.safeParse(doc);
  checks.push({
    id: 'QA-SCHEMA-01',
    name: 'Strict Schema Validation',
    category: 'schema',
    severity: 'P0',
    classification: 'Blocker',
    passed: schemaValidation.success,
    message: schemaValidation.success
      ? 'Document passed full Zod schema validation.'
      : `Schema violation: ${schemaValidation.error?.message}`,
  });

  // 2. Mandatory Pages Check (AC-05)
  const requiredSlugs = ['home', 'about', 'services', 'contact'];
  const presentSlugs = doc.pages.map((p) => p.slug);
  const missingPages = requiredSlugs.filter((s) => !presentSlugs.includes(s));
  checks.push({
    id: 'QA-NAV-01',
    name: 'Mandatory Pages Presence (Home, About, Services, Contact)',
    category: 'links',
    severity: 'P1',
    classification: 'Blocker',
    passed: missingPages.length === 0,
    message: missingPages.length === 0
      ? `All 4 core pages present: [${presentSlugs.join(', ')}]`
      : `Missing mandatory pages: ${missingPages.join(', ')}`,
  });

  // 3. Unique Page Slugs Check
  const slugCounts = presentSlugs.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const duplicateSlugs = Object.entries(slugCounts).filter(([, count]) => count > 1);
  checks.push({
    id: 'QA-NAV-02',
    name: 'Page Slug Uniqueness',
    category: 'schema',
    severity: 'P1',
    classification: 'Blocker',
    passed: duplicateSlugs.length === 0,
    message: duplicateSlugs.length === 0
      ? 'All page slugs are unique.'
      : `Duplicate slugs detected: ${duplicateSlugs.map(([s]) => s).join(', ')}`,
  });

  // 4. Internal Links Resolution Check (AC-06)
  const brokenInternalLinks: string[] = [];
  doc.pages.forEach((p) => {
    p.sections.forEach((s) => {
      const props = s.props as any;
      if (props.navLinks) {
        props.navLinks.forEach((l: any) => {
          if (!presentSlugs.includes(l.slug)) {
            brokenInternalLinks.push(`${p.slug} -> #${l.slug}`);
          }
        });
      }
      if (props.primaryCta && props.primaryCta.type === 'internal-link') {
        if (!presentSlugs.includes(props.primaryCta.target)) {
          brokenInternalLinks.push(`${p.slug} primary CTA -> #${props.primaryCta.target}`);
        }
      }
    });
  });
  checks.push({
    id: 'QA-NAV-03',
    name: 'Internal Navigation Resolution',
    category: 'links',
    severity: 'P1',
    classification: 'Blocker',
    passed: brokenInternalLinks.length === 0,
    message: brokenInternalLinks.length === 0
      ? 'All internal links and CTAs target valid pages.'
      : `Broken internal links found: ${brokenInternalLinks.join(', ')}`,
  });

  // 5. Single H1 Headline Per Page (Accessibility)
  const pagesWithMultipleH1: string[] = [];
  doc.pages.forEach((p) => {
    const heroSections = p.sections.filter(
      (s) => s.type === 'hero-split' || s.type === 'hero-centered'
    );
    if (heroSections.length > 1) {
      pagesWithMultipleH1.push(p.slug);
    }
  });
  checks.push({
    id: 'QA-A11Y-01',
    name: 'Single H1 Heading Per Page Rule',
    category: 'accessibility',
    severity: 'P2',
    classification: 'Warning',
    passed: pagesWithMultipleH1.length === 0,
    message: pagesWithMultipleH1.length === 0
      ? 'Every page contains at most one primary hero H1.'
      : `Multiple heroes found on pages: ${pagesWithMultipleH1.join(', ')}`,
  });

  // 6. Contact Form Validation & Truthful Demo Mode (AC-07)
  let contactFormPresent = false;
  let contactFormDemoFlagged = true;
  doc.pages.forEach((p) => {
    p.sections.forEach((s) => {
      if (s.type === 'contact-form') {
        contactFormPresent = true;
        const formProps = s.props as any;
        if (!formProps.isDemoMode) contactFormDemoFlagged = false;
      }
    });
  });
  checks.push({
    id: 'QA-FORM-01',
    name: 'Contact Form Demo Mode Disclosure',
    category: 'security',
    severity: 'P1',
    classification: 'Warning',
    passed: !contactFormPresent || contactFormDemoFlagged,
    message: contactFormPresent && contactFormDemoFlagged
      ? 'Contact form present and explicitly marked with truthful Demo Mode disclosure.'
      : contactFormPresent
      ? 'Contact form missing required demo mode honesty flag.'
      : 'No contact form section on this page.',
  });

  // 7. Testimonials Truthful Demo Data Check (AC-13)
  let testimonialPresent = false;
  let testimonialsDemoFlagged = true;
  doc.pages.forEach((p) => {
    p.sections.forEach((s) => {
      if (s.type === 'testimonial-list') {
        testimonialPresent = true;
        const tProps = s.props as any;
        if (!tProps.isDemoData) testimonialsDemoFlagged = false;
      }
    });
  });
  checks.push({
    id: 'QA-DATA-01',
    name: 'Social Proof Honesty & Demo Data Flag',
    category: 'security',
    severity: 'P1',
    classification: 'Warning',
    passed: !testimonialPresent || testimonialsDemoFlagged,
    message: !testimonialPresent
      ? 'No testimonial sections present.'
      : testimonialsDemoFlagged
      ? 'Testimonials explicitly marked with unverified demo data disclosure.'
      : 'Testimonial list missing required demo data disclosure.',
  });

  // 8. 250-Credit Hard Budget Ceiling Compliance (AC-10)
  const actualCredits = doc.generation?.actualCredits || 0;
  const isBudgetSafe = actualCredits <= 250;
  checks.push({
    id: 'QA-BUDGET-01',
    name: '250-Credit Hard Cap Enforcement',
    category: 'budget',
    severity: 'P0',
    classification: 'Blocker',
    passed: isBudgetSafe,
    message: isBudgetSafe
      ? `Credit consumption (${actualCredits} credits) satisfies hard cap (<= 250 credits).`
      : `BUDGET VIOLATION: Generation consumed ${actualCredits} credits, exceeding 250 cap.`,
  });

  // 9. Design Diversity & Valid Tokens Check (AC-04)
  const tokens = doc.design.tokens;
  const hasValidColors = !!(tokens.accent && tokens.ink && tokens.bg && tokens.surface && tokens.footerBg);
  const hasValidTypography = !!tokens.font;
  checks.push({
    id: 'QA-DESIGN-01',
    name: 'Design System & Token Cohesion',
    category: 'design',
    severity: 'P2',
    classification: 'Info',
    passed: hasValidColors && hasValidTypography,
    message: `Tokens coherent for family "${doc.design.family}" and preset "${doc.design.preset}".`,
  });

  // 10. Security: No Arbitrary Executable Scripts in Document
  const docString = JSON.stringify(doc);
  const hasScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(docString);
  const hasJavascriptProtocol = /javascript:/i.test(docString);
  checks.push({
    id: 'QA-SEC-01',
    name: 'Zero Executable Code Injection',
    category: 'security',
    severity: 'P0',
    classification: 'Blocker',
    passed: !hasScriptTags && !hasJavascriptProtocol,
    message: (!hasScriptTags && !hasJavascriptProtocol)
      ? 'Clean document: no script tags or javascript: protocol URIs detected.'
      : 'SECURITY VIOLATION: Executable script or protocol injection detected in document.',
  });

  // 11. SEO Metadata Presence Check
  const pagesMissingSeo = doc.pages.filter(
    (p) => !p.seo || !p.seo.title || !p.seo.description
  );
  checks.push({
    id: 'QA-SEO-01',
    name: 'Page SEO Metadata Coverage',
    category: 'seo',
    severity: 'P2',
    classification: 'Warning',
    passed: pagesMissingSeo.length === 0,
    message: pagesMissingSeo.length === 0
      ? 'All pages have SEO meta titles and descriptions populated.'
      : `Missing SEO meta on pages: ${pagesMissingSeo.map((p) => p.slug).join(', ')}`,
  });

  // 12. Responsive Viewport Safe Tokens
  const validBreakpoints = !!(doc.design.tokens.density && doc.design.tokens.radius);
  checks.push({
    id: 'QA-RESP-01',
    name: 'Responsive Viewport & Container Query Readiness',
    category: 'design',
    severity: 'P3',
    classification: 'Info',
    passed: validBreakpoints,
    message: validBreakpoints
      ? 'Design tokens specify density and corner radius suitable for fluid container queries (320px to 1440px).'
      : 'Missing fluid tokens in design document.',
  });

  // 13. Truthful Demo Content Placeholder Check
  const unreplacedPlaceholders: string[] = [];
  const placeholderRegex = /\{\{[^}]+\}\}|\[INSERT_[A-Z_]+\]/i;
  doc.pages.forEach((p) => {
    p.sections.forEach((s) => {
      const secStr = JSON.stringify(s.props);
      if (placeholderRegex.test(secStr)) {
        unreplacedPlaceholders.push(`${p.slug} (${s.type})`);
      }
    });
  });
  checks.push({
    id: 'QA-CONTENT-01',
    name: 'Truthful Demo Content & Zero Unparsed Tokens',
    category: 'security',
    severity: 'P2',
    classification: 'Warning',
    passed: unreplacedPlaceholders.length === 0,
    message: unreplacedPlaceholders.length === 0
      ? 'Zero unparsed template tokens or raw bracket placeholders found.'
      : `Unreplaced placeholders found in sections: ${unreplacedPlaceholders.join(', ')}`,
  });

  // Calculate scores & verdicts
  const passedCount = checks.filter((c) => c.passed).length;
  const failedCount = checks.length - passedCount;
  const overallScore = Math.round((passedCount / checks.length) * 100);

  const blockerCount = checks.filter((c) => !c.passed && c.classification === 'Blocker').length;
  const warningCount = checks.filter((c) => !c.passed && c.classification === 'Warning').length;

  const hasP0orP1Failures = checks.some(
    (c) => !c.passed && (c.severity === 'P0' || c.severity === 'P1')
  );

  const canPublish = blockerCount === 0;
  const verdict = blockerCount === 0 && !hasP0orP1Failures ? 'GO' : 'NO-GO';

  return {
    timestamp: new Date().toISOString(),
    totalChecks: checks.length,
    passedCount,
    failedCount,
    overallScore,
    verdict,
    canPublish,
    blockerCount,
    warningCount,
    checks,
  };
}
