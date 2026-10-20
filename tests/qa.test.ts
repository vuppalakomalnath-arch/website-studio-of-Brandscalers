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
    expect(report.verdict).toBe('NO-GO');
  });
});
