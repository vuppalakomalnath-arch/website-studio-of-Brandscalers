import { BusinessProfile, BusinessProfileSchema } from '../schemas/business-profile';
import { SitePlan } from '../schemas/site-plan';
import {
  WebsiteDocument,
  WebsiteDocumentSchema,
  Section,
  Page,
  validateSectionProps,
} from '../schemas/website-document';
import { ModelProvider } from './provider';
import { GeminiProvider } from './gemini-provider';
import { FixtureProvider } from './fixture-provider';
import { UsageLedger, MAX_INITIAL_BUILD_CREDITS } from './budget';
import { DESIGN_PRESETS, getPresetForFamily, DesignFamily } from '../design/presets';

export interface GenerationResult {
  document: WebsiteDocument;
  plan: SitePlan;
  ledger: UsageLedger;
  isMocked: boolean;
  warnings: string[];
}

export async function generateWebsiteFromProfile(
  rawProfile: unknown,
  customProvider?: ModelProvider,
  ledger: UsageLedger = new UsageLedger(MAX_INITIAL_BUILD_CREDITS)
): Promise<GenerationResult> {
  const startTime = Date.now();

  // Step 1: Normalize and validate business profile
  const profile = BusinessProfileSchema.parse(rawProfile);

  // Step 2: Determine provider
  let provider: ModelProvider;
  let isMocked = false;

  if (customProvider) {
    provider = customProvider;
  } else {
    const liveGemini = new GeminiProvider();
    if (liveGemini.isAvailable) {
      provider = liveGemini;
    } else {
      provider = new FixtureProvider();
      isMocked = true;
    }
  }

  const warnings: string[] = [];

  // Step 3: Generate Site Plan (Gemini-3 or Fixture)
  let plan: SitePlan;
  try {
    plan = await provider.generatePlan(profile, ledger);
  } catch (err: any) {
    warnings.push(`Planning API error (${err?.message || 'High demand'}); falling back to intelligent blueprint generator.`);
    const fallbackProvider = new FixtureProvider();
    plan = await fallbackProvider.generatePlan(profile, ledger);
    isMocked = true;
  }

  // Step 4: Resolve Design Family, Preset & Tokens
  const family = plan.designFamily as DesignFamily;
  const { presetName, tokens } = getPresetForFamily(family, plan.preset);

  // Step 5: Generate Page Sections with page-level concurrency and resilient per-section fallback
  const pages: Page[] = [];

  for (const plannedPage of plan.pages) {
    const sections: Section[] = await Promise.all(
      plannedPage.sections.map(async (plannedSec, i) => {
        const sectionId = `sec-${plannedPage.slug}-${i + 1}-${plannedSec.type}`;
        const context = {
          business: profile,
          pageSlug: plannedPage.slug,
          pageTitle: plannedPage.title,
          pagePurpose: plannedPage.purpose,
          sectionType: plannedSec.type,
          sectionPurpose: plannedSec.purpose,
        };

        let rawProps: unknown;

        try {
          // Guard against long network stalls with 10s timeout per section
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Section generation timeout')), 10000)
          );
          rawProps = await Promise.race([
            provider.generateSectionProps(context, ledger),
            timeoutPromise,
          ]);
        } catch (err: any) {
          warnings.push(`Section ${plannedSec.type} fallback: ${err?.message || 'High demand'}`);
          const fallbackProvider = new FixtureProvider();
          const repairLedger = new UsageLedger(100);
          rawProps = await fallbackProvider.generateSectionProps(context, repairLedger);
        }

        // Validate section props against strict schema
        let validation = validateSectionProps(plannedSec.type, rawProps);

        // Targeted repair if validation failed
        if (!validation.success) {
          const fallbackProvider = new FixtureProvider();
          const repairLedger = new UsageLedger(100);
          rawProps = await fallbackProvider.generateSectionProps(context, repairLedger);
          validation = validateSectionProps(plannedSec.type, rawProps);
        }

        return {
          id: sectionId,
          type: plannedSec.type,
          version: 1,
          visible: true,
          props: validation.success ? validation.data : (rawProps as Record<string, unknown>),
        };
      })
    );

    pages.push({
      id: `page-${plannedPage.slug}`,
      slug: plannedPage.slug,
      title: plannedPage.title,
      purpose: plannedPage.purpose,
      seo: {
        title: `${plannedPage.title} | ${profile.businessName}`,
        description: plannedPage.purpose.slice(0, 160),
      },
      sections,
    });
  }

  // Step 6: Assemble Complete Website Document
  const rawDocument: WebsiteDocument = {
    schemaVersion: '1.0',
    projectId: `proj-${Date.now().toString(36)}`,
    businessProfileId: `prof-${Date.now().toString(36)}`,
    design: {
      family,
      preset: presetName,
      tokens,
    },
    pages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    generation: {
      model: provider.id,
      promptVersion: 'v1.0',
      estimatedCredits: ledger.getEstimatedSpent(),
      actualCredits: 0,
      durationMs: Date.now() - startTime,
      isMocked,
    },
  };

  // Step 7: Validate Entire Document Against Strict Schema
  const validatedDoc = WebsiteDocumentSchema.parse(rawDocument);

  // Step 8: Commit Usage Ledger and finalize actual credits charged
  const actualChargedCredits = ledger.commit();
  validatedDoc.generation.actualCredits = actualChargedCredits;

  return {
    document: validatedDoc,
    plan,
    ledger,
    isMocked,
    warnings: [...(plan.warnings || []), ...warnings],
  };
}
