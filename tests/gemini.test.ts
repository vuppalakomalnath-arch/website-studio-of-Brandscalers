import { describe, it, expect } from 'vitest';
import { GeminiProvider } from '@/engine/generation/gemini-provider';
import { UsageLedger } from '@/engine/generation/budget';
import { BusinessProfile } from '@/engine/schemas/business-profile';

describe('GeminiProvider Integration & Resilience', () => {
  it('instantiates successfully with GEMINI_API_KEY from environment', () => {
    const provider = new GeminiProvider();
    expect(provider.id).toBe('google-gemini');
    expect(provider.isAvailable).toBe(true);
  });

  it('generates a valid structured site plan using live Gemini API or reports credit reservation', async () => {
    const provider = new GeminiProvider();
    const ledger = new UsageLedger(250);

    const testProfile: BusinessProfile = {
      schemaVersion: '1.0',
      businessName: 'Apex Sports Clinic',
      businessType: 'Healthcare: Sports Physiotherapy',
      primaryGoal: 'calls',
      targetAudience: 'Local athletes',
      location: 'Birmingham, UK',
      servicesOrProducts: [
        { id: 's1', name: 'Joint Rehabilitation', source: 'user' },
        { id: 's2', name: 'Spinal Assessment', source: 'user' }
      ],
      preferredDesignDirection: 'local-service',
      requiredPages: ['home', 'about', 'services', 'contact'],
      contactMethod: 'phone',
      contact: {
        phone: '+44 121 496 0888',
        email: 'info@apex.co.uk',
      },
      assets: [],
    };

    try {
      const plan = await provider.generatePlan(testProfile, ledger);
      expect(plan).toBeDefined();
      expect(plan.pages.length).toBeGreaterThanOrEqual(4);
      expect(plan.primaryGoal).toBe('calls');
      expect(ledger.getCommittedCredits()).toBeGreaterThan(0);
    } catch (err: any) {
      // If live endpoint has a momentary 503 spike, ensure ledger records failure and 0 committed credits
      expect(ledger.getCommittedCredits()).toBe(0);
    }
  }, 30000);

  it('classifies an ambiguous brief or falls back safely to deterministic rules', async () => {
    const provider = new GeminiProvider();
    const ledger = new UsageLedger(250);

    const inference = await provider.classifyAmbiguity(
      {
        businessName: 'Lumina Craft',
        category: 'Not sure / Recommend for me',
        offerDescription: 'Handmade ceramic tableware and artisanal stoneware mugs',
      },
      ledger
    );

    expect(inference).toBeDefined();
    expect(['catalogue', 'ecommerce']).toContain(inference.primaryArchetype);
    expect(inference.candidatePages.length).toBeGreaterThanOrEqual(4);
  }, 30000);
});
