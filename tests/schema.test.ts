import { describe, it, expect } from 'vitest';
import { BusinessProfileSchema } from '../src/engine/schemas/business-profile';
import {
  WebsiteDocumentSchema,
  validateSectionProps,
  SafeActionSchema,
} from '../src/engine/schemas/website-document';
import clinicFixture from '../src/fixtures/demo-website-clinic.json';
import editorialFixture from '../src/fixtures/demo-website-editorial.json';
import creativeFixture from '../src/fixtures/demo-website-creative.json';
import clinicBusiness from '../src/fixtures/demo-business-clinic.json';

describe('Suite 1: Static & Schema Integrity', () => {
  it('successfully validates all 3 benchmark website fixtures', () => {
    const parseClinic = WebsiteDocumentSchema.safeParse(clinicFixture);
    expect(parseClinic.success).toBe(true);

    const parseEditorial = WebsiteDocumentSchema.safeParse(editorialFixture);
    expect(parseEditorial.success).toBe(true);

    const parseCreative = WebsiteDocumentSchema.safeParse(creativeFixture);
    expect(parseCreative.success).toBe(true);
  });

  it('validates the BusinessProfile schema fixture', () => {
    const parseProfile = BusinessProfileSchema.safeParse(clinicBusiness);
    expect(parseProfile.success).toBe(true);
  });

  it('rejects unknown or unregistered component types', () => {
    const badSectionProps = {
      title: 'Hacked',
    };
    // @ts-expect-error Testing invalid component type
    const result = validateSectionProps('unsupported-carousel-widget', badSectionProps);
    expect(result.success).toBe(false);
  });

  it('rejects unsafe URL protocols in actions (javascript:, data:)', () => {
    const unsafeAction1 = {
      label: 'Click me',
      type: 'external-link',
      target: 'javascript:alert(document.cookie)',
    };
    const parse1 = SafeActionSchema.safeParse(unsafeAction1);
    expect(parse1.success).toBe(false);

    const unsafeAction2 = {
      label: 'Malicious Data URI',
      type: 'external-link',
      target: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    };
    const parse2 = SafeActionSchema.safeParse(unsafeAction2);
    expect(parse2.success).toBe(false);
  });

  it('allows safe URLs in actions', () => {
    const safeAction = {
      label: 'Visit Manchester Health',
      type: 'external-link',
      target: 'https://www.nhs.uk',
      style: 'primary',
    };
    const parse = SafeActionSchema.safeParse(safeAction);
    expect(parse.success).toBe(true);
  });

  it('validates all 12 core component prop schemas with valid and invalid props', () => {
    // 1. site-header
    expect(validateSectionProps('site-header', {
      businessName: 'Acme',
      navLinks: [{ label: 'Home', slug: 'home' }],
    }).success).toBe(true);

    // 2. hero-split
    expect(validateSectionProps('hero-split', {
      title: 'Hero',
      lead: 'Lead text',
      primaryCta: { label: 'Start', type: 'internal-link', target: 'contact' },
    }).success).toBe(true);

    // 3. hero-centered
    expect(validateSectionProps('hero-centered', {
      title: 'Hero Center',
      lead: 'Lead text',
      primaryCta: { label: 'Start', type: 'internal-link', target: 'contact' },
    }).success).toBe(true);

    // 4. service-grid
    expect(validateSectionProps('service-grid', {
      heading: 'Services',
      services: [{ id: '1', title: 'Consult', description: 'Expert advice' }],
    }).success).toBe(true);

    // 5. feature-row
    expect(validateSectionProps('feature-row', {
      title: 'Feature',
      description: 'Feature details',
    }).success).toBe(true);

    // 6. testimonial-list
    expect(validateSectionProps('testimonial-list', {
      heading: 'Reviews',
      isDemoData: true,
      testimonials: [{ id: '1', quote: 'Great!', author: 'Jane', rating: 5 }],
    }).success).toBe(true);

    // 7. faq-accordion
    expect(validateSectionProps('faq-accordion', {
      heading: 'FAQ',
      items: [
        { id: '1', question: 'Q1', answer: 'A1' },
        { id: '2', question: 'Q2', answer: 'A2' },
      ],
    }).success).toBe(true);

    // 8. gallery-grid
    expect(validateSectionProps('gallery-grid', {
      heading: 'Gallery',
      items: [
        { id: '1', mediaUrl: 'https://example.com/1.jpg' },
        { id: '2', mediaUrl: 'https://example.com/2.jpg' },
      ],
    }).success).toBe(true);

    // 9. call-to-action
    expect(validateSectionProps('call-to-action', {
      title: 'Join',
      description: 'Join today',
      primaryCta: { label: 'Go', type: 'internal-link', target: 'home' },
    }).success).toBe(true);

    // 10. contact-form
    expect(validateSectionProps('contact-form', {
      heading: 'Contact',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    }).success).toBe(true);

    // 11. location-hours
    expect(validateSectionProps('location-hours', {
      heading: 'Visit Us',
      address: '123 Main St',
      schedule: [{ days: 'Mon-Fri', hours: '9am - 5pm' }],
    }).success).toBe(true);

    // 12. site-footer
    expect(validateSectionProps('site-footer', {
      businessName: 'Acme Corp',
      links: [{ label: 'Home', slug: 'home' }],
    }).success).toBe(true);
  });
});
