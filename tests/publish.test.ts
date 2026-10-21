import { describe, it, expect } from 'vitest';
import { publishWebsiteDocument } from '../src/engine/export/publish-adapter';
import clinicFixture from '../src/fixtures/demo-website-clinic.json';
import { WebsiteDocument } from '../src/engine/schemas/website-document';

describe('Suite 8: Stage 9 Publishing Adapter & Truthful Demo Mode', () => {
  const doc = clinicFixture as unknown as WebsiteDocument;

  it('publishes valid candidate document and marks demo mode disclosure clearly', () => {
    const result = publishWebsiteDocument(doc, null);

    expect(result.success).toBe(true);
    expect(result.isDemoMode).toBe(true);
    expect(result.disclosure).toContain('DEMO MODE');
    expect(result.bundle).toBeDefined();
    expect(result.bundle?.schemaVersion).toBe('1.0');
    expect(result.qaReport.canPublish).toBe(true);
    expect(result.qaReport.blockerCount).toBe(0);
  });

  it('blocks publication when QA blocker exists and retains previous version', () => {
    const invalidDoc: WebsiteDocument = {
      ...doc,
      generation: {
        ...doc.generation,
        actualCredits: 500, // triggers QA-BUDGET-01 Blocker
      },
    };

    const previousDoc: WebsiteDocument = { ...doc };

    const result = publishWebsiteDocument(invalidDoc, previousDoc);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot publish');
    expect(result.qaReport.blockerCount).toBeGreaterThanOrEqual(1);
    expect(result.retainedPreviousVersion).toBe(previousDoc);
  });
});
