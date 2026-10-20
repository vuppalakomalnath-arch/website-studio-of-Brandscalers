import React from 'react';
import { CallToActionProps, SafeAction } from '../../schemas/website-document';

interface Props {
  props: CallToActionProps;
  onNavigate: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
}

export const CallToAction: React.FC<Props> = ({ props, onNavigate, onAction }) => {
  const handleAction = (action: SafeAction) => {
    if (action.type === 'internal-link') {
      onNavigate(action.target);
    } else if (onAction) {
      onAction(action);
    }
  };

  return (
    <section className="sec cta surface" style={{ padding: 'calc(var(--pad) * 1.1) 24px', background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {props.eyebrow && (
          <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {props.eyebrow}
          </div>
        )}
        <h2 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--ink)', margin: 0, lineHeight: 1.2 }}>
          {props.title}
        </h2>
        <p style={{ fontFamily: 'var(--bf)', fontSize: '1.15rem', color: 'var(--muted)', maxWidth: 640, margin: 0, lineHeight: 1.6 }}>
          {props.description}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
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

        {props.reassuranceNote && (
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 8 }}>
            🔒 {props.reassuranceNote}
          </div>
        )}
      </div>
    </section>
  );
};
