import { DesignTokens } from '../schemas/website-document';

export interface FontPair {
  head: string;
  body: string;
  label: string;
}

export const FONT_PAIRS: Record<string, FontPair> = {
  'inter':          { head: 'Inter',               body: 'Inter',          label: 'Clean sans (Inter)' },
  'playfair-inter': { head: 'Playfair Display',    body: 'Inter',          label: 'Classic serif + sans' },
  'cormorant-jost': { head: 'Cormorant Garamond',  body: 'Jost',           label: 'Elegant serif + geometric' },
  'poppins':        { head: 'Poppins',             body: 'Poppins',        label: 'Friendly rounded (Poppins)' },
  'dmserif-dmsans': { head: 'DM Serif Display',    body: 'DM Sans',        label: 'Bold serif + soft sans' },
  'space-inter':    { head: 'Space Grotesk',       body: 'Inter',          label: 'Tech grotesque' },
  'fraunces-work':  { head: 'Fraunces',            body: 'Work Sans',      label: 'Warm editorial' },
  'montserrat-open':{ head: 'Montserrat',          body: 'Open Sans',      label: 'Corporate (Montserrat)' },
  'figtree':        { head: 'Figtree',             body: 'Figtree',        label: 'Modern clinic (Figtree)' },
};

export const RADIUS: Record<string, string> = {
  sharp: '0px',
  soft: '10px',
  rounded: '20px',
  round: '32px',
};

export const RADIUS_SM: Record<string, string> = {
  sharp: '0px',
  soft: '6px',
  rounded: '12px',
  round: '18px',
};

export const PAD: Record<string, string> = {
  airy: '104px',
  balanced: '64px',
  dense: '40px',
};

export function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return 1;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function resolvePalette(d: DesignTokens) {
  const lum = luminance(d.bg);
  if (d.mode === 'dark' && lum > 0.4) {
    return { bg: '#0f1012', ink: '#eceae4', surface: '#1a1b1f', footerBg: '#08080a' };
  }
  if (d.mode !== 'dark' && lum < 0.18) {
    return { bg: '#ffffff', ink: '#1a1a1a', surface: '#f4f4f4', footerBg: '#161616' };
  }
  return { bg: d.bg, ink: d.ink, surface: d.surface, footerBg: d.footerBg };
}

export function designToVars(design: DesignTokens): {
  vars: Record<string, string>;
  attrs: Record<string, string>;
} {
  const f = FONT_PAIRS[design.font] || FONT_PAIRS.figtree;
  const dark = design.mode === 'dark';
  const p = resolvePalette(design);

  const vars: Record<string, string> = {
    '--accent': design.accent,
    '--ink': p.ink,
    '--bg': p.bg,
    '--surface': p.surface,
    '--footer-bg': p.footerBg,
    '--accent-ink': luminance(design.accent) > 0.42 ? '#111111' : '#ffffff',
    '--accent-fg': dark
      ? `color-mix(in srgb, ${design.accent} 58%, #ffffff)`
      : `color-mix(in srgb, ${design.accent} 82%, ${p.ink})`,
    '--footer-ink': luminance(p.footerBg) < 0.4 ? '#f5f3ee' : '#222222',
    '--muted': `color-mix(in srgb, ${p.ink} 64%, ${p.bg})`,
    '--line': `color-mix(in srgb, ${p.ink} 15%, transparent)`,
    '--r': RADIUS[design.radius] || RADIUS.soft,
    '--r-sm': RADIUS_SM[design.radius] || RADIUS_SM.soft,
    '--pad': PAD[design.density] || PAD.balanced,
    '--hf': `'${f.head}', Georgia, serif`,
    '--bf': `'${f.body}', system-ui, sans-serif`,
    '--hw': design.headWeight,
  };

  const attrs: Record<string, string> = {
    'data-buttons': design.buttons,
    'data-cards': design.surface_style,
    'data-images': design.images,
    'data-density': design.density,
    'data-align': design.align,
    'data-motion': design.motion,
    'data-case': design.headCase,
    'data-mode': design.mode,
  };

  return { vars, attrs };
}
