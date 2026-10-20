import { z } from 'zod';

export const PrimaryGoalEnum = z.enum([
  'enquiries',
  'calls',
  'whatsapp',
  'bookings_external',
  'portfolio',
  'brand',
  'catalogue',
]);
export type PrimaryGoal = z.infer<typeof PrimaryGoalEnum>;

export const ServiceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  price: z.string().optional(),
  source: z.enum(['user', 'verified_existing_site', 'ai_draft']).default('user'),
});
export type ServiceItem = z.infer<typeof ServiceItemSchema>;

export const ContactInfoSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  hours: z.string().optional(),
});
export type ContactInfo = z.infer<typeof ContactInfoSchema>;

export const AssetSchema = z.object({
  id: z.string(),
  kind: z.enum(['logo', 'photo', 'document']),
  source: z.enum(['user', 'stock', 'demo']),
  url: z.string(),
  alt: z.string().optional(),
  attribution: z.string().optional(),
});
export type Asset = z.infer<typeof AssetSchema>;

export const SocialLinksSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
}).optional();

export const ReferenceSiteSchema = z.object({
  url: z.string().optional(),
  preferredElements: z.string().optional(),
  notes: z.string().optional(),
}).optional();

export const CategorySpecificsSchema = z.object({
  category: z.string().optional(),
  // Restaurant
  cuisine: z.string().optional(),
  menuHighlights: z.string().optional(),
  dietaryAccommodations: z.string().optional(),
  deliveryLinks: z.string().optional(),
  reservationLink: z.string().optional(),
  // Healthcare
  treatments: z.string().optional(),
  credentials: z.string().optional(),
  acceptedInsurance: z.string().optional(),
  emergencyDisclaimer: z.string().optional(),
  // Agency
  specializedPackages: z.string().optional(),
  targetIndustries: z.string().optional(),
  caseStudies: z.string().optional(),
  // Portfolio
  creatorRole: z.string().optional(),
  skills: z.string().optional(),
  featuredProjects: z.string().optional(),
  // Retail
  catalogCategories: z.string().optional(),
  featuredProducts: z.string().optional(),
  priceDisplayPreference: z.string().optional(),
  orderFlow: z.string().optional(),
  // Education
  coursesOffered: z.string().optional(),
  targetAgeGroups: z.string().optional(),
  deliveryFormat: z.string().optional(),
  facultyCredentials: z.string().optional(),
  // Local Services
  serviceRadius: z.string().optional(),
  emergencyAvailability: z.string().optional(),
  licensingWarranty: z.string().optional(),
}).optional();

export const BusinessProfileSchema = z.object({
  schemaVersion: z.literal('1.0').default('1.0'),
  businessName: z.string().min(1, 'Business name is required').max(120),
  businessType: z.string().min(1, 'Business type is required'),
  primaryGoal: PrimaryGoalEnum.default('enquiries'),
  targetAudience: z.string().default('Local clients and customers'),
  location: z.string().optional(),
  serviceArea: z.array(z.string()).optional(),
  servicesOrProducts: z.array(ServiceItemSchema).min(1, 'At least one service or product is required'),
  differentiators: z.array(z.string()).optional(),
  preferredDesignDirection: z.enum(['local-service', 'editorial', 'modern', 'creative', 'choose_for_me']).default('choose_for_me'),
  requiredPages: z.array(z.string()).default(['home', 'about', 'services', 'contact']),
  contactMethod: z.enum(['form', 'phone', 'whatsapp', 'booking_link']).default('form'),
  contact: ContactInfoSchema.optional(),
  brand: z.object({
    colors: z.array(z.string()).optional(),
    fontPreference: z.string().optional(),
    tone: z.string().optional(),
    logoAssetId: z.string().optional(),
  }).optional(),
  assets: z.array(AssetSchema).default([]),
  businessDescription: z.string().optional(),
  existingWebsiteUrl: z.string().optional(),
  referenceSite: ReferenceSiteSchema,
  socialLinks: SocialLinksSchema,
  proofPoints: z.array(z.string()).optional(),
  requiredIntegrations: z.array(z.string()).optional(),
  categorySpecifics: CategorySpecificsSchema,
  additionalNotes: z.string().optional(),
});

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;

