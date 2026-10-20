import { WebsiteDocument } from '../schemas/website-document';

export interface StudioExportBundle {
  schemaVersion: '1.0';
  exportedAt: string;
  sourceEngine: 'WebsiteStudio-2.0-VerticalSlice';
  projectMetadata: {
    projectId: string;
    businessProfileId: string;
    designFamily: string;
    preset: string;
    pageCount: number;
    totalSections: number;
  };
  websiteDocument: WebsiteDocument;
  adapterNotes: string[];
}

/**
 * Serializes the current WebsiteDocument into a versioned, portable bundle
 * ready to be ingested by the existing BrandScalers Website Studio adapter.
 */
export function exportWebsiteDocument(doc: WebsiteDocument): StudioExportBundle {
  const totalSections = doc.pages.reduce((acc, p) => acc + p.sections.length, 0);

  return {
    schemaVersion: '1.0',
    exportedAt: new Date().toISOString(),
    sourceEngine: 'WebsiteStudio-2.0-VerticalSlice',
    projectMetadata: {
      projectId: doc.projectId,
      businessProfileId: doc.businessProfileId,
      designFamily: doc.design.family,
      preset: doc.design.preset,
      pageCount: doc.pages.length,
      totalSections,
    },
    websiteDocument: doc,
    adapterNotes: [
      'Document conforms to WebsiteDocument Schema v1.0.',
      'All section types map directly to the 12-component BrandScalers registry.',
      'Design tokens compile through designToVars() into .bs CSS variables and data attributes.',
      'No client-side database writes or secrets required.',
    ],
  };
}
