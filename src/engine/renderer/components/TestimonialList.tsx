import React from 'react';
import { TestimonialListProps } from '../../schemas/website-document';

interface Props {
  props: TestimonialListProps;
}

export const TestimonialList: React.FC<Props> = ({ props }) => {
  return (
    <section className="sec testi surface" style={{ padding: 'var(--pad) 24px', background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(234, 179, 8, 0.15)', color: '#b45309', border: '1px solid rgba(234, 179, 8, 0.4)', borderRadius: 999, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: 12, letterSpacing: '0.04em' }}>
            ⚠ DEMO DATA · Unverified Sample Reviews
          </div>
          {props.eyebrow && (
            <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
              {props.eyebrow}
            </div>
          )}
          <h2 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', color: 'var(--ink)', margin: 0 }}>
            {props.heading}
          </h2>
          {props.subheading && (
            <p style={{ fontFamily: 'var(--bf)', fontSize: '1rem', color: 'var(--muted)', marginTop: 8 }}>
              {props.subheading}
            </p>
          )}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
          {props.testimonials.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{
                background: 'var(--bg)',
                borderRadius: 'var(--r)',
                border: '1px solid var(--line)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                <div style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: 12 }}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <blockquote style={{ margin: 0, padding: 0, fontFamily: 'var(--bf)', fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--ink)', fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>
                    {t.author}
                  </div>
                  {t.roleOrContext && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                      {t.roleOrContext}
                    </div>
                  )}
                </div>
                {t.verified && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, background: 'var(--surface)', padding: '2px 8px', borderRadius: 4 }}>
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
