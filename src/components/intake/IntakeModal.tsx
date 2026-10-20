'use client';

import React, { useState } from 'react';
import { BusinessProfile } from '@/engine/schemas/business-profile';
import { WebsiteDocument } from '@/engine/schemas/website-document';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (doc: WebsiteDocument, isMocked: boolean, credits: number) => void;
}

const CATEGORY_DEFAULTS: Record<string, {
  type: string;
  name: string;
  goal: 'enquiries' | 'calls' | 'whatsapp' | 'bookings_external' | 'portfolio' | 'brand' | 'catalogue';
  style: 'local-service' | 'editorial' | 'modern' | 'creative' | 'choose_for_me';
  services: string;
  description: string;
  differentiators: string;
}> = {
  Healthcare: {
    type: 'Sports Physiotherapy & Spine Clinic',
    name: 'Apex Physiotherapy & Rehab',
    goal: 'calls',
    style: 'local-service',
    services: 'Sports Injury Rehab\nManual Spinal Therapy\nPost-Op Orthopedic Recovery',
    description: 'Apex Physiotherapy is a premier evidence-based physical rehabilitation practice dedicated to rapid recovery and long-term musculoskeletal wellness.',
    differentiators: 'HCPC Registered Practitioners, Same-day emergency appointments, 15+ years clinical experience',
  },
  Restaurant: {
    type: 'Artisanal Bakery & Specialty Coffee Roastery',
    name: 'The Rustic Hearth & Roastery',
    goal: 'bookings_external',
    style: 'editorial',
    services: 'Wild Sourdough Breads\nSingle-Origin Espresso\nArtisan Pastries & Brunch',
    description: 'The Rustic Hearth is an organic stone-ground artisanal bakery and micro-roastery crafting slow-fermented breads and single-origin specialty coffees.',
    differentiators: '36-hour slow sourdough fermentation, Ethically sourced direct-trade beans, Wood-fired stone oven',
  },
  Agency: {
    type: 'Digital Product Design & Growth Consultancy',
    name: 'Vanguard Digital Lab',
    goal: 'enquiries',
    style: 'creative',
    services: 'Full-Stack Web Engineering\nDesign Systems & UX Strategy\nConversion Rate Optimization',
    description: 'Vanguard Digital Lab partners with ambitious tech founders to build high-converting web applications and scalable enterprise design systems.',
    differentiators: 'Proven 3.2x average MRR growth, Senior-only dedicated teams, 99.98% sprint delivery rate',
  },
  Portfolio: {
    type: 'Principal Product Designer & Art Director',
    name: 'Elena Rostova Portfolio',
    goal: 'portfolio',
    style: 'creative',
    services: 'Product Design Systems\nInteractive 3D Web Experiences\nBrand Direction & Strategy',
    description: 'Portfolio of Elena Rostova, award-winning Principal Product Designer crafting memorable digital experiences for global tech innovators.',
    differentiators: 'Awwwards Site of the Year Winner, 12+ years experience in Silicon Valley, 30+ shipped enterprise products',
  },
  Retail: {
    type: 'Artisanal Lifestyle & Handcrafted Goods Boutique',
    name: 'House of Jaya',
    goal: 'catalogue',
    style: 'editorial',
    services: 'Pure Silk Heritage Sarees\nHand-painted Kalamkari Textiles\nBespoke Bridal Couture',
    description: 'House of Jaya is a celebrated luxury heritage boutique specializing in museum-grade handloom textiles, pure silks, and bespoke bridal wear.',
    differentiators: 'Silk Mark Certified 100% Pure Silks, Direct weaver artisan cooperative, Worldwide express shipping',
  },
  Education: {
    type: 'Tech Academy & Advanced Coding Bootcamp',
    name: 'CodeCraft Institute',
    goal: 'enquiries',
    style: 'modern',
    services: 'Full-Stack Engineering Immersive\nAI & Machine Learning Bootcamp\nProduction Systems Architecture',
    description: 'CodeCraft Institute delivers intensive project-driven technical education taught by Silicon Valley industry leaders.',
    differentiators: '94% graduate placement within 180 days, 1-on-1 industry mentorship, Hands-on production codebase curriculum',
  },
  LocalServices: {
    type: 'Emergency Plumbing & Central Heating Services',
    name: 'RapidFlow Heating & Plumbing',
    goal: 'calls',
    style: 'local-service',
    services: 'Emergency Boiler Repairs\nBathroom Installations\nCentral Heating Power Flushing',
    description: 'RapidFlow Heating provides prompt, certified 24/7 plumbing and gas safe heating solutions throughout the metropolitan area.',
    differentiators: 'Gas Safe Registered (#59281), 45-minute emergency response, Fixed transparent pricing with zero callout fees',
  },
};

export const IntakeModal: React.FC<Props> = ({ isOpen, onClose, onGenerated }) => {
  // Wizard step: 1 (Core Identity), 2 (Category Specifics), 3 (Brand & Direction), 4 (Review & Generate)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Common Business Info (spec.md Section 5.A - 20 items)
  const [businessName, setBusinessName] = useState('Apex Physiotherapy & Rehab');
  const [category, setCategory] = useState<'Healthcare' | 'Restaurant' | 'Agency' | 'Portfolio' | 'Retail' | 'Education' | 'LocalServices'>('Healthcare');
  const [businessType, setBusinessType] = useState('Sports Physiotherapy & Spine Clinic');
  const [location, setLocation] = useState('Birmingham, UK');
  const [serviceArea, setServiceArea] = useState('West Midlands, Solihull, Sutton Coldfield');
  const [primaryGoal, setPrimaryGoal] = useState<'enquiries' | 'calls' | 'whatsapp' | 'bookings_external' | 'portfolio' | 'brand' | 'catalogue'>('enquiries');
  const [targetAudience, setTargetAudience] = useState('Active professionals, athletes, and local rehab patients');
  const [servicesText, setServicesText] = useState('Sports Injury Rehab\nManual Spinal Therapy\nPost-Op Orthopedic Recovery');
  const [differentiators, setDifferentiators] = useState('HCPC Registered Practitioners, Same-day emergency appointments, 15+ years clinical experience');
  const [businessDescription, setBusinessDescription] = useState('Apex Physiotherapy is a premier evidence-based physical rehabilitation practice dedicated to rapid recovery and long-term musculoskeletal wellness.');
  
  // Category-specific info (spec.md Section 5.B)
  const [cuisine, setCuisine] = useState('Artisanal Bakery & Specialty Coffee');
  const [menuHighlights, setMenuHighlights] = useState('Wild sourdough loaves, hand-laminated croissants, organic flat whites');
  const [dietary, setDietary] = useState('Vegan friendly, Gluten-free options available');
  const [reservationLink, setReservationLink] = useState('https://opentable.com/apex-demo');
  const [deliveryLinks, setDeliveryLinks] = useState('UberEats, Deliveroo');

  const [treatments, setTreatments] = useState('Spinal Manipulation, Dry Needling, Joint Mobilization, Shockwave Therapy');
  const [credentials, setCredentials] = useState('HCPC Registered, MCSP Chartered Physiotherapists');
  const [acceptedInsurance, setAcceptedInsurance] = useState('Bupa, AXA Health, Aviva, Vitality, Self-Pay');

  const [specializedPackages, setSpecializedPackages] = useState('Brand Identity Sprint, Full-Stack Next.js Web Dev, Growth Marketing Engine');
  const [targetIndustries, setTargetIndustries] = useState('FinTech, B2B SaaS, HealthTech');
  const [caseStudies, setCaseStudies] = useState('+240% inbound leads for BioHealth; 3.2x MRR growth in 90 days for PayFlow');

  const [creatorRole, setCreatorRole] = useState('Principal Product Designer & Art Director');
  const [skills, setSkills] = useState('Design Systems, React, Next.js, 3D Interactive Web');
  const [featuredProjects, setFeaturedProjects] = useState('HyperScale Design System, Lumina Mobile Banking UI, Horizon 3D Studio');

  const [catalogCategories, setCatalogCategories] = useState('Handmade Ceramics, Stoneware Tableware, Minimalist Vases');
  const [priceDisplayPreference, setPriceDisplayPreference] = useState('Show exact prices');

  const [coursesOffered, setCoursesOffered] = useState('Full-Stack Web Engineering, AI Systems Architecture, Modern TypeScript');
  const [deliveryFormat, setDeliveryFormat] = useState('Hybrid (Online Masterclasses + Weekly In-Person Labs)');

  const [serviceRadius, setServiceRadius] = useState('Within 25 miles of Birmingham');
  const [emergencyAvailability, setEmergencyAvailability] = useState('24/7 Rapid Emergency Response');

  // Brand & Preferences (spec.md Section 5.A 8-20)
  const [preferredDesignDirection, setPreferredDesignDirection] = useState<'local-service' | 'editorial' | 'modern' | 'creative' | 'choose_for_me'>('local-service');
  const [refUrl, setRefUrl] = useState('https://example.com/inspiration');
  const [refElements, setRefElements] = useState('Clean spacious typography, solid CTA buttons, high-contrast headings');
  const [phone, setPhone] = useState('+44 121 496 0888');
  const [email, setEmail] = useState('contact@apexphysio.co.uk');
  const [hours, setHours] = useState('Mon-Fri: 8am - 6pm, Sat: 9am - 1pm');
  const [proofPoints, setProofPoints] = useState('Over 5,000 successful recoveries; 4.9★ rating on Google Reviews');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const services = servicesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((name, i) => ({
        id: `svc-input-${i + 1}`,
        name,
        source: 'user' as const,
      }));

    if (services.length === 0) {
      services.push({ id: 'svc-input-1', name: 'Core Service', source: 'user' });
    }

    const diffList = differentiators
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const proofList = proofPoints
      .split(';')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const profile: BusinessProfile = {
      schemaVersion: '1.0',
      businessName,
      businessType: `${category}: ${businessType}`,
      primaryGoal,
      targetAudience,
      location,
      serviceArea: serviceArea.split(',').map((s) => s.trim()),
      servicesOrProducts: services,
      differentiators: diffList,
      preferredDesignDirection,
      requiredPages: ['home', 'about', 'services', 'contact'],
      contactMethod: primaryGoal === 'calls' ? 'phone' : 'form',
      businessDescription,
      referenceSite: {
        url: refUrl,
        preferredElements: refElements,
      },
      contact: {
        phone,
        email,
        address: `${location}`,
        hours,
      },
      proofPoints: proofList,
      categorySpecifics: {
        category,
        cuisine: category === 'Restaurant' ? cuisine : undefined,
        menuHighlights: category === 'Restaurant' ? menuHighlights : undefined,
        dietaryAccommodations: category === 'Restaurant' ? dietary : undefined,
        reservationLink: category === 'Restaurant' ? reservationLink : undefined,
        deliveryLinks: category === 'Restaurant' ? deliveryLinks : undefined,

        treatments: category === 'Healthcare' ? treatments : undefined,
        credentials: category === 'Healthcare' ? credentials : undefined,
        acceptedInsurance: category === 'Healthcare' ? acceptedInsurance : undefined,

        specializedPackages: category === 'Agency' ? specializedPackages : undefined,
        targetIndustries: category === 'Agency' ? targetIndustries : undefined,
        caseStudies: category === 'Agency' ? caseStudies : undefined,

        creatorRole: category === 'Portfolio' ? creatorRole : undefined,
        skills: category === 'Portfolio' ? skills : undefined,
        featuredProjects: category === 'Portfolio' ? featuredProjects : undefined,

        catalogCategories: category === 'Retail' ? catalogCategories : undefined,
        priceDisplayPreference: category === 'Retail' ? priceDisplayPreference : undefined,

        coursesOffered: category === 'Education' ? coursesOffered : undefined,
        deliveryFormat: category === 'Education' ? deliveryFormat : undefined,

        serviceRadius: category === 'LocalServices' ? serviceRadius : undefined,
        emergencyAvailability: category === 'LocalServices' ? emergencyAvailability : undefined,
      },
      assets: [],
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      onGenerated(data.document, data.isMocked, data.actualCredits);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to generate website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 16 }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, width: '100%', maxWidth: 720, color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚡ Business Intake & Generation Wizard
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Full 20-Point Brief + Conditional Category Questions · Max 250 Credits
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Wizard Steps Navigation Bar */}
        <div style={{ display: 'flex', background: '#1e293b', borderBottom: '1px solid #334155', padding: '10px 24px', gap: 8 }}>
          {[
            { num: 1, label: '1. Core Identity' },
            { num: 2, label: `2. ${category} Specifics` },
            { num: 3, label: '3. Style & Brand' },
            { num: 4, label: '4. Build & Budget' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num as any)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                background: step === s.num ? '#0284c7' : '#0f172a',
                color: step === s.num ? '#ffffff' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: step === s.num ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
            
            {/* STEP 1: Core Business Identity */}
            {step === 1 && (
              <>
                <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, borderLeft: '4px solid #38bdf8', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Common Business Information (1–7)</strong> — Required and foundational details about your business.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      1. Business Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      2. Business Category <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setCategory(val);
                        const def = CATEGORY_DEFAULTS[val];
                        if (def) {
                          setBusinessType(def.type);
                          setBusinessName(def.name);
                          setPrimaryGoal(def.goal);
                          setPreferredDesignDirection(def.style);
                          setServicesText(def.services);
                          setBusinessDescription(def.description);
                          setDifferentiators(def.differentiators);
                        }
                      }}
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    >
                      <option value="Healthcare">Healthcare / Clinic / Medical</option>
                      <option value="Restaurant">Restaurant / Cafe / Food</option>
                      <option value="Agency">Agency / B2B Consulting</option>
                      <option value="Portfolio">Portfolio / Creative Professional</option>
                      <option value="Retail">Retail / Product Catalogue</option>
                      <option value="Education">Education / Training / Academy</option>
                      <option value="LocalServices">Local Services (Plumbing, Electrical, Cleaning)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Specific Business Type / Niche <span style={{ color: '#ef4444' }}>*</span>
                    <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>(e.g. Saree & Handloom Studio, Sports Injury Clinic, Italian Trattoria)</span>
                  </label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                    placeholder="e.g. Artisanal Lifestyle & Handcrafted Goods Boutique"
                    style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      3. Location & Service Area <span style={{ color: '#38bdf8' }}>(Conditional)</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Birmingham, UK"
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      4. Primary Website Goal <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    >
                      <option value="enquiries">Online Enquiries & Form Submissions</option>
                      <option value="calls">Direct Phone Calls</option>
                      <option value="whatsapp">Direct WhatsApp Chat</option>
                      <option value="bookings_external">External Reservations / Bookings</option>
                      <option value="portfolio">Creative Portfolio Showcase</option>
                      <option value="catalogue">Product Catalogue Inquiries</option>
                      <option value="brand">Brand Awareness & Story</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    5. Target Audience or Customers <span style={{ color: '#94a3b8' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    6. Products or Services Offered (One per line) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={servicesText}
                    onChange={(e) => setServicesText(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    7. Unique Selling Points (USPs) & Differentiators <span style={{ color: '#94a3b8' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={differentiators}
                    onChange={(e) => setDifferentiators(e.target.value)}
                    placeholder="Comma separated: 15+ years experience, Licensed & Insured"
                    style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                  />
                </div>
              </>
            )}

            {/* STEP 2: Category-Specific Conditional Questions */}
            {step === 2 && (
              <>
                <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, borderLeft: '4px solid #38bdf8', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Conditional Category Information ({category})</strong> — Questions displayed specifically for your selected industry.
                </div>

                {category === 'Healthcare' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Clinical Treatments & Procedures Offered
                      </label>
                      <input
                        type="text"
                        value={treatments}
                        onChange={(e) => setTreatments(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Practitioner Credentials & Accreditations
                      </label>
                      <input
                        type="text"
                        value={credentials}
                        onChange={(e) => setCredentials(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Accepted Insurance & Payment Options
                      </label>
                      <input
                        type="text"
                        value={acceptedInsurance}
                        onChange={(e) => setAcceptedInsurance(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                )}

                {category === 'Restaurant' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Cuisine Type & Dining Concept
                      </label>
                      <input
                        type="text"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Menu Highlights & Signature Dishes
                      </label>
                      <input
                        type="text"
                        value={menuHighlights}
                        onChange={(e) => setMenuHighlights(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Dietary Accommodations & Notes
                      </label>
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Reservation Link or Provider
                      </label>
                      <input
                        type="text"
                        value={reservationLink}
                        onChange={(e) => setReservationLink(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                )}

                {category === 'Agency' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Specialized Service Packages / Retainers
                      </label>
                      <input
                        type="text"
                        value={specializedPackages}
                        onChange={(e) => setSpecializedPackages(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Target Industries & Enterprise Verticals
                      </label>
                      <input
                        type="text"
                        value={targetIndustries}
                        onChange={(e) => setTargetIndustries(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Key Case Studies & Quantified Impact
                      </label>
                      <input
                        type="text"
                        value={caseStudies}
                        onChange={(e) => setCaseStudies(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                )}

                {category === 'Portfolio' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Creator Role & Professional Discipline
                      </label>
                      <input
                        type="text"
                        value={creatorRole}
                        onChange={(e) => setCreatorRole(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Core Skills & Tools
                      </label>
                      <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Featured Projects / Showcases
                      </label>
                      <input
                        type="text"
                        value={featuredProjects}
                        onChange={(e) => setFeaturedProjects(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                )}

                {category === 'Retail' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Product Catalogue Categories
                      </label>
                      <input
                        type="text"
                        value={catalogCategories}
                        onChange={(e) => setCatalogCategories(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Price Display Preference
                      </label>
                      <input
                        type="text"
                        value={priceDisplayPreference}
                        onChange={(e) => setPriceDisplayPreference(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                )}

                {category === 'Education' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Subjects & Courses Offered
                      </label>
                      <input
                        type="text"
                        value={coursesOffered}
                        onChange={(e) => setCoursesOffered(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Learning Delivery Format
                      </label>
                      <input
                        type="text"
                        value={deliveryFormat}
                        onChange={(e) => setDeliveryFormat(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                )}

                {category === 'LocalServices' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Service Radius & Areas Covered
                      </label>
                      <input
                        type="text"
                        value={serviceRadius}
                        onChange={(e) => setServiceRadius(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                        Emergency Availability
                      </label>
                      <input
                        type="text"
                        value={emergencyAvailability}
                        onChange={(e) => setEmergencyAvailability(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 3: Brand & Design Direction */}
            {step === 3 && (
              <>
                <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, borderLeft: '4px solid #38bdf8', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Brand, Visual Direction & Contact (8–17)</strong> — Styling and contact settings.
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    8. Preferred Design Direction <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={preferredDesignDirection}
                    onChange={(e) => setPreferredDesignDirection(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                  >
                    <option value="choose_for_me">✨ Intelligent Recommendation (Auto-Select)</option>
                    <option value="local-service">🏥 Local Service (Clean, Trustworthy, Solid Buttons)</option>
                    <option value="editorial">📖 Editorial (Luxury, Serif Typography, Refined Outline)</option>
                    <option value="creative">🎨 Creative (Playful, Pill Buttons, Bold Contrast)</option>
                    <option value="modern">💼 Modern Tech (Sleek, Navy, Elevated Cards)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      10. Reference Website URL <span style={{ color: '#94a3b8' }}>(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={refUrl}
                      onChange={(e) => setRefUrl(e.target.value)}
                      placeholder="https://example.com"
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      11. Preferred Elements from Reference <span style={{ color: '#94a3b8' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={refElements}
                      onChange={(e) => setRefElements(e.target.value)}
                      placeholder="e.g. Card rhythm, header layout"
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      16. Contact Phone Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                      16. Contact Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                    18. Real Proof Points / Metrics <span style={{ color: '#94a3b8' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={proofPoints}
                    onChange={(e) => setProofPoints(e.target.value)}
                    placeholder="Semicolon separated: Over 5,000 clients; 4.9 Star average"
                    style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                  />
                </div>
              </>
            )}

            {/* STEP 4: Review & Generate */}
            {step === 4 && (
              <>
                <div style={{ background: '#0f172a', padding: 16, borderRadius: 8, border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Business Name:</span>
                    <strong style={{ color: '#38bdf8' }}>{businessName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Category & Type:</span>
                    <span>{category} · {businessType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Location / Service:</span>
                    <span>{location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Primary Goal:</span>
                    <span style={{ textTransform: 'capitalize', color: '#10b981', fontWeight: 600 }}>{primaryGoal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Design Direction:</span>
                    <span style={{ textTransform: 'capitalize' }}>{preferredDesignDirection}</span>
                  </div>
                </div>

                <div style={{ background: '#022c22', border: '1px solid #059669', padding: 14, borderRadius: 8, fontSize: '0.85rem', color: '#a7f3d0' }}>
                  🛡️ <strong>Pre-flight Credit Guard:</strong> Initial website generation deducts exactly <strong>250 credits</strong> from your account upon successful creation. If generation fails, <strong>0 credits</strong> are charged.
                </div>
              </>
            )}

            {error && (
              <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 6, color: '#fca5a5', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #334155', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                disabled={loading}
                style={{ padding: '10px 18px', background: '#334155', color: '#f8fafc', border: 'none', borderRadius: 6, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                style={{ padding: '10px 22px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Next Step →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 28px',
                  background: loading ? '#64748b' : '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {loading ? 'Generating with Gemini...' : '🚀 Generate Website (250 Credits)'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
