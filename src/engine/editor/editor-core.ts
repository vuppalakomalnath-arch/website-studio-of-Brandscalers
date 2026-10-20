import { WebsiteDocument, Section, WebsiteDocumentSchema } from '../schemas/website-document';

export interface SectionEditPatch {
  visible?: boolean;
  styleOverrides?: {
    surfaceStyle?: 'default' | 'surface' | 'outlined' | 'raised' | 'flat' | 'tinted';
    align?: 'left' | 'center';
    density?: 'airy' | 'balanced' | 'dense';
  };
  propsPatch?: Record<string, unknown>;
}

/**
 * Edit a specific section in a WebsiteDocument immutably.
 * Ensures strict isolation: sections other than sectionId remain bitwise identical.
 * Validates the updated document schema.
 */
export function updateWebsiteSection(
  doc: WebsiteDocument,
  pageSlug: string,
  sectionId: string,
  patch: SectionEditPatch
): { updatedDoc: WebsiteDocument; success: boolean; error?: string } {
  const pageIndex = doc.pages.findIndex((p) => p.slug === pageSlug);
  if (pageIndex === -1) {
    return { updatedDoc: doc, success: false, error: `Page with slug "${pageSlug}" not found.` };
  }

  const page = doc.pages[pageIndex];
  const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) {
    return { updatedDoc: doc, success: false, error: `Section with ID "${sectionId}" not found on page "${pageSlug}".` };
  }

  const targetSection = page.sections[sectionIndex];

  // Apply updates to target section only
  const updatedSection: Section = {
    ...targetSection,
    version: targetSection.version + 1,
    visible: patch.visible !== undefined ? patch.visible : targetSection.visible,
    styleOverrides: {
      ...targetSection.styleOverrides,
      ...patch.styleOverrides,
    },
    props: {
      ...targetSection.props,
      ...patch.propsPatch,
    },
  };

  // Reconstruct immutable page with strictly identical neighbor sections
  const newSections = [
    ...page.sections.slice(0, sectionIndex),
    updatedSection,
    ...page.sections.slice(sectionIndex + 1),
  ];

  const newPages = [
    ...doc.pages.slice(0, pageIndex),
    {
      ...page,
      sections: newSections,
    },
    ...doc.pages.slice(pageIndex + 1),
  ];

  const newDoc: WebsiteDocument = {
    ...doc,
    pages: newPages,
    updatedAt: new Date().toISOString(),
  };

  // Re-validate entire document schema
  const parseResult = WebsiteDocumentSchema.safeParse(newDoc);
  if (!parseResult.success) {
    return {
      updatedDoc: doc,
      success: false,
      error: `Edit violated schema: ${parseResult.error.message}`,
    };
  }

  return {
    updatedDoc: parseResult.data,
    success: true,
  };
}

/**
 * Reorder sections within a page immutably.
 */
export function reorderWebsiteSections(
  doc: WebsiteDocument,
  pageSlug: string,
  sourceIndex: number,
  targetIndex: number
): WebsiteDocument {
  const pageIndex = doc.pages.findIndex((p) => p.slug === pageSlug);
  if (pageIndex === -1) return doc;

  const page = doc.pages[pageIndex];
  if (sourceIndex < 0 || sourceIndex >= page.sections.length) return doc;
  if (targetIndex < 0 || targetIndex >= page.sections.length) return doc;

  const newSections = [...page.sections];
  const [removed] = newSections.splice(sourceIndex, 1);
  newSections.splice(targetIndex, 0, removed);

  const newPages = [...doc.pages];
  newPages[pageIndex] = { ...page, sections: newSections };

  return {
    ...doc,
    pages: newPages,
    updatedAt: new Date().toISOString(),
  };
}
