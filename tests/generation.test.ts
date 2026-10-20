import { describe, it, expect } from 'vitest';
import { generateWebsiteFromProfile } from '../src/engine/generation/pipeline';
import { FixtureProvider } from '../src/engine/generation/fixture-provider';
import { UsageLedger, OverBudgetError } from '../src/engine/generation/budget';
import clinicBusiness from '../src/fixtures/demo-business-clinic.json';
import { WebsiteDocumentSchema } from '../src/engine/schemas/website-document';

describe('Suite 4: AI Generation Pipeline & Budget Enforcement', () => {
  it('generates a complete, validated WebsiteDocument from a business brief', async () => {
    const provider = new FixtureProvider();
    const ledger = new UsageLedger(250);

    const result = await generateWebsiteFromProfile(clinicBusiness, provider, ledger);

    expect(result.document).toBeDefined();
    expect(result.plan).toBeDefined();
    expect(result.document.pages.length).toBeGreaterThanOrEqual(4);

    // Validate against full Zod schema
    const validation = WebsiteDocumentSchema.safeParse(result.document);
    expect(validation.success).toBe(true);

    // Verify credit cap was respected (<250 credits)
    expect(result.document.generation.actualCredits).toBeGreaterThan(0);
    expect(result.document.generation.actualCredits).toBeLessThanOrEqual(250);
  });

  it('blocks generation before call when requested budget exceeds 250 credits', async () => {
    // Construct a tight ledger with only 10 credits remaining
    const tightLedger = new UsageLedger(10);
    const provider = new FixtureProvider();

    await expect(
      generateWebsiteFromProfile(clinicBusiness, provider, tightLedger)
    ).rejects.toThrow(OverBudgetError);

    // Verify 0 credits committed
    expect(tightLedger.getCommittedCredits()).toBe(0);
  });

  it('generates distinct design families matching brief preferences', async () => {
    const editorialBrief = {
      ...clinicBusiness,
      businessName: 'Luxe Ceramics',
      businessType: 'Artisanal Concept Boutique',
      preferredDesignDirection: 'editorial',
    };

    const provider = new FixtureProvider();
    const result = await generateWebsiteFromProfile(editorialBrief, provider);
    expect(result.document.design.family).toBe('editorial');
    expect(result.document.design.tokens.buttons).toBe('outline');
  });
});
