import React from 'react';
import { LocationHoursProps } from '../../schemas/website-document';

interface Props {
  props: LocationHoursProps;
}

export const LocationHours: React.FC<Props> = ({ props }) => {
  return (
    <section className="sec lochrs" style={{ padding: 'var(--pad) 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px auto' }}>
          {props.eyebrow && (
            <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
              {props.eyebrow}
            </div>
          )}
          <h2 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', color: 'var(--ink)', margin: 0 }}>
            {props.heading}
          </h2>
        </div>

        {/* Two-column layout: Info & Schedule + Map Block */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 24, alignItems: 'stretch' }}>
          {/* Address & Hours Card */}
          <div
            className="card"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--r)',
              border: '1px solid var(--line)',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--hf)', fontSize: '1.25rem', color: 'var(--ink)', margin: '0 0 16px 0' }}>
                Practice Address & Contact
              </h3>
              <p style={{ fontFamily: 'var(--bf)', fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                📍 {props.address}
              </p>
              {props.phone && (
                <p style={{ margin: '0 0 10px 0' }}>
                  <a href={`tel:${props.phone.replace(/\s+/g, '')}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                    📞 {props.phone}
                  </a>
                </p>
              )}
              {props.email && (
                <p style={{ margin: 0 }}>
                  <a href={`mailto:${props.email}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                    ✉️ {props.email}
                  </a>
                </p>
              )}
            </div>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              <h4 style={{ fontFamily: 'var(--hf)', fontSize: '1rem', color: 'var(--ink)', margin: '0 0 14px 0' }}>
                Operating Hours
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {props.schedule.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: 4, borderBottom: '1px dashed var(--line)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{item.days}</span>
                    <span style={{ color: 'var(--muted)' }}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Map Block */}
          <div
            style={{
              borderRadius: 'var(--r)',
              overflow: 'hidden',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              position: 'relative',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗺️</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--ink)', marginBottom: 8 }}>
              Interactive Location Map
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', maxWidth: 380, lineHeight: 1.5 }}>
              {props.mapPlaceholderText}
            </div>
            <div style={{ marginTop: 24 }}>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(props.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
