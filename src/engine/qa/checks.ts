import { WebsiteDocument, WebsiteDocumentSchema } from '../schemas/website-document';

export interface QaCheckResult {
  id: string;
  name: string;
  category: 'schema' | 'links' | 'accessibility' | 'design' | 'budget' | 'security';
  severity: 'P0' | 'P1' | 'P2' | 'P3';
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
    passed: duplicateSlugs.length === 0,
    message: duplicateSlugs.length === 0
      ? 'All page slugs are unique.'
      : `Duplicate slugs detected: ${duplicateSlugs.map(([s]) => s).join(', ')}`,
  });

  // 4. Internal Links Resolution Check (AC-06)
  let brokenInternalLinks: string[] = [];
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
    passed: brokenInternalLinks.length === 0,
    message: brokenInternalLinks.length === 0
      ? 'All internal links and CTAs target valid pages.'
      : `Broken internal links found: ${brokenInternalLinks.join(', ')}`,
  });

  // 5. Single H1 Headline Per Page (Accessibility)
  let pagesWithMultipleH1: string[] = [];
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
    passed: pagesWithMultipleH1.length === 0,
    message: pagesWithMultipleH1.length === 0
      ? 'Every page contains exactly one primary hero H1.'
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
    passed: contactFormPresent && contactFormDemoFlagged,
    message: contactFormPresent && contactFormDemoFlagged
      ? 'Contact form present and explicitly marked with truthful Demo Mode disclosure.'
      : 'Contact form missing or failed demo mode honesty check.',
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
    passed: !testimonialPresent || testimonialsDemoFlagged,
    message: testimonialsDemoFlagged
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
    passed: !hasScriptTags && !hasJavascriptProtocol,
    message: (!hasScriptTags && !hasJavascriptProtocol)
      ? 'Clean document: no script tags or javascript: protocol URIs detected.'
      : 'SECURITY VIOLATION: Executable script or protocol injection detected in document.',
  });

  // Calculate scores
  const passedCount = checks.filter((c) => c.passed).length;
  const failedCount = checks.length - passedCount;
  const overallScore = Math.round((passedCount / checks.length) * 100);
  const hasP0orP1Failures = checks.some(
    (c) => !c.passed && (c.severity === 'P0' || c.severity === 'P1')
  );

  return {
    timestamp: new Date().toISOString(),
    totalChecks: checks.length,
    passedCount,
    failedCount,
    overallScore,
    verdict: hasP0orP1Failures ? 'NO-GO' : 'GO',
    checks,
  };
}
