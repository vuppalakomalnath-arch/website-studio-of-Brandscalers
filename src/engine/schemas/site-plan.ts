import { z } from 'zod';
import { PrimaryGoalEnum } from './business-profile';

export const PlannedSectionSchema = z.object({
  type: z.enum([
    'site-header',
    'hero-split',
    'hero-centered',
    'service-grid',
    'feature-row',
    'testimonial-list',
    'faq-accordion',
    'gallery-grid',
    'call-to-action',
    'contact-form',
    'location-hours',
    'site-footer',
  ]),
  purpose: z.string(),
  variant: z.string().optional(),
});
export type PlannedSection = z.infer<typeof PlannedSectionSchema>;

export const PlannedPageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe (lowercase letters, numbers, hyphens)'),
  title: z.string().min(1),
  purpose: z.string(),
  sections: z.array(PlannedSectionSchema).min(1),
  primaryCta: z.object({
    label: z.string(),
    actionType: z.enum(['internal-link', 'tel', 'mailto', 'whatsapp', 'external-link']),
    target: z.string(),
  }),
});
export type PlannedPage = z.infer<typeof PlannedPageSchema>;

export const SitePlanSchema = z.object({
  schemaVersion: z.literal('1.0').default('1.0'),
  businessSummary: z.string().min(10),
  primaryGoal: PrimaryGoalEnum,
  designFamily: z.enum(['local-service', 'editorial', 'modern', 'creative']),
  preset: z.string(),
  rationale: z.string(),
  pages: z.array(PlannedPageSchema).min(3, 'Site plan must include at least 3 pages'),
  warnings: z.array(z.string()).default([]),
});

export type SitePlan = z.infer<typeof SitePlanSchema>;
