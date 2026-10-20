import React, { useState } from 'react';
import { FaqAccordionProps } from '../../schemas/website-document';

interface Props {
  props: FaqAccordionProps;
}

export const FaqAccordion: React.FC<Props> = ({ props }) => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [props.items[0]?.id || '']: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="sec faq" style={{ padding: 'var(--pad) 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
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

        {/* Accordion Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {props.items.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)',
                  background: isOpen ? 'var(--surface)' : 'var(--bg)',
                  overflow: 'hidden',
                  transition: 'background 0.15s ease',
                }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'var(--hf)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  <span>{item.question}</span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--accent)', marginLeft: 16 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px 24px', fontFamily: 'var(--bf)', fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--muted)' }}>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
