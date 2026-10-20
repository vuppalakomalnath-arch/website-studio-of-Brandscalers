import React from 'react';
import { FeatureRowProps, SafeAction } from '../../schemas/website-document';

interface Props {
  props: FeatureRowProps;
  onNavigate: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
}

export const FeatureRow: React.FC<Props> = ({ props, onNavigate, onAction }) => {
  const isMediaLeft = props.mediaPosition === 'left';

  return (
    <section className="sec featrow" style={{ padding: 'var(--pad) 24px', background: 'var(--bg)' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
          alignItems: 'center',
        }}
      >
        {/* Media Block (ordered first if media is on left) */}
        <div style={{ order: isMediaLeft ? 1 : 2 }}>
          <div
            style={{
              borderRadius: 'var(--r)',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(0,0,0,0.06)',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
            }}
          >
            {props.mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={props.mediaUrl}
                alt={props.mediaAlt || props.title}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
              />
            ) : (
              <div style={{ height: 320, display: 'grid', placeItems: 'center', color: 'var(--muted)', background: 'var(--surface)' }}>
                <span>[Feature Image]</span>
              </div>
            )}
          </div>
        </div>

        {/* Text Copy */}
        <div style={{ order: isMediaLeft ? 2 : 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {props.eyebrow && (
            <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              {props.eyebrow}
            </div>
          )}
          <h2 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', color: 'var(--ink)', margin: 0, lineHeight: 1.25 }}>
            {props.title}
          </h2>
          <p style={{ fontFamily: 'var(--bf)', fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
            {props.description}
          </p>

          {/* Bullets */}
          {props.bullets && props.bullets.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {props.bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.95rem', color: 'var(--ink)' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {props.cta && (
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => {
                  if (props.cta?.type === 'internal-link') onNavigate(props.cta.target);
                  else if (onAction && props.cta) onAction(props.cta);
                }}
                className="btn btn-primary"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  border: 'none',
                  borderRadius: 'var(--r-sm)',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {props.cta.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
