'use client';

import React, { useState } from 'react';
import { BusinessProfile } from '@/engine/schemas/business-profile';
import { WebsiteDocument } from '@/engine/schemas/website-document';
import { MinimalIntake, BusinessInference, Archetype } from '@/engine/schemas/inference';
import { inferBusinessProfile } from '@/engine/inference/rules';
import { getAdaptiveQuestionsForInference, QUESTION_CATALOG } from '@/engine/adaptive-questions/catalog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (doc: WebsiteDocument, isMocked: boolean, credits: number) => void;
}

const ARCHETYPE_DISPLAY_NAMES: Record<Archetype, string> = {
  healthcare: '🏥 Healthcare Clinic & Medical Practice',
  restaurant: '☕ Restaurant, Bakery & Specialty Dining',
  catalogue: '🏺 Retail Product Catalogue & Boutique',
  ecommerce: '🛍️ Ecommerce & Online Webstore',
  'local-service': '🔧 Local Trades & Emergency Services',
  agency: '💼 Digital Agency & B2B Consulting',
  portfolio: '🎨 Creative Portfolio & Art Direction',
  education: '🎓 Education, Academy & Training',
  hospitality: '🏨 Hospitality, Hotel & Accommodations',
  'event-venue': '🎪 Event Space & Wedding Venue',
  nonprofit: '🤝 Nonprofit & Community Foundation',
  'personal-brand': '🎙️ Personal Brand & Executive Coaching',
  'lead-gen': '📊 Professional Advisory & Financial Services',
  'mixed-other': '⚡ Multi-Discipline / Specialized Business',
};

export const IntakeModal: React.FC<Props> = ({ isOpen, onClose, onGenerated }) => {
  // 4 Steps: 1 (Minimal Intake), 2 (Archetype Inference), 3 (Adaptive Questions), 4 (Plan Review & Build)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // STAGE 1: Minimal Business Details
  const [businessName, setBusinessName] = useState('Lakshmi Dental Clinic');
  const [category, setCategory] = useState('Healthcare / Clinic / Medical');
  const [offerDescription, setOfferDescription] = useState(
    'Family dental checkups, orthodontic braces, root canal treatment, and pediatric oral care.'
  );

  // STAGE 2: Inferred Archetype & Journey
  const [inference, setInference] = useState<BusinessInference>(() =>
    inferBusinessProfile({
      businessName: 'Lakshmi Dental Clinic',
      category: 'Healthcare / Clinic / Medical',
      offerDescription: 'Family dental checkups, orthodontic braces, root canal treatment, and pediatric oral care.',
    })
  );

  // STAGE 3: Question Answers (keyed by question ID)
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // STAGE 4: Plan Review Overrides
  const [selectedPages, setSelectedPages] = useState<string[]>(['home', 'about', 'services', 'contact']);
  const [designStyle, setDesignStyle] = useState<'choose_for_me' | 'local-service' | 'editorial' | 'modern' | 'creative'>('choose_for_me');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Step 1 -> Step 2: Trigger Local Deterministic Inference (0 API calls)
  const handleProceedToInference = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = inferBusinessProfile({
      businessName,
      category,
      offerDescription,
    });
    setInference(result);

    // Seed default answers from catalog
    const questions = getAdaptiveQuestionsForInference(result);
    const initialAnswers: Record<string, any> = { ...answers };
    for (const q of questions) {
      if (initialAnswers[q.id] === undefined && q.defaultValue !== undefined) {
        initialAnswers[q.id] = q.defaultValue;
      }
    }
    setAnswers(initialAnswers);
    setStep(2);
  };

  // User manual archetype override
  const handleArchetypeOverride = (newArch: Archetype) => {
    const updatedInference: BusinessInference = {
      ...inference,
      primaryArchetype: newArch,
      source: 'user_confirmed',
      confidence: 'high',
      customerJourney: `User-confirmed ${ARCHETYPE_DISPLAY_NAMES[newArch]} journey`,
    };
    setInference(updatedInference);

    // Refresh adaptive questions
    const questions = getAdaptiveQuestionsForInference(updatedInference);
    const updatedAnswers = { ...answers };
    for (const q of questions) {
      if (updatedAnswers[q.id] === undefined && q.defaultValue !== undefined) {
        updatedAnswers[q.id] = q.defaultValue;
      }
    }
    setAnswers(updatedAnswers);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Step 4: Final Generation Dispatch
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    // Extract services from answer or fallback to offer
    const servicesRaw =
      answers.hc_treatments ||
      answers.rest_menu_highlights ||
      answers.cat_product_categories ||
      answers.agn_specialized_services ||
      answers.svc_primary_services ||
      answers.edu_courses_offered ||
      answers.port_featured_projects ||
      offerDescription;

    const servicesList = String(servicesRaw)
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((name, i) => ({
        id: `svc-${i + 1}`,
        name,
        source: 'user' as const,
      }));

    if (servicesList.length === 0) {
      servicesList.push({ id: 'svc-1', name: offerDescription.slice(0, 40), source: 'user' });
    }

    const proofRaw = answers.common_proof_points || answers.agn_case_study_metrics || '';
    const proofPoints = String(proofRaw)
      .split('·')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const profile: BusinessProfile = {
      schemaVersion: '1.0',
      businessName,
      businessType: `${ARCHETYPE_DISPLAY_NAMES[inference.primaryArchetype]}: ${offerDescription.slice(0, 80)}`,
      primaryGoal: answers.hc_appointment_method || answers.cat_primary_action || answers.svc_contact_channel || inference.likelyGoal,
      targetAudience: answers.agn_target_industries || 'Local customers and clients',
      location: answers.common_location_area || 'Metropolitan area',
      serviceArea: [answers.svc_service_radius || answers.common_location_area || 'Regional area'],
      servicesOrProducts: servicesList,
      differentiators: [
        answers.hc_credentials,
        answers.rest_dietary,
        answers.svc_emergency_availability,
      ].filter(Boolean),
      preferredDesignDirection: designStyle,
      requiredPages: selectedPages,
      contactMethod: (inference.likelyGoal === 'calls' || answers.svc_contact_channel === 'calls') ? 'phone' : 'form',
      businessDescription: offerDescription,
      contact: {
        phone: answers.common_contact_phone || '+44 121 496 0888',
        email: answers.common_contact_email || 'contact@example.com',
        address: answers.common_location_area || 'Central Location',
        hours: answers.common_hours || 'Mon-Fri: 9am - 5pm',
      },
      proofPoints: proofPoints.length > 0 ? proofPoints : ['Verified client satisfaction', 'Licensed practitioner'],
      categorySpecifics: {
        category: inference.primaryArchetype,
        cuisine: answers.rest_cuisine,
        menuHighlights: answers.rest_menu_highlights,
        dietaryAccommodations: answers.rest_dietary,
        treatments: answers.hc_treatments,
        credentials: answers.hc_credentials,
        catalogCategories: answers.cat_product_categories,
        priceDisplayPreference: answers.cat_price_display,
        specializedPackages: answers.agn_specialized_services,
        creatorRole: answers.port_creator_role,
        skills: answers.port_featured_projects,
        coursesOffered: answers.edu_courses_offered,
        deliveryFormat: answers.edu_delivery_format,
        serviceRadius: answers.svc_service_radius,
        emergencyAvailability: answers.svc_emergency_availability,
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

  const activeQuestions = getAdaptiveQuestionsForInference(inference);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 16 }}>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, width: '100%', maxWidth: 760, color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚡ Adaptive Website Studio 2.0
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Minimal Intake · Pure Deterministic Inference · Zero Unnecessary Questions
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>
            ✕
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #334155', background: '#0b1120', padding: '6px 12px', gap: 6 }}>
          {[
            { num: 1, label: '1. Business Brief' },
            { num: 2, label: '2. Inferred Strategy' },
            { num: 3, label: `3. Adaptive Questions (${activeQuestions.length})` },
            { num: 4, label: '4. Plan Review & Build' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (s.num === 1 || (s.num > 1 && businessName.trim().length > 0)) {
                  setStep(s.num as any);
                }
              }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 6,
                border: 'none',
                background: step === s.num ? '#0284c7' : '#0f172a',
                color: step === s.num ? '#ffffff' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: step === s.num ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', flex: 1 }}>
          
          {/* STEP 1: Minimal Intake */}
          {step === 1 && (
            <form onSubmit={handleProceedToInference} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#0f172a', padding: 14, borderRadius: 8, borderLeft: '4px solid #38bdf8', fontSize: '0.85rem', color: '#cbd5e1' }}>
                💡 <strong>Stage 1: Minimal Business Details</strong> — Tell us who you are and what you offer. Our local rules engine immediately infers the optimal architecture without unwanted questionnaires.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                  1. Business Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Lakshmi Dental Clinic, Mango & Mint, Studio Anu"
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
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                >
                  <option value="Not sure / Recommend for me">✨ Not sure / Recommend for me</option>
                  <option value="Healthcare / Clinic / Medical">Healthcare / Clinic / Medical Practice</option>
                  <option value="Restaurant / Cafe / Food">Restaurant / Cafe / Bakery / Dining</option>
                  <option value="Retail / Product Catalogue / Boutique">Retail / Boutique / Showroom (No checkout)</option>
                  <option value="Ecommerce / Online Store">Ecommerce / Online Store (Cart & checkout)</option>
                  <option value="Agency / B2B Consulting / Marketing">Agency / B2B Consulting / Professional Services</option>
                  <option value="Portfolio / Creative Professional">Portfolio / Creator / Photography / Design</option>
                  <option value="Local Services (Plumbing, Electrical, Cleaning)">Local Services (Plumbing, Electrical, Roofing)</option>
                  <option value="Education / Academy / Training">Education / Academy / Online Courses</option>
                  <option value="Hospitality / Accommodation">Hospitality / Hotel / Guest Stay</option>
                  <option value="Event / Wedding Venue">Event Space / Wedding Venue</option>
                  <option value="Nonprofit / Community Organization">Nonprofit / Community / Foundation</option>
                  <option value="Personal Brand / Executive Coach">Personal Brand / Executive Coaching</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                  3. What does your business offer? <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  placeholder="Describe your primary services, specialties, or offerings in 1–2 sentences..."
                  required
                  style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Analyze & Continue →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Inferred Strategy */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#0f172a', padding: 14, borderRadius: 8, borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inferred Archetype</span>
                  <span style={{ background: inference.confidence === 'high' ? '#065f46' : '#854d0e', color: '#ffffff', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                    {inference.confidence.toUpperCase()} CONFIDENCE · 0 API CALLS
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>
                  {ARCHETYPE_DISPLAY_NAMES[inference.primaryArchetype]}
                </h4>
              </div>

              {inference.contradictions.length > 0 && (
                <div style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308', padding: 12, borderRadius: 6, color: '#fef08a', fontSize: '0.85rem' }}>
                  ⚠️ {inference.contradictions.join(' ')}
                </div>
              )}

              <div style={{ background: '#0f172a', padding: 16, borderRadius: 8, border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Primary Customer Journey:</strong>
                  <p style={{ margin: '4px 0 0', color: '#cbd5e1' }}>{inference.customerJourney}</p>
                </div>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Likely Website Goal:</strong>
                  <p style={{ margin: '4px 0 0', color: '#10b981', fontWeight: 600 }}>{inference.likelyGoal.toUpperCase()}</p>
                </div>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Recommended Sitemap:</strong>
                  <p style={{ margin: '4px 0 0', color: '#cbd5e1' }}>{inference.candidatePages.map((p) => `/${p}`).join(' · ')}</p>
                </div>
              </div>

              {/* Archetype Correction Override */}
              <div style={{ borderTop: '1px solid #334155', paddingTop: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: 6 }}>
                  Not quite right? Manually override archetype:
                </label>
                <select
                  value={inference.primaryArchetype}
                  onChange={(e) => handleArchetypeOverride(e.target.value as Archetype)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc', fontSize: '0.9rem' }}
                >
                  {Object.entries(ARCHETYPE_DISPLAY_NAMES).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ padding: '8px 18px', background: '#334155', color: '#f8fafc', border: 'none', borderRadius: 6, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  ← Back to Brief
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{ padding: '8px 22px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Continue to Questions ({activeQuestions.length}) →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Adaptive Questions */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, borderLeft: '4px solid #38bdf8', fontSize: '0.85rem', color: '#cbd5e1' }}>
                🎯 <strong>Stage 4: Adaptive Questions</strong> — Tailored strictly for <strong>{ARCHETYPE_DISPLAY_NAMES[inference.primaryArchetype]}</strong>. Zero irrelevant product/checkout questions.
              </div>

              {activeQuestions.map((q) => (
                <div key={q.id} style={{ background: '#0f172a', padding: 16, borderRadius: 8, border: '1px solid #334155' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>
                    {q.label} {q.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#94a3b8' }}>{q.explanation}</p>

                  {q.type === 'textarea' && (
                    <textarea
                      rows={3}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #475569', borderRadius: 6, color: '#f8fafc', fontSize: '0.9rem' }}
                    />
                  )}

                  {q.type === 'text' && (
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #475569', borderRadius: 6, color: '#f8fafc', fontSize: '0.9rem' }}
                    />
                  )}

                  {q.type === 'radio' && q.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                      {q.options.map((opt) => (
                        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.value}
                            checked={answers[q.id] === opt.value}
                            onChange={() => handleAnswerChange(q.id, opt.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'select' && q.options && (
                    <select
                      value={answers[q.id] || q.options[0]?.value}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #475569', borderRadius: 6, color: '#f8fafc', fontSize: '0.9rem' }}
                    >
                      {q.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ padding: '8px 18px', background: '#334155', color: '#f8fafc', border: 'none', borderRadius: 6, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  ← Back to Strategy
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  style={{ padding: '8px 22px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Review Plan Before Generation →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Plan Review & Build */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#0f172a', padding: 14, borderRadius: 8, borderLeft: '4px solid #38bdf8', fontSize: '0.85rem', color: '#cbd5e1' }}>
                📋 <strong>Stage 5: Plan Review Before Generation</strong> — Review and customize the architecture before running AI generation. Zero surprise credit deductions.
              </div>

              <div style={{ background: '#0f172a', padding: 16, borderRadius: 8, border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Business Identity:</span>
                  <strong style={{ color: '#38bdf8' }}>{businessName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Confirmed Archetype:</span>
                  <span>{ARCHETYPE_DISPLAY_NAMES[inference.primaryArchetype]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Primary Goal / Action:</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{inference.likelyGoal.toUpperCase()}</span>
                </div>

                {/* Editable Sitemap */}
                <div style={{ borderTop: '1px solid #334155', paddingTop: 10 }}>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: 8 }}>Included Pages:</span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['home', 'about', 'services', 'contact'].map((pageSlug) => {
                      const isSelected = selectedPages.includes(pageSlug);
                      return (
                        <button
                          key={pageSlug}
                          type="button"
                          onClick={() => {
                            if (pageSlug === 'home') return; // Home is always required
                            setSelectedPages(
                              isSelected ? selectedPages.filter((p) => p !== pageSlug) : [...selectedPages, pageSlug]
                            );
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 4,
                            border: '1px solid #475569',
                            background: isSelected ? '#0284c7' : '#1e293b',
                            color: '#f8fafc',
                            fontSize: '0.8rem',
                            cursor: pageSlug === 'home' ? 'default' : 'pointer',
                          }}
                        >
                          /{pageSlug} {pageSlug === 'home' && '(Required)'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Design Direction Override */}
                <div style={{ borderTop: '1px solid #334155', paddingTop: 10 }}>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: 6 }}>Visual Design Preset:</span>
                  <select
                    value={designStyle}
                    onChange={(e) => setDesignStyle(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #475569', borderRadius: 6, color: '#f8fafc', fontSize: '0.88rem' }}
                  >
                    <option value="choose_for_me">✨ Intelligent Preset (Auto-Match Archetype)</option>
                    <option value="local-service">🏥 Warm Clinic / Trust Local Service (Figtree, Solid Buttons)</option>
                    <option value="editorial">📖 Quiet Luxury / Editorial Boutique (Cormorant, Outline Buttons)</option>
                    <option value="modern">💼 Corporate Navy / Modern Precision (Montserrat, Raised Cards)</option>
                    <option value="creative">🎨 Creative Bold / Digital Studio (Poppins, Pill Buttons)</option>
                  </select>
                </div>
              </div>

              {/* Budget Guarantee Badge */}
              <div style={{ background: '#022c22', border: '1px solid #059669', padding: 14, borderRadius: 8, fontSize: '0.85rem', color: '#a7f3d0' }}>
                🛡️ <strong>Hard Budget Ceiling:</strong> Generation consumes at most <strong>250 business credits</strong> (averages 148–220 credits with live Gemini API). If build fails, <strong>0 credits</strong> are charged.
              </div>

              {error && (
                <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 6, color: '#fca5a5', fontSize: '0.85rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={loading}
                  style={{ padding: '8px 18px', background: '#334155', color: '#f8fafc', border: 'none', borderRadius: 6, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  ← Back to Questions
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  style={{
                    padding: '10px 24px',
                    background: loading ? '#475569' : '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {loading ? '⏳ Generating with Gemini...' : '🚀 Generate Website with Gemini'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
