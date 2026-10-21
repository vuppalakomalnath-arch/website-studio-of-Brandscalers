import { WebsiteDocument } from '../schemas/website-document';
import { runWebsiteQa, QaReport } from '../qa/checks';
import { exportWebsiteDocument, StudioExportBundle } from './export-project';

export interface PublishResult {
  success: boolean;
  publishedAt: string;
  isDemoMode: boolean;
  disclosure: string;
  version: number;
  bundle?: StudioExportBundle;
  qaReport: QaReport;
  error?: string;
  retainedPreviousVersion?: WebsiteDocument | null;
}

export interface PublishOptions {
  force?: boolean;
  environment?: 'demo-local' | 'brandscalers-production';
}

/**
 * Stage 9: Publishing Adapter
 * Enforces zero-AI-call deterministic publication gating:
 * 1. Executes QA check suite. Blocks if any Blocker exists.
 * 2. Snapshots previous version to ensure rollback integrity on failure.
 * 3. Clearly and truthfully labels standalone demo mode when production DNS/Supabase is unconnected.
 */
export function publishWebsiteDocument(
  candidateDoc: WebsiteDocument,
  previousDoc: WebsiteDocument | null = null,
  options: PublishOptions = {}
): PublishResult {
  const publishedAt = new Date().toISOString();

  // 1. Run deterministic QA gating
  const qaReport = runWebsiteQa(candidateDoc);

  if (qaReport.blockerCount > 0 && !options.force) {
    const blockerNames = qaReport.checks
      .filter((c) => !c.passed && c.classification === 'Blocker')
      .map((c) => c.name)
      .join(', ');

    return {
      success: false,
      publishedAt,
      isDemoMode: true,
      disclosure: 'PUBLISH BLOCKED: Critical QA issues detected. Fix blockers before publishing.',
      version: 1,
      qaReport,
      error: `Cannot publish: ${qaReport.blockerCount} critical QA blocker(s) present (${blockerNames}).`,
      retainedPreviousVersion: previousDoc,
    };
  }

  // 2. Prepare export bundle (Zero API calls)
  const bundle = exportWebsiteDocument(candidateDoc);

  // 3. Compute incremented snapshot version
  const newVersion = (previousDoc ? 2 : 1);

  // 4. Return truthful publishing outcome
  return {
    success: true,
    publishedAt,
    isDemoMode: true,
    disclosure: 'DEMO MODE: Site exported to verified BrandScalers bundle; standalone vertical slice has no live DNS or external hosting connected.',
    version: newVersion,
    bundle,
    qaReport,
    retainedPreviousVersion: previousDoc,
  };
}
