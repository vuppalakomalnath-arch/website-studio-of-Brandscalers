'use client';

import React, { useState } from 'react';
import { WebsiteDocument, Section } from '@/engine/schemas/website-document';
import { updateWebsiteSection } from '@/engine/editor/editor-core';

interface Props {
  document: WebsiteDocument;
  activeSlug: string;
  onUpdateDocument: (newDoc: WebsiteDocument, note: string) => void;
  onClose: () => void;
}

export const SectionEditor: React.FC<Props> = ({
  document,
  activeSlug,
  onUpdateDocument,
  onClose,
}) => {
  const activePage = document.pages.find((p) => p.slug === activeSlug) || document.pages[0];
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    activePage?.sections[0]?.id || ''
  );

  const selectedSection = activePage?.sections.find((s) => s.id === selectedSectionId);
  const props = (selectedSection?.props || {}) as Record<string, any>;

  const handleTextChange = (propKey: string, value: string) => {
    if (!selectedSection) return;

    const result = updateWebsiteSection(document, activeSlug, selectedSection.id, {
      propsPatch: {
        [propKey]: value,
      },
    });

    if (result.success) {
      onUpdateDocument(result.updatedDoc, `Edited ${propKey} on ${selectedSection.type}`);
    }
  };

  const handleToggleVisibility = () => {
    if (!selectedSection) return;
    const newVisibility = !selectedSection.visible;

    const result = updateWebsiteSection(document, activeSlug, selectedSection.id, {
      visible: newVisibility,
    });

    if (result.success) {
      onUpdateDocument(result.updatedDoc, `${newVisibility ? 'Showed' : 'Hid'} section ${selectedSection.type}`);
    }
  };

  const handleSurfaceStyleChange = (style: any) => {
    if (!selectedSection) return;

    const result = updateWebsiteSection(document, activeSlug, selectedSection.id, {
      styleOverrides: {
        surfaceStyle: style,
      },
    });

    if (result.success) {
      onUpdateDocument(result.updatedDoc, `Changed style to ${style}`);
    }
  };

  return (
    <aside className="builder-sidebar" style={{ borderLeft: '1px solid #334155', background: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#38bdf8' }}>
            ✏️ In-Place Section Editor
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Page: /{activePage?.slug} · Manual edits cost 0 credits
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      {/* Section Selector */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
          SELECT SECTION TO EDIT:
        </label>
        <select
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
          style={{ width: '100%', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 6, padding: '8px 10px', fontSize: '0.85rem' }}
        >
          {activePage?.sections.map((sec, idx) => (
            <option key={sec.id} value={sec.id}>
              {idx + 1}. {sec.type} ({sec.visible ? 'Visible' : 'Hidden'})
            </option>
          ))}
        </select>
      </div>

      {/* Editor Body */}
      {selectedSection && (
        <div style={{ padding: 20, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Visibility and Surface Controls */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #334155' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Visibility:</span>
            <button
              onClick={handleToggleVisibility}
              style={{
                background: selectedSection.visible ? '#065f46' : '#7f1d1d',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '5px 12px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {selectedSection.visible ? '👁 Visible' : '🙈 Hidden'}
            </button>
          </div>

          {/* Card / Tile Surface Style */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
              Card & Tile Style:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {['flat', 'outlined', 'raised', 'tinted'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleSurfaceStyleChange(style)}
                  style={{
                    background: selectedSection.styleOverrides?.surfaceStyle === style ? '#0284c7' : '#0f172a',
                    color: '#fff',
                    border: '1px solid #334155',
                    borderRadius: 4,
                    padding: '6px 4px',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Text Fields based on Props */}
          {props.eyebrow !== undefined && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                Eyebrow
              </label>
              <input
                type="text"
                value={props.eyebrow || ''}
                onChange={(e) => handleTextChange('eyebrow', e.target.value)}
                style={{ width: '100%', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 6, padding: '8px 10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {props.title !== undefined && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                Title
              </label>
              <input
                type="text"
                value={props.title || ''}
                onChange={(e) => handleTextChange('title', e.target.value)}
                style={{ width: '100%', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 6, padding: '8px 10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {props.heading !== undefined && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                Heading
              </label>
              <input
                type="text"
                value={props.heading || ''}
                onChange={(e) => handleTextChange('heading', e.target.value)}
                style={{ width: '100%', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 6, padding: '8px 10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {props.lead !== undefined && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                Lead Paragraph
              </label>
              <textarea
                rows={3}
                value={props.lead || ''}
                onChange={(e) => handleTextChange('lead', e.target.value)}
                style={{ width: '100%', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 6, padding: '8px 10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {props.description !== undefined && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                Description
              </label>
              <textarea
                rows={3}
                value={props.description || ''}
                onChange={(e) => handleTextChange('description', e.target.value)}
                style={{ width: '100%', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 6, padding: '8px 10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div style={{ background: '#0f172a', borderRadius: 6, padding: '10px 12px', fontSize: '0.75rem', color: '#64748b' }}>
            🔒 <strong>Strict Isolation Guard:</strong> Modifying this section preserves all other sections identically.
          </div>
        </div>
      )}
    </aside>
  );
};
