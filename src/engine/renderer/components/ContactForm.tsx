import React, { useState } from 'react';
import { ContactFormProps } from '../../schemas/website-document';

interface Props {
  props: ContactFormProps;
}

export const ContactForm: React.FC<Props> = ({ props }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    props.fields.forEach((f) => {
      if (f.required && (!formData[f.name] || !formData[f.name].trim())) {
        newErrors[f.name] = `${f.label} is required`;
      }
      if (f.type === 'email' && formData[f.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[f.name].trim())) {
          newErrors[f.name] = 'Please enter a valid email address';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="sec cform" style={{ padding: 'var(--pad) 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 999, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, marginBottom: 12 }}>
            ℹ DEMO MODE · Submissions Validated Locally
          </div>
          {props.eyebrow && (
            <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
              {props.eyebrow}
            </div>
          )}
          <h2 style={{ fontFamily: 'var(--hf)', fontWeight: 'var(--hw)', fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', color: 'var(--ink)', margin: 0 }}>
            {props.heading}
          </h2>
          {props.subheading && (
            <p style={{ fontFamily: 'var(--bf)', fontSize: '1rem', color: 'var(--muted)', marginTop: 8 }}>
              {props.subheading}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div
          className="card"
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r)',
            border: '1px solid var(--line)',
            padding: '36px 32px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.04)',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--hf)', fontSize: '1.4rem', color: 'var(--ink)', margin: '0 0 12px 0' }}>
                Message Submitted Successfully
              </h3>
              <p style={{ fontFamily: 'var(--bf)', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                {props.successMessage}
              </p>
              <div style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--muted)', background: 'var(--bg)', padding: '12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)' }}>
                <strong>Truthful Demo Notice:</strong> No emails were dispatched. This form simulates submission feedback and passes validation tests in offline/presentation mode.
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({});
                }}
                className="btn btn-outline"
                style={{
                  marginTop: 24,
                  background: 'none',
                  border: '1px solid var(--line)',
                  padding: '10px 20px',
                  borderRadius: 'var(--r-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--ink)',
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {props.fields.map((f) => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor={`form-${f.name}`} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>
                    {f.label} {f.required && <span style={{ color: 'var(--accent)' }}>*</span>}
                  </label>

                  {f.type === 'textarea' ? (
                    <textarea
                      id={`form-${f.name}`}
                      rows={4}
                      value={formData[f.name] || ''}
                      placeholder={f.placeholder}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--r-sm)',
                        border: errors[f.name] ? '2px solid #ef4444' : '1px solid var(--line)',
                        background: 'var(--bg)',
                        color: 'var(--ink)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--bf)',
                        resize: 'vertical',
                      }}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      id={`form-${f.name}`}
                      value={formData[f.name] || ''}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--r-sm)',
                        border: errors[f.name] ? '2px solid #ef4444' : '1px solid var(--line)',
                        background: 'var(--bg)',
                        color: 'var(--ink)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--bf)',
                      }}
                    >
                      <option value="">Select an option...</option>
                      {f.options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`form-${f.name}`}
                      type={f.type}
                      value={formData[f.name] || ''}
                      placeholder={f.placeholder}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--r-sm)',
                        border: errors[f.name] ? '2px solid #ef4444' : '1px solid var(--line)',
                        background: 'var(--bg)',
                        color: 'var(--ink)',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--bf)',
                      }}
                    />
                  )}

                  {errors[f.name] && (
                    <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 500 }}>
                      ⚠ {errors[f.name]}
                    </span>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  marginTop: 10,
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  border: 'none',
                  borderRadius: 'var(--r-sm)',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {props.submitButtonText || 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
