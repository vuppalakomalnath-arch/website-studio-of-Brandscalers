import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { WebsiteRenderer } from '../src/engine/renderer/WebsiteRenderer';
import { renderSection, COMPONENT_REGISTRY } from '../src/engine/renderer/registry';
import clinicFixture from '../src/fixtures/demo-website-clinic.json';
import editorialFixture from '../src/fixtures/demo-website-editorial.json';
import creativeFixture from '../src/fixtures/demo-website-creative.json';
import { WebsiteDocument } from '../src/engine/schemas/website-document';

describe('Suite 3: Trusted Component Renderer & Multi-Page Navigation', () => {
  it('mounts all 12 manifest components through registry without runtime exception', () => {
    const types = Object.keys(COMPONENT_REGISTRY) as Array<keyof typeof COMPONENT_REGISTRY>;
    expect(types.length).toBe(12);

    const dummyContext = {
      activeSlug: 'home',
      onNavigate: () => {},
      onAction: () => {},
    };

    // Test each of the 12 components directly through renderSection
    types.forEach((type) => {
      // Find a sample section prop from fixtures
      let sampleProps: any = null;
      for (const page of clinicFixture.pages) {
        const found = page.sections.find((s) => s.type === type);
        if (found) {
          sampleProps = found.props;
          break;
        }
      }
      if (!sampleProps) {
        for (const page of creativeFixture.pages) {
          const found = page.sections.find((s) => s.type === type);
          if (found) {
            sampleProps = found.props;
            break;
          }
        }
      }

      expect(sampleProps).toBeDefined();
      const node = renderSection(type, sampleProps, dummyContext);
      const html = renderToString(React.createElement(React.Fragment, null, node));
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);
      expect(html).not.toContain('Validation Error');
      expect(html).not.toContain('Render Error');
    });
  });

  it('renders all pages of the clinic fixture (Home, About, Services, Contact)', () => {
    const doc = clinicFixture as unknown as WebsiteDocument;

    ['home', 'about', 'services', 'contact'].forEach((slug) => {
      const html = renderToString(
        React.createElement(WebsiteRenderer, {
          document: doc,
          initialSlug: slug,
        })
      );
      expect(html).toContain('class="bs ');
      expect(html).toContain('data-buttons="solid"');
      expect(html).toContain('Brightline Dental');
    });
  });

  it('renders editorial and creative fixtures with distinct design tokens and classes', () => {
    const editorialDoc = editorialFixture as unknown as WebsiteDocument;
    const creativeDoc = creativeFixture as unknown as WebsiteDocument;

    const editorialHtml = renderToString(
      React.createElement(WebsiteRenderer, {
        document: editorialDoc,
        initialSlug: 'home',
      })
    );
    expect(editorialHtml).toContain('data-buttons="outline"');
    expect(editorialHtml).toContain('Aura Concept Atelier');
    expect(editorialHtml).toContain('--accent:#8a5d4e');

    const creativeHtml = renderToString(
      React.createElement(WebsiteRenderer, {
        document: creativeDoc,
        initialSlug: 'home',
      })
    );
    expect(creativeHtml).toContain('data-mode="dark"');
    expect(creativeHtml).toContain('Apex Digital Dynamics');
    expect(creativeHtml).toContain('--accent:#d4a95a');
  });

  it('gracefully handles unknown component types with an error boundary rather than throwing', () => {
    const dummyContext = {
      activeSlug: 'home',
      onNavigate: () => {},
    };
    // @ts-expect-error Testing invalid component type
    const node = renderSection('unknown-malicious-script', {}, dummyContext);
    const html = renderToString(React.createElement(React.Fragment, null, node));
    expect(html).toContain('Render Error');
    expect(html).toContain('Unknown or unregistered component type');
  });
});
