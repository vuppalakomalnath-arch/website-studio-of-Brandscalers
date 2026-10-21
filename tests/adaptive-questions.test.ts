import { describe, it, expect } from 'vitest';
import { inferBusinessProfile } from '../src/engine/inference/rules';
import { getAdaptiveQuestionsForInference, QUESTION_CATALOG } from '../src/engine/adaptive-questions/catalog';

describe('Adaptive Question Engine (catalog.ts)', () => {
  it('all questions in the catalog strictly enforce aiCallPolicy as "never"', () => {
    for (const q of QUESTION_CATALOG) {
      expect(q.aiCallPolicy).toBe('never');
    }
  });

  it('filters questions strictly relevant to healthcare without product selling questions', () => {
    const inference = inferBusinessProfile({
      businessName: 'Apex Physiotherapy Clinic',
      category: 'Healthcare',
      offerDescription: 'Sports injury rehabilitation and spinal therapy',
    });

    const questions = getAdaptiveQuestionsForInference(inference);
    const questionIds = questions.map((q) => q.id);

    expect(questionIds).toContain('hc_treatments');
    expect(questionIds).toContain('hc_appointment_method');
    expect(questionIds).not.toContain('ecom_checkout_provider');
    expect(questionIds).not.toContain('cat_product_categories');
    expect(questionIds).not.toContain('rest_menu_highlights');
  });

  it('filters questions strictly relevant to restaurant without ecommerce questions', () => {
    const inference = inferBusinessProfile({
      businessName: 'The Rustic Hearth',
      category: 'Restaurant',
      offerDescription: 'Artisan stone-milled bakery, specialty espresso, and sourdough brunch',
    });

    const questions = getAdaptiveQuestionsForInference(inference);
    const questionIds = questions.map((q) => q.id);

    expect(questionIds).toContain('rest_cuisine');
    expect(questionIds).toContain('rest_menu_highlights');
    expect(questionIds).toContain('rest_reservation_channel');
    expect(questionIds).not.toContain('ecom_checkout_provider');
    expect(questionIds).not.toContain('hc_treatments');
  });

  it('filters questions for portfolio creator without inventory/shipping questions', () => {
    const inference = inferBusinessProfile({
      businessName: 'Elena Rostova',
      category: 'Portfolio',
      offerDescription: 'Principal product designer crafting interactive 3D web applications and design systems',
    });

    const questions = getAdaptiveQuestionsForInference(inference);
    const questionIds = questions.map((q) => q.id);

    expect(questionIds).toContain('port_creator_role');
    expect(questionIds).toContain('port_featured_projects');
    expect(questionIds).not.toContain('ecom_checkout_provider');
    expect(questionIds).not.toContain('ecom_shipping_coverage');
  });
});
