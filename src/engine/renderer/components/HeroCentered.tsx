import React from 'react';
import { HeroCenteredProps, SafeAction } from '../../schemas/website-document';

interface Props {
  props: HeroCenteredProps;
  onNavigate: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
}

export const HeroCentered: React.FC<Props> = ({ props, onNavigate, onAction }) => {
  const handleAction = (action: SafeAction) => {
    if (action.type === 'internal-link') {
      onNavigate(action.target);
    } else if (onAction) {
      onAction(action);
    }
  };

  const isSurface = props.backgroundVariant === 'surface';

  return (
    <section
      className={`sec hero hero-center ${isSurface ? 'surface' : ''}`}
      style={{
        padding: 'calc(var(--pad) * 1.2) 24px',
        background: isSurface ? 'var(--surface)' : 'var(--bg)',
        borderBottom: '1px solid var(--line)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {props.eyebrow && (
          <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {props.eyebrow}
          </div>
        )}
        <h1 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', lineHeight: 1.15, color: 'var(--ink)', margin: 0 }}>
          {props.title}
        </h1>
        <p style={{ fontFamily: 'var(--bf)', fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--muted)', maxWidth: 680, margin: 0 }}>
          {props.lead}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <button
            onClick={() => handleAction(props.primaryCta)}
            className="btn btn-primary"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              border: 'none',
              borderRadius: 'var(--r-sm)',
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {props.primaryCta.label}
          </button>
          {props.secondaryCta && (
            <button
              onClick={() => handleAction(props.secondaryCta!)}
              className="btn btn-outline"
              style={{
                background: 'transparent',
                color: 'var(--ink)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-sm)',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {props.secondaryCta.label}
            </button>
          )}
        </div>

        {/* Trust Markers */}
        {props.trustMarkers && props.trustMarkers.length > 0 && (
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            {props.trustMarkers.map((marker, i) => (
              <span key={i} style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                ✓ {marker}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
