import { z } from 'zod';

export const QuestionTypeEnum = z.enum([
  'text',
  'textarea',
  'select',
  'multiselect',
  'radio',
  'url',
]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const QuestionOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
});
export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

export const AiCallPolicyEnum = z.enum(['never', 'on_ambiguity', 'always']);
export type AiCallPolicy = z.infer<typeof AiCallPolicyEnum>;

export const AdaptiveQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  explanation: z.string(),
  type: QuestionTypeEnum,
  options: z.array(QuestionOptionSchema).optional(),
  required: z.boolean().default(false),
  whyNeeded: z.string(),
  affectedPlanFields: z.array(z.string()),
  aiCallPolicy: AiCallPolicyEnum.default('never'),
  defaultValue: z.any().optional(),
});
export type AdaptiveQuestion = z.infer<typeof AdaptiveQuestionSchema>;

export const QuestionAnswerMapSchema = z.record(z.string(), z.any());
export type QuestionAnswerMap = z.infer<typeof QuestionAnswerMapSchema>;
