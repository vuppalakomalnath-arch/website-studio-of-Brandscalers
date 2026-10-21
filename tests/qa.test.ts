import { describe, it, expect } from 'vitest';
import { runWebsiteQa } from '../src/engine/qa/checks';
import clinicFixture from '../src/fixtures/demo-website-clinic.json';
import { WebsiteDocument } from '../src/engine/schemas/website-document';

describe('Suite 6: Deterministic QA Runner Engine', () => {
  const doc = clinicFixture as unknown as WebsiteDocument;

  it('runs all QA checks on the benchmark clinic fixture and returns a GO verdict', () => {
    const report = runWebsiteQa(doc);

    expect(report.totalChecks).toBeGreaterThanOrEqual(10);
    expect(report.failedCount).toBe(0);
    expect(report.overallScore).toBe(100);
    expect(report.verdict).toBe('GO');
  });

  it('flags a broken internal link as a P1 failure', () => {
    const brokenDoc: WebsiteDocument = {
      ...doc,
      pages: doc.pages.map((p) => {
        if (p.slug === 'home') {
          return {
            ...p,
            sections: p.sections.map((s) => {
              if (s.type === 'site-header') {
                return {
                  ...s,
                  props: {
                    ...(s.props as any),
                    navLinks: [{ label: 'Nonexistent', slug: 'missing-page-404' }],
                  },
                };
              }
              return s;
            }),
          };
        }
        return p;
      }),
    };

    const report = runWebsiteQa(brokenDoc);
    const navCheck = report.checks.find((c) => c.id === 'QA-NAV-03');
    expect(navCheck?.passed).toBe(false);
    expect(report.verdict).toBe('NO-GO');
  });

  it('flags an over-budget build (>250 credits) as a P0 blocker', () => {
    const overBudgetDoc: WebsiteDocument = {
      ...doc,
      generation: {
        ...doc.generation,
        actualCredits: 350,
      },
    };

    const report = runWebsiteQa(overBudgetDoc);
    const budgetCheck = report.checks.find((c) => c.id === 'QA-BUDGET-01');
    expect(budgetCheck?.passed).toBe(false);
    expect(budgetCheck?.classification).toBe('Blocker');
    expect(report.blockerCount).toBeGreaterThanOrEqual(1);
    expect(report.canPublish).toBe(false);
    expect(report.verdict).toBe('NO-GO');
  });

  it('allows publishing when only warnings or info notes are present', () => {
    // Introduce a warning: duplicate hero section on home page triggers QA-A11Y-01 Warning
    const docWithWarning: WebsiteDocument = {
      ...doc,
      pages: doc.pages.map((p) => {
        if (p.slug === 'home') {
          const hero = p.sections.find((s) => s.type === 'hero-split');
          return {
            ...p,
            sections: hero ? [...p.sections, { ...hero, id: 'extra-hero' }] : p.sections,
          };
        }
        return p;
      }),
    };

    const report = runWebsiteQa(docWithWarning);
    const a11yCheck = report.checks.find((c) => c.id === 'QA-A11Y-01');
    expect(a11yCheck?.passed).toBe(false);
    expect(a11yCheck?.classification).toBe('Warning');
    expect(report.warningCount).toBe(1);
    expect(report.blockerCount).toBe(0);
    expect(report.canPublish).toBe(true);
  });
});
