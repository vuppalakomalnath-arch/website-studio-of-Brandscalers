import React from 'react';
import { ServiceGridProps, SafeAction } from '../../schemas/website-document';

interface Props {
  props: ServiceGridProps;
  onNavigate: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
}

export const ServiceGrid: React.FC<Props> = ({ props, onNavigate, onAction }) => {
  const colCount = props.columns || '3';
  const gridColumnsStyle = {
    '2': 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    '3': 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    '4': 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
  }[colCount];

  return (
    <section className="sec svcgrid" style={{ padding: 'var(--pad) 16px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px auto' }}>
          {props.eyebrow && (
            <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
              {props.eyebrow}
            </div>
          )}
          <h2 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--ink)', margin: 0 }}>
            {props.heading}
          </h2>
          {props.subheading && (
            <p style={{ fontFamily: 'var(--bf)', fontSize: '1.05rem', color: 'var(--muted)', marginTop: 12, lineHeight: 1.5 }}>
              {props.subheading}
            </p>
          )}
        </div>

        {/* Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: gridColumnsStyle, gap: 24 }}>
          {props.services.map((item) => (
            <div
              key={item.id}
              className="card svcgrid-card"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  {item.icon ? (
                    <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                  ) : (
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', marginTop: 8 }} />
                  )}
                  {item.badge && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--line)' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'var(--hf)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink)', margin: '0 0 10px 0' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'var(--bf)', fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.55, margin: 0 }}>
                  {item.description}
                </p>
              </div>

              {item.action && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                  <button
                    onClick={() => {
                      if (item.action?.type === 'internal-link') onNavigate(item.action.target);
                      else if (onAction && item.action) onAction(item.action);
                    }}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    {item.action.label} →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
