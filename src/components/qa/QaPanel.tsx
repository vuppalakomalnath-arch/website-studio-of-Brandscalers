'use client';

import React from 'react';
import { WebsiteDocument } from '@/engine/schemas/website-document';
import { runWebsiteQa, QaReport } from '@/engine/qa/checks';

interface Props {
  document: WebsiteDocument;
  onClose: () => void;
}

export const QaPanel: React.FC<Props> = ({ document, onClose }) => {
  const report: QaReport = runWebsiteQa(document);

  return (
    <aside className="builder-sidebar" style={{ borderLeft: '1px solid #334155', background: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#38bdf8' }}>
            🔍 Deterministic QA Engine
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Automated verification against AC-01 to AC-13
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      {/* Score Summary */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>OVERALL QA SCORE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: report.overallScore === 100 ? '#10b981' : '#f59e0b' }}>
            {report.overallScore}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {report.passedCount} of {report.totalChecks} checks passed
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>PUBLISH GATE</div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 4,
              padding: '6px 14px',
              borderRadius: 6,
              fontWeight: 800,
              fontSize: '0.95rem',
              background: report.canPublish ? '#065f46' : '#7f1d1d',
              color: '#fff',
            }}
          >
            {report.canPublish ? 'READY TO PUBLISH' : 'BLOCKED'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            {report.blockerCount} Blockers · {report.warningCount} Warnings
          </div>
        </div>
      </div>

      {/* Checks List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {report.checks.map((check) => {
          const badgeBg = !check.passed
            ? check.classification === 'Blocker'
              ? 'rgba(239, 68, 68, 0.2)'
              : 'rgba(245, 158, 11, 0.2)'
            : 'rgba(16, 185, 129, 0.2)';

          const badgeColor = !check.passed
            ? check.classification === 'Blocker'
              ? '#f87171'
              : '#fbbf24'
            : '#34d399';

          return (
            <div
              key={check.id}
              style={{
                padding: '12px 14px',
                borderRadius: 6,
                background: '#0f172a',
                border: check.passed
                  ? '1px solid #334155'
                  : check.classification === 'Blocker'
                  ? '1px solid #ef4444'
                  : '1px solid #f59e0b',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  {check.name}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: badgeBg,
                    color: badgeColor,
                    textTransform: 'uppercase',
                  }}
                >
                  {check.passed ? 'PASS' : check.classification}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: check.passed ? '#94a3b8' : check.classification === 'Blocker' ? '#fca5a5' : '#fde68a', lineHeight: 1.4 }}>
                {check.message}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
