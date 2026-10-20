import React from 'react';
import { GalleryGridProps } from '../../schemas/website-document';

interface Props {
  props: GalleryGridProps;
}

export const GalleryGrid: React.FC<Props> = ({ props }) => {
  return (
    <section className="sec gallery" style={{ padding: 'var(--pad) 24px', background: 'var(--bg)' }}>
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
          {props.subheading && (
            <p style={{ fontFamily: 'var(--bf)', fontSize: '1rem', color: 'var(--muted)', marginTop: 8 }}>
              {props.subheading}
            </p>
          )}
        </div>

        {/* Media Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {props.items.map((item) => (
            <div
              key={item.id}
              style={{
                borderRadius: 'var(--r)',
                overflow: 'hidden',
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ aspectRatio: item.aspectRatio || '4/3', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.mediaUrl}
                  alt={item.title || 'Gallery image'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                />
              </div>
              {(item.title || item.caption) && (
                <div style={{ padding: '16px 20px' }}>
                  {item.title && (
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', marginBottom: 4 }}>
                      {item.title}
                    </div>
                  )}
                  {item.caption && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                      {item.caption}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
