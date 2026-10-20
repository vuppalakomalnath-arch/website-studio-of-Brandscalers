import { describe, it, expect } from 'vitest';
import { updateWebsiteSection, reorderWebsiteSections } from '../src/engine/editor/editor-core';
import clinicFixture from '../src/fixtures/demo-website-clinic.json';
import { WebsiteDocument } from '../src/engine/schemas/website-document';

describe('Suite 5: In-Place Section Editing & Isolation', () => {
  const initialDoc = clinicFixture as unknown as WebsiteDocument;

  it('updates target section properties while leaving other sections bitwise unchanged', () => {
    const targetSectionId = 'sec-hero-1';
    const newTitle = 'Updated Luxury Dental Experience';

    const result = updateWebsiteSection(initialDoc, 'home', targetSectionId, {
      propsPatch: {
        title: newTitle,
      },
    });

    expect(result.success).toBe(true);
    const updatedHome = result.updatedDoc.pages.find((p) => p.slug === 'home')!;
    const updatedHero = updatedHome.sections.find((s) => s.id === targetSectionId)!;
    expect((updatedHero.props as any).title).toBe(newTitle);
    expect(updatedHero.version).toBe(2);

    // Verify neighbor sections are strictly untouched
    const initialHdr = initialDoc.pages[0].sections.find((s) => s.id === 'sec-hdr-1')!;
    const updatedHdr = updatedHome.sections.find((s) => s.id === 'sec-hdr-1')!;
    expect(JSON.stringify(updatedHdr)).toBe(JSON.stringify(initialHdr));

    const initialSvc = initialDoc.pages[0].sections.find((s) => s.id === 'sec-svc-1')!;
    const updatedSvc = updatedHome.sections.find((s) => s.id === 'sec-svc-1')!;
    expect(JSON.stringify(updatedSvc)).toBe(JSON.stringify(initialSvc));
  });

  it('toggles section visibility without schema errors', () => {
    const result = updateWebsiteSection(initialDoc, 'home', 'sec-testi-1', {
      visible: false,
    });

    expect(result.success).toBe(true);
    const updatedHome = result.updatedDoc.pages.find((p) => p.slug === 'home')!;
    const testiSection = updatedHome.sections.find((s) => s.id === 'sec-testi-1')!;
    expect(testiSection.visible).toBe(false);
  });

  it('reorders sections within a page', () => {
    const homeSections = initialDoc.pages[0].sections;
    const initialOrder = homeSections.map((s) => s.id);

    // Swap second and third section
    const reorderedDoc = reorderWebsiteSections(initialDoc, 'home', 1, 2);
    const reorderedIds = reorderedDoc.pages[0].sections.map((s) => s.id);

    expect(reorderedIds[1]).toBe(initialOrder[2]);
    expect(reorderedIds[2]).toBe(initialOrder[1]);
  });
});
