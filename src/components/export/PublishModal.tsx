'use client';

import React, { useState } from 'react';
import { WebsiteDocument } from '@/engine/schemas/website-document';
import { publishWebsiteDocument, PublishResult } from '@/engine/export/publish-adapter';

interface Props {
  isOpen: boolean;
  document: WebsiteDocument;
  onClose: () => void;
}

export const PublishModal: React.FC<Props> = ({ isOpen, document, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  // Run publication verification
  const result: PublishResult = publishWebsiteDocument(document);

  const handleCopyBundle = () => {
    if (result.bundle) {
      navigator.clipboard.writeText(JSON.stringify(result.bundle, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadBundle = () => {
    if (result.bundle) {
      const blob = new Blob([JSON.stringify(result.bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `brandscalers-export-${result.bundle.projectMetadata.projectId}-v${result.version}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', zIndex: 110, padding: 16 }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, width: '100%', maxWidth: 740, color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: result.success ? '#34d399' : '#f87171' }}>
              {result.success ? '🚀 Website Publication Ready' : '⛔ Publication Blocked by QA'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Deterministic Pre-Publish Verification · Version Snapshot v{result.version}.0
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Truthful Demo Mode Notice Banner */}
          <div style={{
            background: result.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${result.success ? '#059669' : '#b91c1c'}`,
            borderRadius: 8,
            padding: '14px 16px',
            fontSize: '0.85rem',
            lineHeight: 1.5,
          }}>
            <div style={{ fontWeight: 700, color: result.success ? '#34d399' : '#f87171', marginBottom: 4 }}>
              {result.success ? '✓ DEMO MODE PUBLISH STATUS: VERIFIED BUNDLE' : '⚠ CRITICAL QA BLOCKERS DETECTED'}
            </div>
            <div style={{ color: '#cbd5e1' }}>
              {result.disclosure}
            </div>
          </div>

          {/* QA Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>QA Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: result.qaReport.overallScore === 100 ? '#34d399' : '#fbbf24' }}>
                {result.qaReport.overallScore}%
              </div>
            </div>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Blockers</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: result.qaReport.blockerCount === 0 ? '#34d399' : '#ef4444' }}>
                {result.qaReport.blockerCount}
              </div>
            </div>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Warnings</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: result.qaReport.warningCount === 0 ? '#34d399' : '#fbbf24' }}>
                {result.qaReport.warningCount}
              </div>
            </div>
          </div>

          {/* Blockers or Warnings List */}
          {!result.success && (
            <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.qaReport.checks.filter(c => !c.passed && c.classification === 'Blocker').map(c => (
                <div key={c.id} style={{ background: '#2d1517', border: '1px solid #7f1d1d', borderRadius: 6, padding: '10px 12px', fontSize: '0.8rem', color: '#fca5a5' }}>
                  <strong>⛔ {c.name}:</strong> {c.message}
                </div>
              ))}
            </div>
          )}

          {result.success && result.bundle && (
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>
                Bundle Metadata:
              </div>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>• Project ID: {result.bundle.projectMetadata.projectId}</div>
                <div>• Design Preset: {result.bundle.projectMetadata.preset} ({result.bundle.projectMetadata.designFamily})</div>
                <div>• Architecture: {result.bundle.projectMetadata.pageCount} Pages · {result.bundle.projectMetadata.totalSections} Sections</div>
                <div>• Published At: {result.publishedAt}</div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 10 }}>
            <button
              onClick={onClose}
              style={{ background: '#334155', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}
            >
              Close
            </button>
            {result.success && (
              <>
                <button
                  onClick={handleCopyBundle}
                  style={{ background: copied ? '#059669' : '#0284c7', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Bundle JSON'}
                </button>
                <button
                  onClick={handleDownloadBundle}
                  style={{ background: downloaded ? '#059669' : '#10b981', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                >
                  {downloaded ? '✓ Downloaded!' : '💾 Download Bundle'}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
