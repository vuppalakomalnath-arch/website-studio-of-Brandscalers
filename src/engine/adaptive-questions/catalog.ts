import { AdaptiveQuestion } from '../schemas/adaptive-question';
import { BusinessInference } from '../schemas/inference';

export const QUESTION_CATALOG: AdaptiveQuestion[] = [
  // --- HEALTHCARE ---
  {
    id: 'hc_treatments',
    label: 'Clinical Treatments & Specialties',
    explanation: 'List the medical or clinical treatments your practice provides.',
    type: 'textarea',
    required: true,
    whyNeeded: 'Determines the service grid items and treatment matrix on the services page.',
    affectedPlanFields: ['pages.services.sections.service-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'Spinal Rehabilitation\nSports Injury Therapy\nJoint Mobilization & Post-Op Recovery',
  },
  {
    id: 'hc_credentials',
    label: 'Practitioner Credentials & Registrations',
    explanation: 'Approved professional bodies (e.g. HCPC, Chartered Physiotherapist, GMC, ADA).',
    type: 'text',
    required: false,
    whyNeeded: 'Builds clinical trust in the feature-row section without fake claims.',
    affectedPlanFields: ['pages.home.sections.feature-row'],
    aiCallPolicy: 'never',
    defaultValue: 'HCPC Registered Practitioners, MCSP Chartered Physiotherapists',
  },
  {
    id: 'hc_appointment_method',
    label: 'Primary Appointment Intake Method',
    explanation: 'How should patients request or book appointments?',
    type: 'radio',
    options: [
      { label: 'Direct Phone Call (Best for urgent care)', value: 'calls' },
      { label: 'Online Request Form (Best for scheduled reviews)', value: 'enquiries' },
      { label: 'External Patient Portal / Booking Link', value: 'bookings_external' },
    ],
    required: true,
    whyNeeded: 'Wires the primary CTA button across the header, hero, and contact page.',
    affectedPlanFields: ['primaryCta', 'contactMethod'],
    aiCallPolicy: 'never',
    defaultValue: 'calls',
  },

  // --- RESTAURANT ---
  {
    id: 'rest_cuisine',
    label: 'Culinary Concept & Cuisine Style',
    explanation: 'Describe your food identity (e.g. Artisanal Sourdough Bakery, Neapolitan Wood-Fired Pizzeria).',
    type: 'text',
    required: true,
    whyNeeded: 'Informs hero headline and editorial storytelling.',
    affectedPlanFields: ['pages.home.sections.hero-split', 'designPreset'],
    aiCallPolicy: 'never',
    defaultValue: 'Artisanal Bakery & Specialty Coffee Roastery',
  },
  {
    id: 'rest_menu_highlights',
    label: 'Signature Menu Highlights (One per line)',
    explanation: 'Key dishes, pastries, or beverages that define your kitchen.',
    type: 'textarea',
    required: true,
    whyNeeded: 'Populates the menu and service-grid showcase.',
    affectedPlanFields: ['pages.home.sections.service-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'Wild Sourdough Country Loaf\nSingle-Origin Flat White\nHand-Laminated Croissants & Seasonal Pastries',
  },
  {
    id: 'rest_reservation_channel',
    label: 'Table Reservation or Ordering Method',
    explanation: 'How do guests dine or order with you?',
    type: 'radio',
    options: [
      { label: 'Walk-ins & Counter Service (No reservations needed)', value: 'brand' },
      { label: 'External Reservation Link (OpenTable, Resy, SevenRooms)', value: 'bookings_external' },
      { label: 'Online Takeaway / Delivery Links', value: 'enquiries' },
    ],
    required: true,
    whyNeeded: 'Sets the header and hero booking CTA.',
    affectedPlanFields: ['primaryCta'],
    aiCallPolicy: 'never',
    defaultValue: 'bookings_external',
  },
  {
    id: 'rest_dietary',
    label: 'Dietary Accommodations',
    explanation: 'Dietary options catered for (e.g. Vegan, Gluten-free, Organic, Halal).',
    type: 'text',
    required: false,
    whyNeeded: 'Shown in feature-row food standards.',
    affectedPlanFields: ['pages.home.sections.feature-row'],
    aiCallPolicy: 'never',
    defaultValue: 'Vegan friendly, Organic stoneground grains, Gluten-free choices available',
  },

  // --- CATALOGUE & LOCAL RETAIL ---
  {
    id: 'cat_product_categories',
    label: 'Product Categories (One per line)',
    explanation: 'Main product lines offered in your boutique or showroom.',
    type: 'textarea',
    required: true,
    whyNeeded: 'Structures the catalogue grid and filter categories.',
    affectedPlanFields: ['pages.services.sections.service-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'Pure Silk Heritage Sarees\nBanarasi Brocade Silks\nHand-painted Kalamkari Textiles',
  },
  {
    id: 'cat_primary_action',
    label: 'Primary Customer Purchase Action',
    explanation: 'How do customers acquire your pieces?',
    type: 'radio',
    options: [
      { label: 'Visit Physical Boutique / Showroom', value: 'brand' },
      { label: 'WhatsApp / Direct Concierge Consultation', value: 'whatsapp' },
      { label: 'Request Seasonal Catalogue / Enquiry Form', value: 'catalogue' },
    ],
    required: true,
    whyNeeded: 'Configures primary action buttons across the site.',
    affectedPlanFields: ['primaryCta', 'contactMethod'],
    aiCallPolicy: 'never',
    defaultValue: 'catalogue',
  },
  {
    id: 'cat_price_display',
    label: 'Price Display Preference',
    explanation: 'Do you display exact prices or price on request?',
    type: 'radio',
    options: [
      { label: 'Display exact prices', value: 'exact' },
      { label: 'Price on inquiry / bespoke quote', value: 'inquiry' },
    ],
    required: false,
    whyNeeded: 'Determines pricing badge presence on catalogue cards.',
    affectedPlanFields: ['pages.services.sections.service-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'inquiry',
  },

  // --- ECOMMERCE ---
  {
    id: 'ecom_checkout_provider',
    label: 'Current Online Checkout Provider',
    explanation: 'What platform or gateway handles your payments?',
    type: 'text',
    required: false,
    whyNeeded: 'Clarifies external shop links; demo mode clearly disclosed.',
    affectedPlanFields: ['primaryCta'],
    aiCallPolicy: 'never',
    defaultValue: 'Shopify / Stripe Checkout',
  },
  {
    id: 'ecom_catalogue_size',
    label: 'Catalogue Scale',
    explanation: 'Approximate number of items in inventory.',
    type: 'select',
    options: [
      { label: 'Curated (1 – 15 items)', value: 'curated' },
      { label: 'Medium (15 – 100 items)', value: 'medium' },
      { label: 'Extensive (100+ items)', value: 'large' },
    ],
    required: false,
    whyNeeded: 'Influences catalogue page layout and filtering density.',
    affectedPlanFields: ['pages.services.sections.gallery-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'curated',
  },
  {
    id: 'ecom_shipping_coverage',
    label: 'Shipping & Delivery Coverage',
    explanation: 'Where do you fulfill orders?',
    type: 'text',
    required: false,
    whyNeeded: 'Sets shipping trust markers in feature rows.',
    affectedPlanFields: ['pages.home.sections.feature-row'],
    aiCallPolicy: 'never',
    defaultValue: 'Express nationwide delivery; international shipping available',
  },

  // --- AGENCY & CONSULTING ---
  {
    id: 'agn_specialized_services',
    label: 'Specialized Service Packages (One per line)',
    explanation: 'Core advisory or production capabilities offered to clients.',
    type: 'textarea',
    required: true,
    whyNeeded: 'Populates the services page matrix.',
    affectedPlanFields: ['pages.services.sections.service-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'Enterprise Design Systems\nFull-Stack Next.js Engineering\nGrowth Marketing & Conversion Optimization',
  },
  {
    id: 'agn_target_industries',
    label: 'Target Industries / Clients',
    explanation: 'Industries you specialize in (e.g. FinTech, B2B SaaS, HealthTech).',
    type: 'text',
    required: false,
    whyNeeded: 'Refines hero subhead and value proposition messaging.',
    affectedPlanFields: ['pages.home.sections.hero-split'],
    aiCallPolicy: 'never',
    defaultValue: 'FinTech, Enterprise B2B SaaS, and venture-backed startups',
  },
  {
    id: 'agn_case_study_metrics',
    label: 'Real Client ROI / Case Study Outcomes',
    explanation: 'Verified metrics achieved for clients (no invented facts).',
    type: 'text',
    required: false,
    whyNeeded: 'Forms high-trust feature rows without fake data.',
    affectedPlanFields: ['pages.home.sections.feature-row'],
    aiCallPolicy: 'never',
    defaultValue: '+240% qualified inbound leads; 3.2x ARR scaling in 12 months',
  },

  // --- PORTFOLIO & CREATOR ---
  {
    id: 'port_creator_role',
    label: 'Creator Discipline & Title',
    explanation: 'Your professional title (e.g. Principal Product Designer, Commercial Photographer).',
    type: 'text',
    required: true,
    whyNeeded: 'Defines the personal brand headline.',
    affectedPlanFields: ['pages.home.sections.hero-centered'],
    aiCallPolicy: 'never',
    defaultValue: 'Principal Product Designer & Interactive Art Director',
  },
  {
    id: 'port_featured_projects',
    label: 'Featured Projects (One per line)',
    explanation: 'Top projects to showcase in the visual gallery.',
    type: 'textarea',
    required: true,
    whyNeeded: 'Populates the gallery grid with real work items.',
    affectedPlanFields: ['pages.home.sections.gallery-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'Horizon Mobile Banking UI\nLumina 3D Web Studio\nHyperScale Design System',
  },
  {
    id: 'port_creative_cta',
    label: 'Primary Portfolio Goal',
    explanation: 'What action should viewers take after reviewing your work?',
    type: 'radio',
    options: [
      { label: 'Commission Inquiry / Contact Form', value: 'enquiries' },
      { label: 'Book Discovery Call', value: 'calls' },
      { label: 'Download PDF Resume / Rate Card', value: 'brand' },
    ],
    required: true,
    whyNeeded: 'Sets the conversion CTA.',
    affectedPlanFields: ['primaryCta'],
    aiCallPolicy: 'never',
    defaultValue: 'enquiries',
  },

  // --- LOCAL SERVICES ---
  {
    id: 'svc_primary_services',
    label: 'Services Offered (One per line)',
    explanation: 'Specific trades or services provided.',
    type: 'textarea',
    required: true,
    whyNeeded: 'Forms service grid cards.',
    affectedPlanFields: ['pages.services.sections.service-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'Emergency Boiler Repairs\nCentral Heating Power Flushing\nBathroom Plumbing Installations',
  },
  {
    id: 'svc_service_radius',
    label: 'Service Area / Operating Radius',
    explanation: 'Geographic area covered (e.g. Birmingham & West Midlands, within 25 miles).',
    type: 'text',
    required: true,
    whyNeeded: 'Displays location-hours and coverage badges.',
    affectedPlanFields: ['pages.contact.sections.location-hours'],
    aiCallPolicy: 'never',
    defaultValue: 'Within 25 miles of metropolitan area',
  },
  {
    id: 'svc_emergency_availability',
    label: 'Emergency & Callout Availability',
    explanation: 'Response terms (e.g. 24/7 Rapid Response, 45-minute arrival).',
    type: 'text',
    required: false,
    whyNeeded: 'Builds urgent CTA banners for trades.',
    affectedPlanFields: ['pages.home.sections.call-to-action'],
    aiCallPolicy: 'never',
    defaultValue: '24/7 Emergency Callout · 45-minute average response time',
  },
  {
    id: 'svc_contact_channel',
    label: 'Primary Emergency Contact Method',
    explanation: 'Preferred way for customers to reach you.',
    type: 'radio',
    options: [
      { label: 'Direct Phone Call (Recommended for trades)', value: 'calls' },
      { label: 'WhatsApp Emergency Message', value: 'whatsapp' },
      { label: 'Request a Free Quote Form', value: 'enquiries' },
    ],
    required: true,
    whyNeeded: 'Configures top header action and mobile sticky CTA.',
    affectedPlanFields: ['primaryCta', 'contactMethod'],
    aiCallPolicy: 'never',
    defaultValue: 'calls',
  },

  // --- EDUCATION ---
  {
    id: 'edu_courses_offered',
    label: 'Courses / Programs Offered (One per line)',
    explanation: 'Curricula or workshop tracks available to students.',
    type: 'textarea',
    required: true,
    whyNeeded: 'Creates course cards in service grid.',
    affectedPlanFields: ['pages.services.sections.service-grid'],
    aiCallPolicy: 'never',
    defaultValue: 'Full-Stack Web Engineering Immersive\nAI Systems Architecture\nModern TypeScript & Cloud Deployment',
  },
  {
    id: 'edu_delivery_format',
    label: 'Learning Format',
    explanation: 'How are lessons delivered?',
    type: 'radio',
    options: [
      { label: 'Online Live Masterclasses', value: 'online' },
      { label: 'In-Person Campus Classes', value: 'in_person' },
      { label: 'Hybrid (Online + Weekend Labs)', value: 'hybrid' },
    ],
    required: false,
    whyNeeded: 'Displayed on course cards and feature row.',
    affectedPlanFields: ['pages.services.sections.feature-row'],
    aiCallPolicy: 'never',
    defaultValue: 'hybrid',
  },

  // --- DISAMBIGUATION (FOR MIXED-OTHER) ---
  {
    id: 'disambig_business_model',
    label: 'Primary Business Model',
    explanation: 'Clarify how you primarily deliver value to customers.',
    type: 'radio',
    options: [
      { label: 'We provide specialized in-person or professional services', value: 'service' },
      { label: 'We craft and showcase products / merchandise', value: 'product' },
      { label: 'We host events, experiences, or hospitality stays', value: 'experience' },
    ],
    required: true,
    whyNeeded: 'Resolves archetype ambiguity cleanly without guesswork.',
    affectedPlanFields: ['designFamily', 'primaryCta'],
    aiCallPolicy: 'never',
    defaultValue: 'service',
  },

  // --- COMMON QUESTIONS ---
  {
    id: 'common_location_area',
    label: 'Business City / Location',
    explanation: 'City or region where you are based.',
    type: 'text',
    required: false,
    whyNeeded: 'Populates contact information and local SEO metadata.',
    affectedPlanFields: ['contact.address', 'seo'],
    aiCallPolicy: 'never',
    defaultValue: 'Birmingham, UK',
  },
  {
    id: 'common_contact_phone',
    label: 'Contact Phone Number',
    explanation: 'Phone number for customer calls or booking confirmations.',
    type: 'text',
    required: true,
    whyNeeded: 'Required for click-to-call actions.',
    affectedPlanFields: ['contact.phone'],
    aiCallPolicy: 'never',
    defaultValue: '+44 121 496 0888',
  },
  {
    id: 'common_contact_email',
    label: 'Contact Email Address',
    explanation: 'Email for form submissions and notifications.',
    type: 'text',
    required: true,
    whyNeeded: 'Required for contact form routing.',
    affectedPlanFields: ['contact.email'],
    aiCallPolicy: 'never',
    defaultValue: 'contact@example.com',
  },
  {
    id: 'common_hours',
    label: 'Operating Hours',
    explanation: 'Days and hours of operation.',
    type: 'text',
    required: false,
    whyNeeded: 'Displayed on location & hours block.',
    affectedPlanFields: ['contact.hours'],
    aiCallPolicy: 'never',
    defaultValue: 'Mon-Fri: 8:30 AM – 6:00 PM · Sat: 9:00 AM – 1:00 PM',
  },
  {
    id: 'common_proof_points',
    label: 'Verified Proof Points / Metrics',
    explanation: 'Real metrics or milestones (e.g. 5,000+ patients recovered, 12 years in practice).',
    type: 'text',
    required: false,
    whyNeeded: 'Adds credibility badges to hero and feature rows.',
    affectedPlanFields: ['proofPoints'],
    aiCallPolicy: 'never',
    defaultValue: 'Over 5,000 successful client recoveries · 4.9★ average rating',
  },
  {
    id: 'common_style_direction',
    label: 'Preferred Visual Style Direction',
    explanation: 'Select a visual style or let our engine recommend the best direction.',
    type: 'select',
    options: [
      { label: '✨ Intelligent Recommendation (Auto-Select for Archetype)', value: 'choose_for_me' },
      { label: '🏥 Local Service (Clean, Trustworthy, Solid Action Buttons)', value: 'local-service' },
      { label: '📖 Editorial (Luxury, Serif Typography, Refined White Space)', value: 'editorial' },
      { label: '💼 Modern Tech (Sleek Navy, Elevated Cards, Sharp Precision)', value: 'modern' },
      { label: '🎨 Creative (Playful, Pill Buttons, Vibrant Visual Rhythm)', value: 'creative' },
    ],
    required: false,
    whyNeeded: 'Maps to design family and token presets from BrandScalers library.',
    affectedPlanFields: ['designFamily', 'preset'],
    aiCallPolicy: 'never',
    defaultValue: 'choose_for_me',
  },
];

/**
 * Deterministically filters the question catalog for an inferred business archetype.
 * Absolutely zero API calls.
 */
export function getAdaptiveQuestionsForInference(
  inference: BusinessInference
): AdaptiveQuestion[] {
  const recommendedIds = new Set(inference.recommendedQuestionIds);

  // Common universal fields to append if not already present
  recommendedIds.add('common_contact_phone');
  recommendedIds.add('common_contact_email');
  recommendedIds.add('common_style_direction');

  const selectedQuestions = QUESTION_CATALOG.filter((q) => recommendedIds.has(q.id));

  // HARD SAFETY RULE: Never include product/checkout questions for non-retail/non-ecommerce businesses
  const nonRetailArchetypes = new Set([
    'healthcare',
    'portfolio',
    'agency',
    'local-service',
    'restaurant',
    'education',
    'hospitality',
    'event-venue',
    'nonprofit',
    'personal-brand',
    'lead-gen',
  ]);

  if (nonRetailArchetypes.has(inference.primaryArchetype)) {
    return selectedQuestions.filter(
      (q) => !q.id.startsWith('ecom_') && q.id !== 'cat_price_display'
    );
  }

  return selectedQuestions;
}
