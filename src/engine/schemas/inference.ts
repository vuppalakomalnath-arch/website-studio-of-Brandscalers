import { z } from 'zod';
import { PrimaryGoalEnum } from './business-profile';

export const ArchetypeEnum = z.enum([
  'ecommerce',
  'catalogue',
  'local-service',
  'agency',
  'portfolio',
  'restaurant',
  'healthcare',
  'education',
  'event-venue',
  'hospitality',
  'nonprofit',
  'personal-brand',
  'lead-gen',
  'mixed-other',
]);
export type Archetype = z.infer<typeof ArchetypeEnum>;

export const ConfidenceEnum = z.enum(['high', 'medium', 'low']);
export type Confidence = z.infer<typeof ConfidenceEnum>;

export const InferenceSourceEnum = z.enum(['rules', 'ai_fallback', 'user_confirmed']);
export type InferenceSource = z.infer<typeof InferenceSourceEnum>;

export const MinimalIntakeSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(120),
  category: z.string().min(1, 'Category is required'),
  offerDescription: z.string().min(3, 'What the business offers is required').max(1000),
});
export type MinimalIntake = z.infer<typeof MinimalIntakeSchema>;

export const BusinessInferenceSchema = z.object({
  schemaVersion: z.literal('2.0').default('2.0'),
  primaryArchetype: ArchetypeEnum,
  secondaryArchetype: ArchetypeEnum.optional(),
  confidence: ConfidenceEnum,
  likelyGoal: PrimaryGoalEnum,
  customerJourney: z.string(),
  candidatePages: z.array(z.string()),
  requiredCapabilities: z.array(z.string()),
  missingHighImpactInfo: z.array(z.string()),
  contradictions: z.array(z.string()),
  recommendedQuestionIds: z.array(z.string()),
  source: InferenceSourceEnum,
  rulesVersion: z.string().default('v2.0-rules'),
});
export type BusinessInference = z.infer<typeof BusinessInferenceSchema>;
