import React from 'react';
import { SiteFooterProps } from '../../schemas/website-document';

interface Props {
  props: SiteFooterProps;
  onNavigate: (slug: string) => void;
}

export const SiteFooter: React.FC<Props> = ({ props, onNavigate }) => {
  return (
    <footer
      className="ftr"
      style={{
        background: 'var(--footer-bg)',
        color: 'var(--footer-ink)',
        padding: '56px 24px 32px 24px',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          {/* Brand info */}
          <div>
            <h3 style={{ fontFamily: 'var(--hf)', fontSize: '1.25rem', margin: '0 0 10px 0', color: 'inherit' }}>
              {props.businessName}
            </h3>
            {props.tagline && (
              <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {props.tagline}
              </p>
            )}
            {props.address && (
              <p style={{ fontSize: '0.85rem', opacity: 0.75, margin: 0 }}>
                📍 {props.address}
              </p>
            )}
          </div>

          {/* Nav links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {props.links.map((link) => (
                <li key={link.slug}>
                  <a
                    href={`#${link.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.slug);
                    }}
                    style={{ textDecoration: 'none', color: 'inherit', opacity: 0.8, fontSize: '0.9rem' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', opacity: 0.85 }}>
              {props.phone && <div>📞 {props.phone}</div>}
              {props.email && <div>✉️ {props.email}</div>}
              <div style={{ marginTop: 8, fontSize: '0.8rem', opacity: 0.7 }}>
                {props.demoNotice}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
          <div>
            © {props.copyrightYear} {props.businessName}. All rights reserved.
          </div>
          <div>
            Website Studio 2.0 Vertical Slice · Isolated Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};
