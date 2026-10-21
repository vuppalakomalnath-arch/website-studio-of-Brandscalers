import {
  Archetype,
  BusinessInference,
  Confidence,
  MinimalIntake,
} from '../schemas/inference';
import { PrimaryGoal } from '../schemas/business-profile';

interface ArchetypeRule {
  archetype: Archetype;
  categoryPatterns: RegExp[];
  keywordPatterns: RegExp[];
  likelyGoal: PrimaryGoal;
  customerJourney: string;
  candidatePages: string[];
  requiredCapabilities: string[];
  recommendedQuestionIds: string[];
}

const ARCHETYPE_RULES: ArchetypeRule[] = [
  {
    archetype: 'healthcare',
    categoryPatterns: [/health/i, /clinic/i, /medical/i, /dental/i, /physio/i, /therapy/i, /doctor/i],
    keywordPatterns: [
      /clinic/i, /dental/i, /teeth/i, /dentist/i, /physio/i, /spine/i, /rehab/i,
      /treatment/i, /therapy/i, /patient/i, /doctor/i, /chiropract/i, /pediatric/i,
      /orthopedic/i, /mental health/i, /acupuncture/i, /healthcare/i,
    ],
    likelyGoal: 'calls',
    customerJourney: 'Patient discovers clinic -> validates credentials/treatments -> checks location/hours -> calls or books consultation',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['credential_verification', 'emergency_disclaimer', 'appointment_intake'],
    recommendedQuestionIds: [
      'hc_treatments',
      'common_location_area',
      'hc_appointment_method',
      'hc_credentials',
      'common_contact_phone',
    ],
  },
  {
    archetype: 'restaurant',
    categoryPatterns: [/restaurant/i, /cafe/i, /coffee/i, /bakery/i, /food/i, /bistro/i, /dining/i],
    keywordPatterns: [
      /restaurant/i, /cafe/i, /coffee/i, /bakery/i, /bistro/i, /pastr/i, /sourdough/i,
      /brunch/i, /menu/i, /dining/i, /culinary/i, /chef/i, /roaster/i, /espresso/i,
      /tasting/i, /cocktail/i, /pizza/i, /trattoria/i, /bar /i,
    ],
    likelyGoal: 'bookings_external',
    customerJourney: 'Diner explores culinary concept -> browses menu highlights -> reviews ambiance/dietary options -> books table or visits',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['menu_display', 'reservation_linking', 'dietary_labeling'],
    recommendedQuestionIds: [
      'rest_cuisine',
      'rest_menu_highlights',
      'rest_reservation_channel',
      'rest_dietary',
      'common_hours',
    ],
  },
  {
    archetype: 'ecommerce',
    categoryPatterns: [/ecommerce/i, /online store/i, /shop online/i],
    keywordPatterns: [
      /online store/i, /checkout/i, /buy online/i, /add to cart/i, /ecommerce/i,
      /shipping worldwide/i, /shopify/i, /order online/i, /webshop/i,
    ],
    likelyGoal: 'enquiries',
    customerJourney: 'Shopper discovers brand -> browses collections -> adds items to bag -> completes secure checkout & tracking',
    candidatePages: ['home', 'services', 'about', 'contact'],
    requiredCapabilities: ['cart_checkout', 'inventory_tracking', 'shipping_rates'],
    recommendedQuestionIds: [
      'ecom_checkout_provider',
      'ecom_catalogue_size',
      'ecom_shipping_coverage',
      'common_proof_points',
    ],
  },
  {
    archetype: 'catalogue',
    categoryPatterns: [/retail/i, /boutique/i, /showroom/i, /handcraft/i, /jewel/i, /saree/i, /fashion/i],
    keywordPatterns: [
      /boutique/i, /saree/i, /textile/i, /handloom/i, /handcraft/i, /ceramic/i, /jewel/i,
      /pottery/i, /artisan/i, /apparel/i, /fashion/i, /atelier/i, /showroom/i, /catalogue/i,
      /store/i, /silk/i, /couture/i,
    ],
    likelyGoal: 'catalogue',
    customerJourney: 'Customer discovers bespoke craftsmanship -> explores curated catalogue -> views provenance/details -> visits boutique or enquires on WhatsApp',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['catalogue_browser', 'provenance_proof', 'whatsapp_inquiry'],
    recommendedQuestionIds: [
      'cat_product_categories',
      'cat_primary_action',
      'cat_price_display',
      'common_proof_points',
      'common_location_area',
    ],
  },
  {
    archetype: 'local-service',
    categoryPatterns: [/local service/i, /plumb/i, /electri/i, /roof/i, /clean/i, /trade/i, /hvac/i],
    keywordPatterns: [
      /plumb/i, /heating/i, /boiler/i, /electric/i, /roof/i, /clean/i, /repair/i,
      /handyman/i, /hvac/i, /locksmith/i, /pest control/i, /drainage/i, /painter/i,
      /contractor/i, /gas safe/i, /emergency repair/i,
    ],
    likelyGoal: 'calls',
    customerJourney: 'Property owner has immediate maintenance need -> confirms emergency response & licensing -> taps click-to-call -> resolves repair',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['click_to_call', 'licensing_badges', 'service_radius_filter'],
    recommendedQuestionIds: [
      'svc_primary_services',
      'svc_service_radius',
      'svc_emergency_availability',
      'svc_contact_channel',
      'common_contact_phone',
    ],
  },
  {
    archetype: 'agency',
    categoryPatterns: [/agency/i, /consult/i, /b2b/i, /marketing/i, /studio/i, /software/i, /design studio/i],
    keywordPatterns: [
      /agency/i, /consulting/i, /growth/i, /marketing/i, /design studio/i, /web development/i,
      /software/i, /saas/i, /branding/i, /digital product/i, /advisory/i, /strategy/i,
      /b2b/i, /fintech/i, /ux strategy/i,
    ],
    likelyGoal: 'enquiries',
    customerJourney: 'Tech founder or enterprise buyer explores domain expertise -> inspects verified case study metrics -> books discovery call',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['case_study_proof', 'discovery_booking', 'client_logo_wall'],
    recommendedQuestionIds: [
      'agn_specialized_services',
      'agn_target_industries',
      'agn_case_study_metrics',
      'common_primary_goal',
    ],
  },
  {
    archetype: 'portfolio',
    categoryPatterns: [/portfolio/i, /creator/i, /photograph/i, /art director/i, /artist/i],
    keywordPatterns: [
      /portfolio/i, /photographer/i, /videograph/i, /art director/i, /illustrat/i,
      /product designer/i, /filmmak/i, /visual artist/i, /animator/i, /creative director/i,
      /director of photography/i, /wedding photo/i,
    ],
    likelyGoal: 'portfolio',
    customerJourney: 'Curator or client reviews visual reel -> inspects featured project case studies -> assesses artistic style -> requests commission/collaboration',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['project_gallery', 'client_credits', 'collaboration_inquiry'],
    recommendedQuestionIds: [
      'port_creator_role',
      'port_featured_projects',
      'port_creative_cta',
      'common_style_direction',
    ],
  },
  {
    archetype: 'education',
    categoryPatterns: [/education/i, /academy/i, /school/i, /tutor/i, /course/i, /bootcamp/i],
    keywordPatterns: [
      /academy/i, /bootcamp/i, /course/i, /tutor/i, /education/i, /learn/i, /training/i,
      /curriculum/i, /masterclass/i, /school/i, /institute/i, /faculty/i, /mentorship/i,
    ],
    likelyGoal: 'enquiries',
    customerJourney: 'Student or professional explores curriculum -> reviews placement stats & alumni proof -> downloads syllabus -> applies for cohort',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['curriculum_matrix', 'alumni_outcomes', 'application_form'],
    recommendedQuestionIds: [
      'edu_courses_offered',
      'edu_delivery_format',
      'edu_enrollment_goal',
      'common_proof_points',
    ],
  },
  {
    archetype: 'hospitality',
    categoryPatterns: [/hotel/i, /resort/i, /hospitality/i, /stay/i, /accommodation/i, /bnb/i],
    keywordPatterns: [
      /hotel/i, /resort/i, /bed and breakfast/i, /boutique stay/i, /villa/i, /cottage/i,
      /hostel/i, /accommodation/i, /rooms/i, /lodging/i, /guest house/i,
    ],
    likelyGoal: 'bookings_external',
    customerJourney: 'Traveler explores location & property ambiance -> reviews room amenities -> checks seasonal availability -> reserves booking',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['room_amenities_grid', 'property_gallery', 'external_booking_link'],
    recommendedQuestionIds: [
      'hosp_property_type',
      'hosp_booking_channel',
      'common_location_area',
      'common_hours',
    ],
  },
  {
    archetype: 'event-venue',
    categoryPatterns: [/event/i, /venue/i, /wedding venue/i, /hall/i],
    keywordPatterns: [
      /venue/i, /wedding venue/i, /banquet/i, /event space/i, /conference hall/i,
      /party hall/i, /celebration/i, /reception/i,
    ],
    likelyGoal: 'enquiries',
    customerJourney: 'Event planner reviews floorplans & capacity -> inspects event photo gallery -> checks date inquiry form -> books walkthrough',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['capacity_specs', 'gallery_showcase', 'tour_inquiry_form'],
    recommendedQuestionIds: [
      'venue_capacity_type',
      'venue_primary_events',
      'common_location_area',
      'common_contact_phone',
    ],
  },
  {
    archetype: 'nonprofit',
    categoryPatterns: [/nonprofit/i, /charity/i, /foundation/i, /ngo/i, /community/i],
    keywordPatterns: [
      /charity/i, /nonprofit/i, /foundation/i, /ngo/i, /volunteer/i, /donate/i,
      /community center/i, /humanitarian/i, /animal rescue/i, /outreach/i,
    ],
    likelyGoal: 'brand',
    customerJourney: 'Supporter learns about the community mission -> explores verifiable impact metrics -> volunteers or makes external contribution',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['mission_statement', 'impact_metrics', 'volunteer_intake'],
    recommendedQuestionIds: [
      'np_mission_focus',
      'np_contribution_channel',
      'common_proof_points',
      'common_primary_goal',
    ],
  },
  {
    archetype: 'personal-brand',
    categoryPatterns: [/speaker/i, /coach/i, /author/i, /personal brand/i],
    keywordPatterns: [
      /keynote speaker/i, /executive coach/i, /author/i, /thought leader/i, /public speaker/i,
      /podcast host/i, /founder bio/i, /advisor/i,
    ],
    likelyGoal: 'enquiries',
    customerJourney: 'Event host or executive explores bio & media appearances -> reviews speaking topics/books -> requests booking inquiry',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['media_reel', 'speaking_topics', 'booking_inquiry'],
    recommendedQuestionIds: [
      'pb_primary_discipline',
      'pb_key_topics',
      'common_proof_points',
      'common_contact_email',
    ],
  },
  {
    archetype: 'lead-gen',
    categoryPatterns: [/finance/i, /insurance/i, /mortgage/i, /legal/i, /accounting/i],
    keywordPatterns: [
      /accounting/i, /tax preparation/i, /bookkeep/i, /mortgage/i, /insurance/i,
      /financial advisor/i, /wealth management/i, /legal counsel/i, /lawyer/i, /solicitor/i,
    ],
    likelyGoal: 'enquiries',
    customerJourney: 'Client has professional advisory need -> confirms regulatory compliance -> reviews service packages -> requests consultation',
    candidatePages: ['home', 'about', 'services', 'contact'],
    requiredCapabilities: ['compliance_notice', 'consultation_form', 'service_breakdown'],
    recommendedQuestionIds: [
      'svc_primary_services',
      'common_location_area',
      'common_contact_phone',
      'common_contact_email',
    ],
  },
];

/**
 * Pure TypeScript deterministic local inference engine.
 * Never makes network or API calls.
 */
export function inferBusinessProfile(intake: MinimalIntake): BusinessInference {
  const name = intake.businessName.trim();
  const category = intake.category.trim();
  const offer = intake.offerDescription.trim();
  const offerAndName = `${name} ${offer}`;
  const fullText = `${name} ${category} ${offer}`;

  // Check for explicit product selling intent in offer text
  const explicitlySellsProducts = /\b(sell|selling|ecommerce|shop online|checkout|cart|shipping|buy online)\b/i.test(offer);

  // Score each archetype
  let bestMatch: ArchetypeRule | null = null;
  let secondBestMatch: ArchetypeRule | null = null;
  let maxScore = 0;
  let secondMaxScore = 0;
  const contradictions: string[] = [];

  for (const rule of ARCHETYPE_RULES) {
    let score = 0;

    // Check category match against category input
    for (const pat of rule.categoryPatterns) {
      if (pat.test(category)) {
        score += 35;
        break;
      }
    }

    // Check offer and name keywords against offerAndName (excluding category string to prevent double counting)
    for (const pat of rule.keywordPatterns) {
      if (pat.test(offerAndName)) {
        score += 20;
      }
    }

    // Guard: Prevent non-retail businesses from being falsely inferred as ecommerce
    if (rule.archetype === 'ecommerce' && !explicitlySellsProducts) {
      score = 0;
    }

    if (score > maxScore) {
      secondMaxScore = maxScore;
      secondBestMatch = bestMatch;
      maxScore = score;
      bestMatch = rule;
    } else if (score > secondMaxScore) {
      secondMaxScore = score;
      secondBestMatch = rule;
    }
  }

  // Handle "Not sure / Recommend for me" or low score
  const isGenericCategory = /not sure|recommend/i.test(category);

  let confidence: Confidence = 'high';
  if (maxScore >= 45 && !isGenericCategory) {
    confidence = 'high';
  } else if (maxScore >= 20 || isGenericCategory) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Check for contradiction: Category claimed one thing, but offer text strongly indicates another
  if (
    bestMatch &&
    !isGenericCategory &&
    category.length > 2 &&
    !bestMatch.categoryPatterns.some((p) => p.test(category)) &&
    maxScore >= 40
  ) {
    contradictions.push(
      `Category was marked as "${category}", but the offered services strongly align with ${bestMatch.archetype}.`
    );
    confidence = 'medium';
  }

  // Fallback to mixed-other if no clear archetype
  if (!bestMatch || maxScore < 15) {
    return {
      schemaVersion: '2.0',
      primaryArchetype: 'mixed-other',
      confidence: 'low',
      likelyGoal: 'enquiries',
      customerJourney: 'Visitor explores general offerings -> verifies credibility -> submits enquiry',
      candidatePages: ['home', 'about', 'services', 'contact'],
      requiredCapabilities: ['general_inquiry_form', 'business_overview'],
      missingHighImpactInfo: ['primary_service_or_product_type', 'target_audience', 'contact_method'],
      contradictions: contradictions.length > 0 ? contradictions : ['Offer description does not match common business archetypes.'],
      recommendedQuestionIds: [
        'disambig_business_model',
        'common_primary_goal',
        'common_location_area',
        'common_contact_phone',
      ],
      source: 'rules',
      rulesVersion: 'v2.0-rules',
    };
  }

  return {
    schemaVersion: '2.0',
    primaryArchetype: bestMatch.archetype,
    secondaryArchetype: secondBestMatch && secondMaxScore >= 25 ? secondBestMatch.archetype : undefined,
    confidence,
    likelyGoal: bestMatch.likelyGoal,
    customerJourney: bestMatch.customerJourney,
    candidatePages: bestMatch.candidatePages,
    requiredCapabilities: bestMatch.requiredCapabilities,
    missingHighImpactInfo: determineMissingHighImpactInfo(bestMatch.archetype, fullText),
    contradictions,
    recommendedQuestionIds: bestMatch.recommendedQuestionIds,
    source: 'rules',
    rulesVersion: 'v2.0-rules',
  };
}

function determineMissingHighImpactInfo(archetype: Archetype, fullText: string): string[] {
  const missing: string[] = [];

  if (!/\b(phone|call|tel|email|contact|reach)\b/i.test(fullText)) {
    missing.push('primary_contact_method');
  }

  if (
    (archetype === 'healthcare' || archetype === 'local-service' || archetype === 'restaurant') &&
    !/\b(city|road|street|in |area|birmingham|london|uk|usa|ny|hyderabad)\b/i.test(fullText)
  ) {
    missing.push('physical_location_or_service_area');
  }

  if (archetype === 'healthcare' && !/\b(licensed|hcpc|gmc|chartered|certified|dr|qualified)\b/i.test(fullText)) {
    missing.push('practitioner_credentials');
  }

  if (archetype === 'restaurant' && !/\b(hours|open|mon|tue|wed|thu|fri|sat|sun)\b/i.test(fullText)) {
    missing.push('operating_hours');
  }

  return missing;
}
