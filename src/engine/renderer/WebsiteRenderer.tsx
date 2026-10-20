'use client';

import React, { useState } from 'react';
import { WebsiteDocument, SafeAction } from '../schemas/website-document';
import { designToVars } from '../design/tokens';
import { renderSection } from './registry';

export interface WebsiteRendererProps {
  document: WebsiteDocument;
  initialSlug?: string;
  onNavigate?: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
  className?: string;
}

export const WebsiteRenderer: React.FC<WebsiteRendererProps> = ({
  document,
  initialSlug,
  onNavigate: externalNavigate,
  onAction,
  className = '',
}) => {
  const [internalSlug, setInternalSlug] = useState<string>(
    initialSlug || document.pages[0]?.slug || 'home'
  );

  const activeSlug = initialSlug !== undefined ? initialSlug : internalSlug;

  const handleNavigate = (slug: string) => {
    setInternalSlug(slug);
    if (externalNavigate) {
      externalNavigate(slug);
    }
  };

  // Find active page or fallback to first page
  const activePage = document.pages.find((p) => p.slug === activeSlug) || document.pages[0];

  // Compile design tokens into CSS variables and data attributes
  const { vars, attrs } = designToVars(document.design.tokens);

  // Filter visible sections
  const visibleSections = activePage ? activePage.sections.filter((s) => s.visible !== false) : [];

  return (
    <div
      className={`bs ${className}`}
      style={{
        ...vars,
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
        fontFamily: 'var(--bf)',
        minHeight: '100%',
        width: '100%',
        boxSizing: 'border-box',
      }}
      {...attrs}
    >
      {activePage ? (
        <main>
          {visibleSections.map((section) => (
            <React.Fragment key={section.id}>
              {renderSection(section.type, section.props, {
                activeSlug,
                onNavigate: handleNavigate,
                onAction,
              })}
            </React.Fragment>
          ))}
        </main>
      ) : (
        <div style={{ padding: 48, textAlign: 'center' }}>
          <h2>Page Not Found</h2>
          <p>The requested page &quot;{activeSlug}&quot; does not exist in this website document.</p>
          <button
            onClick={() => handleNavigate(document.pages[0]?.slug || 'home')}
            style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};
