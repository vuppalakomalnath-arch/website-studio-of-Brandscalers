import { z } from 'zod';

// ==========================================
// Safe Action & URL Schema
// ==========================================

export const SafeActionSchema = z.object({
  label: z.string().min(1).max(60),
  type: z.enum(['internal-link', 'tel', 'mailto', 'whatsapp', 'external-link']),
  target: z.string().min(1).refine((val) => {
    const lower = val.trim().toLowerCase();
    // Reject dangerous protocol injections
    if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
      return false;
    }
    return true;
  }, { message: 'Unsafe or disallowed protocol in action target' }),
  style: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
});
export type SafeAction = z.infer<typeof SafeActionSchema>;

// ==========================================
// 12 Core Component Prop Schemas
// ==========================================

// 1. site-header
export const SiteHeaderPropsSchema = z.object({
  businessName: z.string().min(1).max(80),
  tagline: z.string().max(120).optional(),
  logoUrl: z.string().optional(),
  navLinks: z.array(z.object({
    label: z.string().min(1).max(30),
    slug: z.string().min(1),
  })).min(1).max(8),
  cta: SafeActionSchema.optional(),
  phone: z.string().optional(),
});
export type SiteHeaderProps = z.infer<typeof SiteHeaderPropsSchema>;

// 2. hero-split
export const HeroSplitPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  title: z.string().min(1).max(140),
  lead: z.string().min(1).max(400),
  primaryCta: SafeActionSchema,
  secondaryCta: SafeActionSchema.optional(),
  badgeText: z.string().max(60).optional(),
  mediaUrl: z.string().optional(),
  mediaAlt: z.string().optional(),
  stats: z.array(z.object({
    value: z.string().max(30),
    label: z.string().max(50),
  })).max(4).optional(),
});
export type HeroSplitProps = z.infer<typeof HeroSplitPropsSchema>;

// 3. hero-centered
export const HeroCenteredPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  title: z.string().min(1).max(140),
  lead: z.string().min(1).max(400),
  primaryCta: SafeActionSchema,
  secondaryCta: SafeActionSchema.optional(),
  trustMarkers: z.array(z.string()).max(5).optional(),
  backgroundVariant: z.enum(['default', 'surface', 'gradient']).default('default'),
});
export type HeroCenteredProps = z.infer<typeof HeroCenteredPropsSchema>;

// 4. service-grid
export const ServiceGridPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1).max(120),
  subheading: z.string().max(300).optional(),
  services: z.array(z.object({
    id: z.string(),
    title: z.string().min(1).max(80),
    description: z.string().min(1).max(250),
    badge: z.string().max(40).optional(),
    icon: z.string().optional(),
    action: SafeActionSchema.optional(),
  })).min(1).max(12),
  columns: z.enum(['2', '3', '4']).default('3'),
});
export type ServiceGridProps = z.infer<typeof ServiceGridPropsSchema>;

// 5. feature-row
export const FeatureRowPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  bullets: z.array(z.string().max(120)).max(6).optional(),
  cta: SafeActionSchema.optional(),
  mediaUrl: z.string().optional(),
  mediaAlt: z.string().optional(),
  mediaPosition: z.enum(['left', 'right']).default('right'),
});
export type FeatureRowProps = z.infer<typeof FeatureRowPropsSchema>;

// 6. testimonial-list
export const TestimonialListPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1).max(120),
  subheading: z.string().max(300).optional(),
  isDemoData: z.literal(true).default(true), // Mandate demo badge per spec #5
  testimonials: z.array(z.object({
    id: z.string(),
    quote: z.string().min(1).max(350),
    author: z.string().min(1).max(60),
    roleOrContext: z.string().max(80).optional(),
    rating: z.number().int().min(1).max(5).default(5),
    verified: z.boolean().default(false),
  })).min(1).max(8),
});
export type TestimonialListProps = z.infer<typeof TestimonialListPropsSchema>;

// 7. faq-accordion
export const FaqAccordionPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1).max(120),
  subheading: z.string().max(300).optional(),
  items: z.array(z.object({
    id: z.string(),
    question: z.string().min(1).max(150),
    answer: z.string().min(1).max(600),
  })).min(2).max(12),
});
export type FaqAccordionProps = z.infer<typeof FaqAccordionPropsSchema>;

// 8. gallery-grid
export const GalleryGridPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1).max(120),
  subheading: z.string().max(300).optional(),
  items: z.array(z.object({
    id: z.string(),
    title: z.string().max(60).optional(),
    caption: z.string().max(150).optional(),
    mediaUrl: z.string(),
    aspectRatio: z.enum(['1/1', '4/3', '16/9']).default('4/3'),
  })).min(2).max(12),
});
export type GalleryGridProps = z.infer<typeof GalleryGridPropsSchema>;

// 9. call-to-action
export const CallToActionPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(350),
  primaryCta: SafeActionSchema,
  secondaryCta: SafeActionSchema.optional(),
  reassuranceNote: z.string().max(120).optional(),
});
export type CallToActionProps = z.infer<typeof CallToActionPropsSchema>;

// 10. contact-form
export const ContactFormPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1).max(120),
  subheading: z.string().max(300).optional(),
  fields: z.array(z.object({
    name: z.string().regex(/^[a-zA-Z0-9_]+$/),
    label: z.string().min(1).max(50),
    type: z.enum(['text', 'email', 'tel', 'textarea', 'select']),
    required: z.boolean().default(true),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
  })).min(2).max(8),
  submitButtonText: z.string().min(1).max(50).default('Send Message'),
  isDemoMode: z.literal(true).default(true),
  successMessage: z.string().default('Thank you! Your message has been received (Demo Mode).'),
});
export type ContactFormProps = z.infer<typeof ContactFormPropsSchema>;

// 11. location-hours
export const LocationHoursPropsSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  heading: z.string().min(1).max(120),
  address: z.string().min(1).max(200),
  phone: z.string().optional(),
  email: z.string().optional(),
  schedule: z.array(z.object({
    days: z.string().max(40),
    hours: z.string().max(40),
  })).min(1).max(7),
  mapPlaceholderText: z.string().default('Interactive Location Map (Local Preview)'),
});
export type LocationHoursProps = z.infer<typeof LocationHoursPropsSchema>;

// 12. site-footer
export const SiteFooterPropsSchema = z.object({
  businessName: z.string().min(1).max(80),
  tagline: z.string().max(140).optional(),
  copyrightYear: z.number().int().default(new Date().getFullYear()),
  links: z.array(z.object({
    label: z.string().min(1).max(40),
    slug: z.string().min(1),
  })).min(1).max(10),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  demoNotice: z.string().default('Generated by Website Studio 2.0 Vertical Slice'),
});
export type SiteFooterProps = z.infer<typeof SiteFooterPropsSchema>;

// ==========================================
// Discriminated Section Schema
// ==========================================

export const SectionTypeEnum = z.enum([
  'site-header',
  'hero-split',
  'hero-centered',
  'service-grid',
  'feature-row',
  'testimonial-list',
  'faq-accordion',
  'gallery-grid',
  'call-to-action',
  'contact-form',
  'location-hours',
  'site-footer',
]);
export type SectionType = z.infer<typeof SectionTypeEnum>;

export const SectionSchema = z.object({
  id: z.string().min(1),
  type: SectionTypeEnum,
  version: z.number().int().default(1),
  visible: z.boolean().default(true),
  styleOverrides: z.object({
    surfaceStyle: z.enum(['default', 'surface', 'outlined', 'raised', 'flat', 'tinted']).optional(),
    align: z.enum(['left', 'center']).optional(),
    density: z.enum(['airy', 'balanced', 'dense']).optional(),
  }).optional(),
  props: z.record(z.unknown()),
});
export type Section = z.infer<typeof SectionSchema>;

// ==========================================
// Page & Document Schema
// ==========================================

export const PageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lower-case alphanumeric with hyphens'),
  title: z.string().min(1).max(80),
  purpose: z.string().max(200),
  seo: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(200),
  }),
  sections: z.array(SectionSchema).min(1, 'Page must contain at least one section'),
});
export type Page = z.infer<typeof PageSchema>;

export const DesignTokensSchema = z.object({
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  ink: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  bg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  surface: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  footerBg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  font: z.string(),
  headWeight: z.enum(['400', '500', '600', '700', '800']).default('700'),
  headCase: z.enum(['normal', 'uppercase']).default('normal'),
  radius: z.enum(['sharp', 'soft', 'rounded', 'round']).default('soft'),
  buttons: z.enum(['solid', 'outline', 'pill', 'underline']).default('solid'),
  surface_style: z.enum(['flat', 'outlined', 'raised', 'tinted']).default('outlined'),
  images: z.enum(['follow', 'square', 'arch', 'circle']).default('follow'),
  density: z.enum(['airy', 'balanced', 'dense']).default('balanced'),
  align: z.enum(['center', 'left']).default('center'),
  motion: z.enum(['none', 'reveal', 'lift']).default('none'),
  mode: z.enum(['light', 'dark']).default('light'),
});
export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const WebsiteDocumentSchema = z.object({
  schemaVersion: z.literal('1.0').default('1.0'),
  projectId: z.string().min(1),
  businessProfileId: z.string().min(1),
  design: z.object({
    family: z.enum(['local-service', 'editorial', 'modern', 'creative']),
    preset: z.string(),
    tokens: DesignTokensSchema,
  }),
  pages: z.array(PageSchema).min(3, 'Website must contain at least 3 pages (e.g. Home, About, Services, Contact)'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  generation: z.object({
    model: z.string(),
    promptVersion: z.string().default('v1.0'),
    estimatedCredits: z.number().int().min(0).max(250),
    actualCredits: z.number().int().min(0).max(250),
    durationMs: z.number().optional(),
    isMocked: z.boolean().default(false),
  }),
});
export type WebsiteDocument = z.infer<typeof WebsiteDocumentSchema>;

// Validate section props against specific schema
export function validateSectionProps(type: SectionType, props: unknown): z.SafeParseReturnType<unknown, any> {
  switch (type) {
    case 'site-header': return SiteHeaderPropsSchema.safeParse(props);
    case 'hero-split': return HeroSplitPropsSchema.safeParse(props);
    case 'hero-centered': return HeroCenteredPropsSchema.safeParse(props);
    case 'service-grid': return ServiceGridPropsSchema.safeParse(props);
    case 'feature-row': return FeatureRowPropsSchema.safeParse(props);
    case 'testimonial-list': return TestimonialListPropsSchema.safeParse(props);
    case 'faq-accordion': return FaqAccordionPropsSchema.safeParse(props);
    case 'gallery-grid': return GalleryGridPropsSchema.safeParse(props);
    case 'call-to-action': return CallToActionPropsSchema.safeParse(props);
    case 'contact-form': return ContactFormPropsSchema.safeParse(props);
    case 'location-hours': return LocationHoursPropsSchema.safeParse(props);
    case 'site-footer': return SiteFooterPropsSchema.safeParse(props);
    default:
      return {
        success: false as const,
        error: new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            path: ['type'],
            message: `Unsupported component type: ${type}`,
          },
        ]),
      };
  }
}
