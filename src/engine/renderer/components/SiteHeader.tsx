import React, { useState } from 'react';
import { SiteHeaderProps, SafeAction } from '../../schemas/website-document';

interface Props {
  props: SiteHeaderProps;
  activeSlug: string;
  onNavigate: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
}

export const SiteHeader: React.FC<Props> = ({ props, activeSlug, onNavigate, onAction }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(slug);
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    if (!props.cta) return;
    e.preventDefault();
    if (props.cta.type === 'internal-link') {
      onNavigate(props.cta.target);
    } else if (onAction) {
      onAction(props.cta);
    }
  };

  return (
    <header className="hdr" style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 40, width: '100%' }}>
      <div className="hdr-bar" style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        {/* Brand / Logo */}
        <a
          href={`#${props.navLinks[0]?.slug || 'home'}`}
          onClick={(e) => handleNavClick(e, props.navLinks[0]?.slug || 'home')}
          className="brand"
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', minWidth: 0, flexShrink: 1 }}
        >
          <span className="brand-name" style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', color: 'var(--ink)' }}>
            {props.businessName}
          </span>
          {props.tagline && (
            <span className="brand-tagline">
              {props.tagline}
            </span>
          )}
        </a>

        {/* Desktop Navigation */}
        <nav className="hdr-nav">
          {props.navLinks.map((link) => {
            const isActive = activeSlug === link.slug;
            return (
              <a
                key={link.slug}
                href={`#${link.slug}`}
                onClick={(e) => handleNavClick(e, link.slug)}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent)' : 'var(--ink)',
                  borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  paddingBottom: 4,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* CTA and Phone */}
        <div className="hdr-actions" style={{ display: 'flex', alignItems: 'center' }}>
          {props.phone && (
            <a
              href={`tel:${props.phone.replace(/\s+/g, '')}`}
              style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap' }}
              className="hdr-phone"
            >
              📞 {props.phone}
            </a>
          )}
          {props.cta && (
            <button
              onClick={handleCtaClick}
              className="btn btn-primary"
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 'none',
                borderRadius: 'var(--r-sm)',
                padding: '10px 18px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {props.cta.label}
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {props.navLinks.map((link) => (
            <a
              key={link.slug}
              href={`#${link.slug}`}
              onClick={(e) => handleNavClick(e, link.slug)}
              style={{ textDecoration: 'none', color: activeSlug === link.slug ? 'var(--accent)' : 'var(--ink)', fontWeight: 500, padding: '4px 0' }}
            >
              {link.label}
            </a>
          ))}
          {props.phone && (
            <a
              href={`tel:${props.phone.replace(/\s+/g, '')}`}
              style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '0.95rem', paddingTop: 6 }}
            >
              📞 {props.phone}
            </a>
          )}
        </div>
      )}
    </header>
  );
};
