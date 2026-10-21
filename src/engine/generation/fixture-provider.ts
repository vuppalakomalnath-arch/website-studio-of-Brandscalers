import { BusinessProfile } from '../schemas/business-profile';
import { SitePlan } from '../schemas/site-plan';
import { SectionType } from '../schemas/website-document';
import { ModelProvider, SectionGenerationContext } from './provider';
import { UsageLedger } from './budget';
import { getPresetForFamily, DesignFamily } from '../design/presets';
import { MinimalIntake, BusinessInference } from '../schemas/inference';
import { inferBusinessProfile } from '../inference/rules';

export class FixtureProvider implements ModelProvider {
  public readonly id = 'fixture-provider';
  public readonly name = 'Deterministic Benchmark Fixture Generator [DEMO MODE]';
  public readonly isAvailable = true;

  public async classifyAmbiguity(
    intake: MinimalIntake,
    _ledger: UsageLedger
  ): Promise<BusinessInference> {
    return inferBusinessProfile(intake);
  }

  public async generatePlan(
    profile: BusinessProfile,
    ledger: UsageLedger
  ): Promise<SitePlan> {
    const estimatedCredits = 40;
    const entryId = ledger.reserve('plan_sitemap_fixture', 'fixture-engine', estimatedCredits);

    const family: DesignFamily =
      profile.preferredDesignDirection !== 'choose_for_me'
        ? (profile.preferredDesignDirection as DesignFamily)
        : profile.businessType.toLowerCase().includes('clinic') || profile.businessType.toLowerCase().includes('health') || profile.businessType.toLowerCase().includes('plumb')
        ? 'local-service'
        : profile.businessType.toLowerCase().includes('shop') || profile.businessType.toLowerCase().includes('boutique') || profile.businessType.toLowerCase().includes('atelier')
        ? 'editorial'
        : profile.businessType.toLowerCase().includes('tech') || profile.businessType.toLowerCase().includes('agency') || profile.businessType.toLowerCase().includes('software')
        ? 'creative'
        : 'modern';

    const { presetName } = getPresetForFamily(family);

    const plan: SitePlan = {
      schemaVersion: '1.0',
      businessSummary: `${profile.businessName} provides ${profile.servicesOrProducts.map((s) => s.name).join(', ')} in ${profile.location || 'their regional service area'}.`,
      primaryGoal: profile.primaryGoal,
      designFamily: family,
      preset: presetName,
      rationale: `Selected ${family} design family with "${presetName}" preset to optimize for ${profile.primaryGoal} and build credibility for ${profile.businessName}.`,
      pages: [
        {
          slug: 'home',
          title: 'Home',
          purpose: `Introduce ${profile.businessName}, showcase core services, establish trust, and drive ${profile.primaryGoal}.`,
          primaryCta: {
            label: profile.primaryGoal === 'calls' ? 'Call Now' : 'Get in Touch',
            actionType: profile.primaryGoal === 'calls' ? 'tel' : 'internal-link',
            target: profile.primaryGoal === 'calls' ? (profile.contact?.phone || '+1234567890') : 'contact',
          },
          sections: [
            { type: 'site-header', purpose: 'Navigation and brand logo' },
            {
              type: family === 'creative' || family === 'modern' ? 'hero-centered' : 'hero-split',
              purpose: 'Primary value proposition and conversion CTA',
            },
            { type: 'service-grid', purpose: 'Core offerings and service cards' },
            { type: 'testimonial-list', purpose: 'Patient/client social proof and ratings' },
            { type: 'call-to-action', purpose: 'Secondary conversion banner' },
            { type: 'site-footer', purpose: 'Navigation links and copyright details' },
          ],
        },
        {
          slug: 'about',
          title: 'About Us',
          purpose: `Detail the history, philosophy, and expertise of ${profile.businessName}.`,
          primaryCta: {
            label: 'Contact Us',
            actionType: 'internal-link',
            target: 'contact',
          },
          sections: [
            { type: 'site-header', purpose: 'Navigation' },
            { type: 'hero-centered', purpose: 'Company mission statement and trust badges' },
            { type: 'feature-row', purpose: 'Key differentiators and service quality' },
            { type: 'gallery-grid', purpose: 'Facilities and project portfolio' },
            { type: 'site-footer', purpose: 'Footer' },
          ],
        },
        {
          slug: 'services',
          title: 'Services',
          purpose: `Comprehensive catalogue of services offered by ${profile.businessName} with clear descriptions.`,
          primaryCta: {
            label: 'Request Consultation',
            actionType: 'internal-link',
            target: 'contact',
          },
          sections: [
            { type: 'site-header', purpose: 'Navigation' },
            { type: 'service-grid', purpose: 'Detailed service matrix' },
            { type: 'faq-accordion', purpose: 'Answers to frequently asked client questions' },
            { type: 'call-to-action', purpose: 'Direct consultation CTA' },
            { type: 'site-footer', purpose: 'Footer' },
          ],
        },
        {
          slug: 'contact',
          title: 'Contact',
          purpose: `Facilitate enquiries, display location & hours, and provide contact details for ${profile.businessName}.`,
          primaryCta: {
            label: 'Send Message',
            actionType: 'internal-link',
            target: 'contact',
          },
          sections: [
            { type: 'site-header', purpose: 'Navigation' },
            { type: 'location-hours', purpose: 'Office address, operating schedule, and directions' },
            { type: 'contact-form', purpose: 'Interactive client enquiry form' },
            { type: 'site-footer', purpose: 'Footer' },
          ],
        },
      ],
      warnings: profile.contact?.phone ? [] : ['No direct phone number provided in business profile; using standard enquiry route.'],
    };

    // Record realistic token usage
    ledger.recordSuccess(entryId, {
      promptTokens: 1100,
      candidatesTokens: 1400,
      totalTokens: 2500,
    });

    return plan;
  }

  public async generateSectionProps(
    context: SectionGenerationContext,
    ledger: UsageLedger
  ): Promise<unknown> {
    const estimatedCredits = 9;
    const entryId = ledger.reserve(`section_${context.sectionType}`, 'fixture-engine', estimatedCredits);

    const b = context.business;
    let props: unknown;

    switch (context.sectionType) {
      case 'site-header':
        props = {
          businessName: b.businessName,
          tagline: b.differentiators?.[0] || 'Quality and integrity in every service',
          navLinks: [
            { label: 'Home', slug: 'home' },
            { label: 'About Us', slug: 'about' },
            { label: 'Services', slug: 'services' },
            { label: 'Contact', slug: 'contact' },
          ],
          cta: {
            label: b.primaryGoal === 'calls' ? 'Call Now' : 'Get in Touch',
            type: b.primaryGoal === 'calls' ? 'tel' : 'internal-link',
            target: b.primaryGoal === 'calls' ? (b.contact?.phone || '+1234567890') : 'contact',
            style: 'primary',
          },
          phone: b.contact?.phone,
        };
        break;

      case 'hero-split':
        props = {
          eyebrow: `Welcome to ${b.businessName}`,
          title: `Professional ${b.businessType} Delivering Exceptional Results`,
          lead: `We combine specialized expertise and dedicated customer care to provide ${b.servicesOrProducts[0]?.name || 'bespoke solutions'} for our clients.`,
          primaryCta: {
            label: 'Get in Touch',
            type: 'internal-link',
            target: 'contact',
            style: 'primary',
          },
          secondaryCta: {
            label: 'Explore Services',
            type: 'internal-link',
            target: 'services',
            style: 'outline',
          },
          badgeText: 'Top-Rated Local Service',
          mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          mediaAlt: `${b.businessName} office and workspace`,
          stats: [
            { value: '10+', label: 'Years Experience' },
            { value: '100%', label: 'Dedicated Support' },
          ],
        };
        break;

      case 'hero-centered':
        props = {
          eyebrow: 'Our Vision & Purpose',
          title: `Driven by Excellence in ${b.businessType}`,
          lead: `At ${b.businessName}, our primary mission is delivering reliable, transparent, and client-centered solutions for every project.`,
          primaryCta: {
            label: 'Connect With Us',
            type: 'internal-link',
            target: 'contact',
            style: 'primary',
          },
          trustMarkers: [
            'Fully Insured & Certified',
            'Transparent Upfront Pricing',
            'Experienced Local Specialists',
          ],
          backgroundVariant: 'surface',
        };
        break;

      case 'service-grid':
        props = {
          eyebrow: 'What We Offer',
          heading: 'Tailored Services & Solutions',
          subheading: `Comprehensive solutions delivered by experienced professionals at ${b.businessName}.`,
          services: b.servicesOrProducts.map((s, idx) => ({
            id: s.id || `svc-${idx}`,
            title: s.name,
            description: s.description || `Specialized ${s.name} delivered to the highest standards of safety and quality.`,
            badge: s.price || 'Tailored Plan',
            action: {
              label: 'Learn More',
              type: 'internal-link',
              target: 'contact',
              style: 'primary',
            },
          })),
          columns: b.servicesOrProducts.length > 3 ? '3' : '2',
        };
        break;

      case 'feature-row':
        props = {
          eyebrow: 'Why Choose Us',
          title: `Why Clients Choose ${b.businessName}`,
          description: b.differentiators?.[0] || `We take pride in delivering dependable, high-quality ${b.businessType} with transparent communication.`,
          bullets: b.differentiators && b.differentiators.length > 1
            ? b.differentiators.slice(1, 5)
            : [
                'Experienced, friendly, and certified specialists',
                'Prompt and reliable communication at every step',
                'Comprehensive warranty and follow-up support',
              ],
          mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          mediaAlt: 'Team collaboration and service delivery',
          mediaPosition: 'right',
        };
        break;

      case 'testimonial-list':
        props = {
          eyebrow: 'Client Feedback',
          heading: 'What Our Clients Say',
          subheading: `Feedback from people who partnered with ${b.businessName}.`,
          isDemoData: true,
          testimonials: [
            {
              id: 't-1',
              quote: `The team at ${b.businessName} was prompt, professional, and delivered exactly what was promised. Highly recommended!`,
              author: 'Alex Morgan',
              roleOrContext: 'Local Client',
              rating: 5,
              verified: true,
            },
            {
              id: 't-2',
              quote: `Clear communication, transparent costs, and excellent craftsmanship. Working with them was completely stress-free.`,
              author: 'Claire Bennett',
              roleOrContext: 'Repeat Client',
              rating: 5,
              verified: true,
            },
          ],
        };
        break;

      case 'faq-accordion':
        props = {
          eyebrow: 'Help & Information',
          heading: 'Frequently Asked Questions',
          subheading: `Answers to common questions about our services and booking process.`,
          items: [
            {
              id: 'faq-1',
              question: `How do I book a consultation with ${b.businessName}?`,
              answer: 'You can submit an enquiry through our contact form or give our team a call directly. We respond to all requests within one business day.',
            },
            {
              id: 'faq-2',
              question: 'What are your rates and pricing structure?',
              answer: 'We provide clear, upfront estimates before beginning any work, ensuring complete transparency with zero hidden fees.',
            },
            {
              id: 'faq-3',
              question: 'What areas do you serve?',
              answer: b.location ? `We primarily serve ${b.location} and surrounding communities.` : 'We serve both regional and national clients depending on the scope of the project.',
            },
          ],
        };
        break;

      case 'gallery-grid':
        props = {
          eyebrow: 'Portfolio',
          heading: 'Our Work & Facilities',
          subheading: `A glimpse into our recent work and client projects.`,
          items: [
            {
              id: 'g-1',
              title: 'Primary Workspace',
              caption: 'Modern facilities equipped for precision work',
              mediaUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
              aspectRatio: '4/3',
            },
            {
              id: 'g-2',
              title: 'Client Collaboration',
              caption: 'Dedicated spaces for planning and consultation',
              mediaUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
              aspectRatio: '4/3',
            },
          ],
        };
        break;

      case 'call-to-action':
        props = {
          eyebrow: 'Get Started Today',
          title: `Ready to Partner with ${b.businessName}?`,
          description: `Contact our team today to discuss your requirements or schedule an introductory meeting.`,
          primaryCta: {
            label: 'Contact Us Now',
            type: 'internal-link',
            target: 'contact',
            style: 'primary',
          },
          secondaryCta: b.contact?.phone ? {
            label: `Call ${b.contact.phone}`,
            type: 'tel',
            target: b.contact.phone.replace(/\s+/g, ''),
            style: 'outline',
          } : undefined,
          reassuranceNote: 'Prompt response within 24 hours guaranteed.',
        };
        break;

      case 'contact-form':
        props = {
          eyebrow: 'Direct Enquiry',
          heading: `Contact ${b.businessName}`,
          subheading: 'Fill out the form below and our team will get in touch promptly.',
          fields: [
            { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
            { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'you@example.com' },
            { name: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: 'Phone (optional)' },
            { name: 'message', label: 'Message or Project Details', type: 'textarea', required: true, placeholder: 'How can we help you?' },
          ],
          submitButtonText: 'Submit Enquiry (Demo Mode)',
          isDemoMode: true,
          successMessage: `Thank you! Your demo message has been received by ${b.businessName}.`,
        };
        break;

      case 'location-hours':
        props = {
          eyebrow: 'Location & Schedule',
          heading: 'Find Us & Opening Times',
          address: b.contact?.address || b.location || 'Central Location',
          phone: b.contact?.phone,
          email: b.contact?.email,
          schedule: [
            { days: 'Monday - Friday', hours: b.contact?.hours || '9:00 AM - 5:30 PM' },
            { days: 'Saturday - Sunday', hours: 'By appointment' },
          ],
          mapPlaceholderText: `Convenient local access in ${b.location || 'the city center'}.`,
        };
        break;

      case 'site-footer':
        props = {
          businessName: b.businessName,
          tagline: b.differentiators?.[0] || 'Quality service and client satisfaction.',
          copyrightYear: new Date().getFullYear(),
          links: [
            { label: 'Home', slug: 'home' },
            { label: 'About Us', slug: 'about' },
            { label: 'Services', slug: 'services' },
            { label: 'Contact', slug: 'contact' },
          ],
          phone: b.contact?.phone,
          email: b.contact?.email,
          address: b.contact?.address || b.location,
          demoNotice: 'Demo presentation website created with Website Studio 2.0',
        };
        break;

      default:
        props = {};
    }

    ledger.recordSuccess(entryId, {
      promptTokens: 350,
      candidatesTokens: 400,
      totalTokens: 750,
    });

    return props;
  }
}
