import React from 'react';
import { HeroSplitProps, SafeAction } from '../../schemas/website-document';

interface Props {
  props: HeroSplitProps;
  onNavigate: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
}

export const HeroSplit: React.FC<Props> = ({ props, onNavigate, onAction }) => {
  const handleAction = (action: SafeAction) => {
    if (action.type === 'internal-link') {
      onNavigate(action.target);
    } else if (onAction) {
      onAction(action);
    }
  };

  return (
    <section className="sec hero hero-split surface" style={{ padding: 'var(--pad) 16px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '36px', alignItems: 'center' }}>
        {/* Left Copy */}
        <div className="hero-copy" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {props.eyebrow && (
            <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              {props.eyebrow}
            </div>
          )}
          <h1 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.15, color: 'var(--ink)', margin: 0 }}>
            {props.title}
          </h1>
          <p style={{ fontFamily: 'var(--bf)', fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
            {props.lead}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginTop: '8px' }}>
            <button
              onClick={() => handleAction(props.primaryCta)}
              className="btn btn-primary"
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 'none',
                borderRadius: 'var(--r-sm)',
                padding: '14px 28px',
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
                className="btn btn-secondary"
                style={{
                  background: 'transparent',
                  color: 'var(--ink)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)',
                  padding: '14px 24px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {props.secondaryCta.label}
              </button>
            )}
          </div>

          {/* Stats Bar */}
          {props.stats && props.stats.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${props.stats.length}, 1fr)`, gap: '20px', paddingTop: '24px', borderTop: '1px solid var(--line)', marginTop: '16px' }}>
              {props.stats.map((s, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--hf)' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Media */}
        <div style={{ position: 'relative' }}>
          <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid var(--line)', background: 'var(--surface)' }}>
            {props.mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={props.mediaUrl}
                alt={props.mediaAlt || props.title}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
              />
            ) : (
              <div style={{ height: 380, display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--muted)' }}>
                <span>[Featured Business Image]</span>
              </div>
            )}
          </div>
          {props.badgeText && (
            <div style={{ position: 'absolute', bottom: -16, right: 24, background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 18px', borderRadius: 'var(--r-sm)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>
              ⭐ {props.badgeText}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
