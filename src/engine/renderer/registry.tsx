import React from 'react';
import {
  SectionType,
  SafeAction,
  validateSectionProps,
} from '../schemas/website-document';
import { SiteHeader } from './components/SiteHeader';
import { HeroSplit } from './components/HeroSplit';
import { HeroCentered } from './components/HeroCentered';
import { ServiceGrid } from './components/ServiceGrid';
import { FeatureRow } from './components/FeatureRow';
import { TestimonialList } from './components/TestimonialList';
import { FaqAccordion } from './components/FaqAccordion';
import { GalleryGrid } from './components/GalleryGrid';
import { CallToAction } from './components/CallToAction';
import { ContactForm } from './components/ContactForm';
import { LocationHours } from './components/LocationHours';
import { SiteFooter } from './components/SiteFooter';

export interface ComponentRenderContext {
  activeSlug: string;
  onNavigate: (slug: string) => void;
  onAction?: (action: SafeAction) => void;
}

export interface RegistryEntry {
  type: SectionType;
  title: string;
  description: string;
  render: (props: any, context: ComponentRenderContext) => React.ReactNode;
}

export const COMPONENT_REGISTRY: Record<SectionType, RegistryEntry> = {
  'site-header': {
    type: 'site-header',
    title: 'Site Header & Navigation',
    description: 'Header with business logo, nav links, CTA button, and mobile menu.',
    render: (props, ctx) => (
      <SiteHeader
        props={props}
        activeSlug={ctx.activeSlug}
        onNavigate={ctx.onNavigate}
        onAction={ctx.onAction}
      />
    ),
  },
  'hero-split': {
    type: 'hero-split',
    title: 'Hero Split (Content & Media)',
    description: 'Two-column hero with headline, lead, dual CTAs, stats, and offset media.',
    render: (props, ctx) => (
      <HeroSplit
        props={props}
        onNavigate={ctx.onNavigate}
        onAction={ctx.onAction}
      />
    ),
  },
  'hero-centered': {
    type: 'hero-centered',
    title: 'Hero Centered (Impact Statement)',
    description: 'Center-aligned bold headline, lead copy, trust badges, and dual CTA buttons.',
    render: (props, ctx) => (
      <HeroCentered
        props={props}
        onNavigate={ctx.onNavigate}
        onAction={ctx.onAction}
      />
    ),
  },
  'service-grid': {
    type: 'service-grid',
    title: 'Service & Offering Grid',
    description: 'Responsive cards showcasing offerings with badges, descriptions, and links.',
    render: (props, ctx) => (
      <ServiceGrid
        props={props}
        onNavigate={ctx.onNavigate}
        onAction={ctx.onAction}
      />
    ),
  },
  'feature-row': {
    type: 'feature-row',
    title: 'Feature & Narrative Row',
    description: 'Alternating story section with media, headline, paragraph, and bullet points.',
    render: (props, ctx) => (
      <FeatureRow
        props={props}
        onNavigate={ctx.onNavigate}
        onAction={ctx.onAction}
      />
    ),
  },
  'testimonial-list': {
    type: 'testimonial-list',
    title: 'Client & Patient Testimonials',
    description: 'Quote cards with author attribution, star ratings, and explicit demo data warning.',
    render: (props) => <TestimonialList props={props} />,
  },
  'faq-accordion': {
    type: 'faq-accordion',
    title: 'FAQ Accordion',
    description: 'Accessible question & answer accordion with expand/collapse interaction.',
    render: (props) => <FaqAccordion props={props} />,
  },
  'gallery-grid': {
    type: 'gallery-grid',
    title: 'Media & Portfolio Gallery',
    description: 'Showcase grid with aspect-ratio preservation and captions.',
    render: (props) => <GalleryGrid props={props} />,
  },
  'call-to-action': {
    type: 'call-to-action',
    title: 'Call to Action Banner',
    description: 'High-conversion banner with primary and secondary action triggers.',
    render: (props, ctx) => (
      <CallToAction
        props={props}
        onNavigate={ctx.onNavigate}
        onAction={ctx.onAction}
      />
    ),
  },
  'contact-form': {
    type: 'contact-form',
    title: 'Interactive Contact Form',
    description: 'Validated form with truthful client-side submission and demo feedback.',
    render: (props) => <ContactForm props={props} />,
  },
  'location-hours': {
    type: 'location-hours',
    title: 'Location & Operating Hours',
    description: 'Practice address, phone, weekly schedule table, and map card.',
    render: (props) => <LocationHours props={props} />,
  },
  'site-footer': {
    type: 'site-footer',
    title: 'Site Footer',
    description: 'Navigation sitemap, copyright notice, contact details, and demo notice.',
    render: (props, ctx) => <SiteFooter props={props} onNavigate={ctx.onNavigate} />,
  },
};

export function renderSection(
  type: SectionType,
  props: unknown,
  context: ComponentRenderContext
): React.ReactNode {
  const entry = COMPONENT_REGISTRY[type];
  if (!entry) {
    return (
      <div style={{ padding: 24, background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', margin: '16px auto', maxWidth: 800, borderRadius: 8 }}>
        <strong>Render Error:</strong> Unknown or unregistered component type &quot;{type}&quot;.
      </div>
    );
  }

  // Validate props with schema
  const validation = validateSectionProps(type, props);
  if (!validation.success) {
    return (
      <div style={{ padding: 24, background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', margin: '16px auto', maxWidth: 800, borderRadius: 8 }}>
        <strong>Validation Error in {type}:</strong> {validation.error?.message || 'Invalid props'}
      </div>
    );
  }

  return entry.render(validation.data, context);
}
