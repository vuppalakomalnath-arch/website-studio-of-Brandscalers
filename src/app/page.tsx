'use client';

import React, { useState } from 'react';
import { WebsiteRenderer } from '../engine/renderer/WebsiteRenderer';
import { WebsiteDocument, SafeAction } from '../engine/schemas/website-document';
import clinicFixture from '../fixtures/demo-website-clinic.json';
import editorialFixture from '../fixtures/demo-website-editorial.json';
import creativeFixture from '../fixtures/demo-website-creative.json';
import { DESIGN_PRESETS } from '../engine/design/presets';
import { IntakeModal } from '@/components/intake/IntakeModal';
import { SectionEditor } from '@/components/editor/SectionEditor';
import { QaPanel } from '@/components/qa/QaPanel';
import { ExportModal } from '@/components/export/ExportModal';

type ViewportMode = '1440' | '768' | '390' | '360';

export default function BuilderPage() {
  const [currentDoc, setCurrentDoc] = useState<WebsiteDocument>(clinicFixture as unknown as WebsiteDocument);
  const [activeSlug, setActiveSlug] = useState<string>('home');
  const [viewport, setViewport] = useState<ViewportMode>('1440');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Panels state
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isQaOpen, setIsQaOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAction = (action: SafeAction) => {
    if (action.type === 'internal-link') {
      setActiveSlug(action.target);
      showToast(`Navigated to page: /${action.target}`);
    } else if (action.type === 'tel') {
      showToast(`Phone action triggered: ${action.target}`);
    } else if (action.type === 'mailto') {
      showToast(`Email action triggered: ${action.target}`);
    } else {
      showToast(`Action dispatched: [${action.type}] -> ${action.target}`);
    }
  };

  const handleSelectBusiness = (type: 'clinic' | 'editorial' | 'creative') => {
    if (type === 'clinic') {
      setCurrentDoc(clinicFixture as unknown as WebsiteDocument);
    } else if (type === 'editorial') {
      setCurrentDoc(editorialFixture as unknown as WebsiteDocument);
    } else {
      setCurrentDoc(creativeFixture as unknown as WebsiteDocument);
    }
    setActiveSlug('home');
    showToast(`Loaded benchmark business: ${type.toUpperCase()}`);
  };

  const handlePresetChange = (presetName: string) => {
    const tokens = DESIGN_PRESETS[presetName];
    if (!tokens) return;
    setCurrentDoc((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        preset: presetName,
        tokens,
      },
    }));
    showToast(`Applied design preset: ${presetName}`);
  };

  const handleDocumentGenerated = (doc: WebsiteDocument, isMocked: boolean, credits: number) => {
    setCurrentDoc(doc);
    setActiveSlug(doc.pages[0]?.slug || 'home');
    showToast(`Website generated successfully! (${credits} credits charged · ${isMocked ? 'Demo Mode' : 'Gemini Live'})`);
  };

  const viewportWidth = {
    '1440': '100%',
    '768': '768px',
    '390': '390px',
    '360': '360px',
  }[viewport];

  return (
    <div className="builder-app">
      {/* Top Application Toolbar */}
      <header className="builder-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="builder-logo">
            <span>⚡ Website Studio 2.0</span>
            <span className="builder-tag">Engine Slice</span>
          </div>

          {/* New Brief Button */}
          <button
            onClick={() => setIsIntakeOpen(true)}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ✨ New AI Build
          </button>

          {/* Business Archetype Switcher */}
          <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
            <button
              onClick={() => handleSelectBusiness('clinic')}
              className={`btn-chrome ${currentDoc.projectId === 'proj-brightline-clinic-01' ? 'active' : ''}`}
            >
              🏥 Dental Clinic
            </button>
            <button
              onClick={() => handleSelectBusiness('editorial')}
              className={`btn-chrome ${currentDoc.projectId === 'proj-aura-editorial-02' ? 'active' : ''}`}
            >
              🏺 Concept Shop
            </button>
            <button
              onClick={() => handleSelectBusiness('creative')}
              className={`btn-chrome ${currentDoc.projectId === 'proj-apex-creative-03' ? 'active' : ''}`}
            >
              💻 Tech Agency
            </button>
          </div>
        </div>

        {/* Viewport, Editor, QA & Export Controls */}
        <div className="toolbar-controls">
          {/* Preset Dials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Preset:</span>
            <select
              value={currentDoc.design.preset}
              onChange={(e) => handlePresetChange(e.target.value)}
              style={{
                background: '#334155',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: 6,
                padding: '5px 10px',
                fontSize: '0.82rem',
              }}
            >
              {Object.keys(DESIGN_PRESETS).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Viewport Toggles */}
          <div style={{ display: 'flex', gap: 4, background: '#0f172a', padding: 3, borderRadius: 6, border: '1px solid #334155' }}>
            <button
              onClick={() => setViewport('1440')}
              className={`btn-chrome ${viewport === '1440' ? 'active' : ''}`}
              title="Desktop View (1440px)"
            >
              🖥️
            </button>
            <button
              onClick={() => setViewport('768')}
              className={`btn-chrome ${viewport === '768' ? 'active' : ''}`}
              title="Tablet View (768px)"
            >
              📱 768
            </button>
            <button
              onClick={() => setViewport('390')}
              className={`btn-chrome ${viewport === '390' ? 'active' : ''}`}
              title="Mobile View (390px)"
            >
              📱 390
            </button>
            <button
              onClick={() => setViewport('360')}
              className={`btn-chrome ${viewport === '360' ? 'active' : ''}`}
              title="Compact Mobile (360px)"
            >
              📱 360
            </button>
          </div>

          {/* Action Drawers */}
          <button
            onClick={() => {
              setIsEditorOpen(!isEditorOpen);
              setIsQaOpen(false);
            }}
            className={`btn-chrome ${isEditorOpen ? 'active' : ''}`}
          >
            ✏️ Edit Section
          </button>

          <button
            onClick={() => {
              setIsQaOpen(!isQaOpen);
              setIsEditorOpen(false);
            }}
            className={`btn-chrome ${isQaOpen ? 'active' : ''}`}
          >
            🔍 Run QA
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="btn-chrome"
          >
            📦 Export
          </button>
        </div>
      </header>

      {/* Page Navigation Subbar */}
      <div style={{ height: 42, background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>PAGES:</span>
          {currentDoc.pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActiveSlug(p.slug)}
              style={{
                background: activeSlug === p.slug ? '#38bdf8' : 'transparent',
                color: activeSlug === p.slug ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: activeSlug === p.slug ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              /{p.slug} ({p.title})
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          <span>Family: <strong style={{ color: '#38bdf8' }}>{currentDoc.design.family}</strong></span>
          <span style={{ marginLeft: 16 }}>Preset: <strong style={{ color: '#f8fafc' }}>{currentDoc.design.preset}</strong></span>
          <span style={{ marginLeft: 16 }}>
            Budget: <strong style={{ color: '#10b981' }}>{currentDoc.generation.actualCredits} / 250 credits</strong>
          </span>
          {currentDoc.generation.isMocked ? (
            <span style={{ marginLeft: 12, background: '#b45309', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              DEMO FIXTURE
            </span>
          ) : (
            <span style={{ marginLeft: 12, background: '#059669', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              ⚡ GEMINI 3.5 FLASH-LITE (LIVE)
            </span>
          )}
        </div>
      </div>

      {/* Main Preview Area + Drawers */}
      <div className="builder-main">
        <div className="preview-container">
          <div
            className="preview-viewport-frame"
            style={{
              width: viewportWidth,
              maxWidth: viewport === '1440' ? '1280px' : viewportWidth,
            }}
          >
            <WebsiteRenderer
              document={currentDoc}
              initialSlug={activeSlug}
              onNavigate={(slug) => setActiveSlug(slug)}
              onAction={handleAction}
            />
          </div>
        </div>

        {/* In-Place Section Editor Drawer */}
        {isEditorOpen && (
          <SectionEditor
            document={currentDoc}
            activeSlug={activeSlug}
            onUpdateDocument={(newDoc, note) => {
              setCurrentDoc(newDoc);
              showToast(note);
            }}
            onClose={() => setIsEditorOpen(false)}
          />
        )}

        {/* Deterministic QA Drawer */}
        {isQaOpen && (
          <QaPanel
            document={currentDoc}
            onClose={() => setIsQaOpen(false)}
          />
        )}
      </div>

      {/* Modals */}
      <IntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onGenerated={handleDocumentGenerated}
      />

      <ExportModal
        isOpen={isExportOpen}
        document={currentDoc}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #38bdf8',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 100,
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span>ℹ️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
