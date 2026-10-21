import { describe, it, expect } from 'vitest';
import { inferBusinessProfile } from '../src/engine/inference/rules';

describe('Local Inference Engine (rules.ts)', () => {
  it('correctly infers healthcare clinic and assigns calls goal without asking about product sales', () => {
    const inference = inferBusinessProfile({
      businessName: 'Apex Physiotherapy & Spine',
      category: 'Healthcare',
      offerDescription: 'Sports injury rehabilitation, spinal manual therapy, post-op orthopedic recovery',
    });

    expect(inference.primaryArchetype).toBe('healthcare');
    expect(inference.confidence).toBe('high');
    expect(inference.likelyGoal).toBe('calls');
    expect(inference.candidatePages).toContain('services');
    expect(inference.recommendedQuestionIds).toContain('hc_treatments');
    expect(inference.recommendedQuestionIds).not.toContain('ecom_checkout_provider');
  });

  it('correctly infers restaurant/cafe from "Not sure" category based on offer keywords', () => {
    const inference = inferBusinessProfile({
      businessName: 'Mango & Mint',
      category: 'Not sure / Recommend for me',
      offerDescription: 'Artisan bakery and specialty coffee shop serving sourdough pastries, brunch, and flat whites',
    });

    expect(inference.primaryArchetype).toBe('restaurant');
    expect(inference.likelyGoal).toBe('bookings_external');
    expect(inference.recommendedQuestionIds).toContain('rest_cuisine');
    expect(inference.recommendedQuestionIds).not.toContain('ecom_checkout_provider');
  });

  it('correctly infers wedding photography as portfolio and NOT ecommerce', () => {
    const inference = inferBusinessProfile({
      businessName: 'Studio Anu',
      category: 'Not sure / Recommend for me',
      offerDescription: 'Destination wedding photography, cinematic pre-wedding films, and visual storytelling',
    });

    expect(inference.primaryArchetype).toBe('portfolio');
    expect(inference.likelyGoal).toBe('portfolio');
    expect(inference.recommendedQuestionIds).toContain('port_creator_role');
    expect(inference.recommendedQuestionIds).not.toContain('ecom_checkout_provider');
  });

  it('correctly infers bookkeeping as lead-gen / advisory service', () => {
    const inference = inferBusinessProfile({
      businessName: 'Northstar Advisory',
      category: 'Not sure / Recommend for me',
      offerDescription: 'Bookkeeping, corporate tax preparation, and fractional CFO advisory for small businesses',
    });

    expect(inference.primaryArchetype).toBe('lead-gen');
    expect(inference.likelyGoal).toBe('enquiries');
    expect(inference.recommendedQuestionIds).not.toContain('ecom_checkout_provider');
  });

  it('correctly infers retail catalogue for bespoke saree studio without online checkout', () => {
    const inference = inferBusinessProfile({
      businessName: 'House of Jaya',
      category: 'Retail',
      offerDescription: 'Bespoke handloom heritage sarees, Banarasi brocades, and museum-grade bridal couture showroom',
    });

    expect(inference.primaryArchetype).toBe('catalogue');
    expect(inference.likelyGoal).toBe('catalogue');
    expect(inference.recommendedQuestionIds).toContain('cat_product_categories');
    expect(inference.recommendedQuestionIds).not.toContain('ecom_checkout_provider');
  });

  it('correctly infers ecommerce only when explicit checkout or online cart selling is stated', () => {
    const inference = inferBusinessProfile({
      businessName: 'Aura Activewear',
      category: 'Ecommerce',
      offerDescription: 'Online store selling athletic leggings with add to cart, instant checkout, and worldwide shipping',
    });

    expect(inference.primaryArchetype).toBe('ecommerce');
    expect(inference.recommendedQuestionIds).toContain('ecom_checkout_provider');
  });

  it('detects contradiction when category is Healthcare but offer describes selling ceramic pottery', () => {
    const inference = inferBusinessProfile({
      businessName: 'Clay & Co',
      category: 'Healthcare',
      offerDescription: 'Handmade ceramic pottery, stoneware mugs, and decorative clay vases',
    });

    expect(inference.primaryArchetype).toBe('catalogue');
    expect(inference.contradictions.length).toBeGreaterThan(0);
  });
});
