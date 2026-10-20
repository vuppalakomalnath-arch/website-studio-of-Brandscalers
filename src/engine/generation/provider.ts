import { BusinessProfile } from '../schemas/business-profile';
import { SitePlan } from '../schemas/site-plan';
import { SectionType } from '../schemas/website-document';
import { UsageLedger } from './budget';

export interface SectionGenerationContext {
  business: BusinessProfile;
  pageSlug: string;
  pageTitle: string;
  pagePurpose: string;
  sectionType: SectionType;
  sectionPurpose?: string;
}

export interface ModelProvider {
  readonly id: string;
  readonly name: string;
  readonly isAvailable: boolean;

  /**
   * Generate an architectural site plan using gemini-3 or fallback.
   */
  generatePlan(
    profile: BusinessProfile,
    ledger: UsageLedger
  ): Promise<SitePlan>;

  /**
   * Generate structured props for a single section using gemini-3.1-flash-lite or fallback.
   */
  generateSectionProps(
    context: SectionGenerationContext,
    ledger: UsageLedger
  ): Promise<unknown>;
}
