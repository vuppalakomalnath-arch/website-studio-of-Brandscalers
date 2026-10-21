import { GoogleGenAI } from '@google/genai';
import { BusinessProfile } from '../schemas/business-profile';
import { SitePlan, SitePlanSchema } from '../schemas/site-plan';
import { SectionType } from '../schemas/website-document';
import { ModelProvider, SectionGenerationContext } from './provider';
import { UsageLedger } from './budget';
import { MinimalIntake, BusinessInference, BusinessInferenceSchema } from '../schemas/inference';
import { inferBusinessProfile } from '../inference/rules';

export class GeminiProvider implements ModelProvider {
  public readonly id = 'google-gemini';
  public readonly name = 'Google Gemini (gemini-3.5-flash-lite & gemini-3.1-flash-lite)';
  private ai: GoogleGenAI | null = null;
  private planningModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];
  private sectionModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key && key.trim().length > 0 && key !== 'your_gemini_api_key_here') {
      this.ai = new GoogleGenAI({ apiKey: key.trim() });
    }
  }

  public get isAvailable(): boolean {
    return this.ai !== null;
  }

  private cleanJson(text: string): string {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.slice(7);
    } else if (clean.startsWith('```')) {
      clean = clean.slice(3);
    }
    if (clean.endsWith('```')) {
      clean = clean.slice(0, -3);
    }
    return clean.trim();
  }

  public async classifyAmbiguity(
    intake: MinimalIntake,
    ledger: UsageLedger
  ): Promise<BusinessInference> {
    if (!this.ai) {
      return inferBusinessProfile(intake);
    }

    const estimatedCredits = 10;
    const entryId = ledger.reserve('inference_ambiguity_fallback', this.planningModels[0], estimatedCredits);
    const startTime = Date.now();

    const prompt = `
You are the Business Taxonomy Classifier for Website Studio 2.0.
Given this ambiguous business brief, classify its primary archetype and structure.

INPUT:
Business Name: ${intake.businessName}
Category: ${intake.category}
Offer: ${intake.offerDescription}

ALLOWED ARCHETYPES:
["ecommerce", "catalogue", "local-service", "agency", "portfolio", "restaurant", "healthcare", "education", "event-venue", "hospitality", "nonprofit", "personal-brand", "lead-gen", "mixed-other"]

CRITICAL RULES:
1. Non-retail businesses (clinic, consultant, restaurant, portfolio) must NOT be classified as ecommerce unless they explicitly sell physical products online with cart/checkout.
2. Return strictly valid JSON adhering to:
{
  "schemaVersion": "2.0",
  "primaryArchetype": string,
  "confidence": "high" | "medium" | "low",
  "likelyGoal": "enquiries" | "calls" | "whatsapp" | "bookings_external" | "portfolio" | "brand" | "catalogue",
  "customerJourney": string,
  "candidatePages": ["home", "about", "services", "contact"],
  "requiredCapabilities": string[],
  "missingHighImpactInfo": string[],
  "contradictions": string[],
  "recommendedQuestionIds": string[],
  "source": "ai_fallback",
  "rulesVersion": "v2.0-ai-fallback"
}
`;

    for (const modelName of this.planningModels) {
      try {
        const response = await this.ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const rawText = response.text || '';
        const cleaned = this.cleanJson(rawText);
        const parsed = JSON.parse(cleaned);
        const validated = BusinessInferenceSchema.parse(parsed);

        const usage = response.usageMetadata;
        ledger.recordSuccess(
          entryId,
          {
            promptTokens: usage?.promptTokenCount || 400,
            candidatesTokens: usage?.candidatesTokenCount || 250,
            totalTokens: usage?.totalTokenCount || 650,
          },
          Date.now() - startTime
        );

        return validated;
      } catch (err: any) {
        // continue to next model
      }
    }

    ledger.recordFailure(entryId, 'Gemini ambiguity classification failed; falling back to rules');
    return inferBusinessProfile(intake);
  }

  public async generatePlan(
    profile: BusinessProfile,
    ledger: UsageLedger
  ): Promise<SitePlan> {
    if (!this.ai) {
      throw new Error('GeminiProvider is not configured with a valid GEMINI_API_KEY.');
    }

    // Pre-flight reservation: planning typically uses ~45 credits
    const estimatedCredits = 45;
    const entryId = ledger.reserve('plan_sitemap', this.planningModels[0], estimatedCredits);

    const prompt = `
You are the Lead Website Architect for Website Studio 2.0.
Given this normalized business profile, create a structured SitePlan JSON strictly following this schema:
- businessSummary: Concise summary (min 10 chars)
- primaryGoal: One of ["enquiries", "calls", "whatsapp", "bookings_external", "portfolio", "brand", "catalogue"]
- designFamily: One of ["local-service", "editorial", "modern", "creative"]
- preset: Recommended preset name (e.g. "Warm clinic", "Quiet luxury", "Editorial mono", "Dark premium", "Corporate navy", "Fresh green", "Warm restaurant", "Playful")
- rationale: Rationale for layout and visual direction
- pages: Array of at least 4 pages ("home", "about", "services", "contact"). For each page specify:
  - slug: url-safe slug (e.g. "home", "about", "services", "contact")
  - title: Human readable page title
  - purpose: Purpose of page
  - primaryCta: { label, actionType: "internal-link"|"tel"|"mailto"|"whatsapp"|"external-link", target }
  - sections: Array of section objects { type, purpose } using only:
    ["site-header", "hero-split", "hero-centered", "service-grid", "feature-row", "testimonial-list", "faq-accordion", "gallery-grid", "call-to-action", "contact-form", "location-hours", "site-footer"]
- warnings: Any missing facts or assumptions

BUSINESS BRIEF:
${JSON.stringify(profile, null, 2)}

Respond with valid JSON only.
`;

    let lastError: any = null;

    for (const modelName of this.planningModels) {
      try {
        const response = await this.ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawText = response.text || '';
        const cleaned = this.cleanJson(rawText);
        const parsed = JSON.parse(cleaned);
        const validated = SitePlanSchema.parse(parsed);

        // Record actual token usage
        const usage = response.usageMetadata;
        ledger.recordSuccess(entryId, {
          promptTokens: usage?.promptTokenCount || 1200,
          candidatesTokens: usage?.candidatesTokenCount || 1500,
          totalTokens: usage?.totalTokenCount || 2700,
        });

        return validated;
      } catch (err: any) {
        lastError = err;
        // Continue to fallback model if 503 or 404
      }
    }

    ledger.recordFailure(entryId, lastError?.message || 'Gemini planning failed across all models');
    throw lastError;
  }

  public async generateSectionProps(
    context: SectionGenerationContext,
    ledger: UsageLedger
  ): Promise<unknown> {
    if (!this.ai) {
      throw new Error('GeminiProvider is not configured with a valid GEMINI_API_KEY.');
    }

    // Pre-flight reservation: section generation typically uses ~7 credits
    const estimatedCredits = 7;
    const entryId = ledger.reserve(`section_${context.sectionType}`, this.sectionModels[0], estimatedCredits);

    const prompt = `
You are the Section Content Generator for Website Studio 2.0.
Generate structured JSON props for the component: "${context.sectionType}".
Do NOT output arbitrary HTML or JavaScript. Output strictly validated structured data fields.

BUSINESS PROFILE:
Name: ${context.business.businessName}
Type: ${context.business.businessType}
Location: ${context.business.location || 'Local area'}
Services: ${JSON.stringify(context.business.servicesOrProducts)}
Contact: ${JSON.stringify(context.business.contact || {})}
Category Specifics: ${JSON.stringify(context.business.categorySpecifics || {})}
Differentiators: ${JSON.stringify(context.business.differentiators || [])}
Proof Points: ${JSON.stringify(context.business.proofPoints || [])}

PAGE CONTEXT:
Page: ${context.pageTitle} (/${context.pageSlug})
Page Purpose: ${context.pagePurpose}
Section Role: ${context.sectionPurpose || context.sectionType}

REQUIRED RULES:
1. Do not invent fake reviews, certifications, or fake facts.
2. In 'testimonial-list', include 'isDemoData: true'.
3. In 'contact-form', include 'isDemoMode: true'.
4. Ensure primaryCta and actions have allowed types ("internal-link", "tel", "mailto", "whatsapp", "external-link").

Respond with valid JSON only.
`;

    let lastError: any = null;

    for (const modelName of this.sectionModels) {
      try {
        const response = await this.ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const rawText = response.text || '{}';
        const cleaned = this.cleanJson(rawText);
        const parsed = JSON.parse(cleaned);

        const usage = response.usageMetadata;
        ledger.recordSuccess(entryId, {
          promptTokens: Math.min(300, usage?.promptTokenCount || 300),
          candidatesTokens: Math.min(300, usage?.candidatesTokenCount || 300),
          totalTokens: Math.min(600, usage?.totalTokenCount || 600),
        });

        return parsed;
      } catch (err: any) {
        lastError = err;
      }
    }

    ledger.recordFailure(entryId, lastError?.message || 'Gemini section generation failed across all models');
    throw lastError;
  }
}
