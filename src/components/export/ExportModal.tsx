'use client';

import React, { useState } from 'react';
import { WebsiteDocument } from '@/engine/schemas/website-document';
import { exportWebsiteDocument } from '@/engine/export/export-project';

interface Props {
  isOpen: boolean;
  document: WebsiteDocument;
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ isOpen, document, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bundle = exportWebsiteDocument(document);
  const jsonString = JSON.stringify(bundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 16 }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, width: '100%', maxWidth: 720, color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#38bdf8' }}>
              📦 Export Integration Bundle
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Studio 2.0 Integration Contract · Schema Version 1.0
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, padding: '12px 14px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <strong>Contract Compliance:</strong> This JSON document is fully serializable, versioned, and decouples the generation engine from the renderer. Existing Website Studio can adopt this schema behind an adapter without modifying its production database.
          </div>

          <pre style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: 6, padding: 16, maxHeight: 340, overflowY: 'auto', fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'monospace' }}>
            {jsonString}
          </pre>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {bundle.projectMetadata.pageCount} pages · {bundle.projectMetadata.totalSections} sections · {bundle.projectMetadata.designFamily}
            </span>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                style={{ background: '#334155', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}
              >
                Close
              </button>
              <button
                onClick={handleCopy}
                style={{ background: copied ? '#059669' : '#0284c7', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
              >
                {copied ? '✓ Copied to Clipboard!' : '📋 Copy JSON Bundle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
