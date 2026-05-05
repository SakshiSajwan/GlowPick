import { useState } from 'react';
import { Link } from 'react-router-dom';

const TIMELINE = [
  { day: 'Day 0', label: 'Delivered', icon: '📦', color: '#FC2779', desc: 'Your order arrives' },
  { day: 'Day 1–7', label: 'Return Window', icon: '↩️', color: '#f59e0b', desc: 'Raise a return request' },
  { day: 'Day 8–10', label: 'Pickup', icon: '🚚', color: '#8b5cf6', desc: 'We collect the product' },
  { day: 'Day 11–17', label: 'QC Check', icon: '🔍', color: '#06b6d4', desc: 'Quality inspection at warehouse' },
  { day: 'Day 18–24', label: 'Refund', icon: '💰', color: '#10b981', desc: 'Refund credited to original source' },
];

const ELIGIBLE = [
  { icon: '📦', title: 'Wrong Product Delivered', desc: 'You received a product different from what you ordered.' },
  { icon: '💔', title: 'Damaged or Defective', desc: 'Product arrived broken, leaked, or in unusable condition.' },
  { icon: '⏰', title: 'Expired Product', desc: 'Product delivered past its expiry or best-before date.' },
  { icon: '🔍', title: 'Significantly Not as Described', desc: 'Product is materially different from its listing description.' },
  { icon: '📪', title: 'Missing Items', desc: 'Part of a bundle or combo was missing from your delivery.' },
];

const NOT_ELIGIBLE = [
  { icon: '💅', title: 'Change of Mind', desc: 'You simply changed your mind after receiving the product.' },
  { icon: '💧', title: 'Used Products', desc: 'Products that have been opened, used, or partially consumed.' },
  { icon: '🏷️', title: 'Tampered Packaging', desc: 'Original seals or packaging removed or damaged by the customer.' },
  { icon: '🎁', title: 'Free Gifts', desc: 'Complimentary items included with orders are non-returnable.' },
  { icon: '💊', title: 'Hygiene-Sensitive Items', desc: 'Lip products, mascaras, and certain skincare once opened.' },
];

const FAQS = [
  {
    q: 'How do I initiate a return?',
    a: 'Log in to your GlowPick account → Go to "My Orders" → Select the order → Click "Request Return". Fill in the reason and upload photos of the issue. Our support team will confirm within 24 hours.',
  },
  {
    q: 'What if I received a damaged product but already used some of it?',
    a: 'If the damage was present upon delivery and you used the product before noticing, we will still review your case on a goodwill basis. Please raise the request within 7 days with photos and we will assess it.',
  },
  {
    q: 'Can I exchange instead of returning?',
    a: 'Yes! Instead of a refund, you can opt for an exchange for the same product (different variant) or store credit (GlowCoins) that never expire and can be used on any future order.',
  },
  {
    q: "What happens if I'm not home during the pickup?",
    a: 'Our logistics partner will attempt 3 pickups on consecutive days. If all attempts fail, the return request will be cancelled and you will need to raise a fresh request.',
  },
  {
    q: 'How long does the refund take to reflect in my account?',
    a: 'Once approved: UPI/Net Banking — 3–5 business days. Credit/Debit card — 5–7 business days. GlowCoins — Instant. COD orders are refunded via bank transfer within 7–10 business days.',
  },
  {
    q: 'My order was cancelled before delivery — when will I get my refund?',
    a: 'For pre-delivery cancellations, refunds are processed within 24 hours of cancellation confirmation and typically reflect within 5–7 business days depending on your bank.',
  },
];

export default function RefundPolicy() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: '#FFFBF8', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1f1a 0%, #0a1a2e 45%, #1a0d2e 100%)',
        padding: 'clamp(52px,7vw,96px) clamp(24px,6vw,80px)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(16,185,129,0.15)',
      }}>
        {/* Geometric lines */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', borderLeft: '1px solid rgba(16,185,129,0.08)', background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.04))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)' }} />
        <div style={{ position: 'absolute', top: 0, left: '60%', width: 1, height: '100%', background: 'rgba(16,185,129,0.07)' }} />

        <div style={{ position: 'relative', maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 19, textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = '#34d399'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
            >Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 19 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 19, fontWeight: 600 }}>Refund Policy</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px,5.5vw,68px)',
            fontWeight: 900, color: '#fff', lineHeight: 1.0,
            marginBottom: 18, letterSpacing: '-0.03em',
          }}>
            Refund & Returns Policy
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.6vw,20px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 580, fontWeight: 400 }}>
            We want every GlowPick purchase to bring you joy. If something isn't right, we've got you — with a simple, transparent returns process.
          </p>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { value: '7 Days', label: 'Return Window' },
              { value: '24 hrs', label: 'Request Review' },
              { value: '5–7 Days', label: 'Refund Timeline' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '16px 24px',
              }}>
                <p style={{ color: '#FC2779', fontSize: 20, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', marginTop: 32, fontWeight: 500 }}>
            Last updated: April 30, 2026
          </p>
        </div>
      </div>

      {/* Full-width body */}
      <div style={{ padding: 'clamp(48px,5vw,80px) clamp(24px,6vw,80px)', display: 'flex', flexDirection: 'column', gap: 72 }}>

        {/* Timeline */}
        <section>
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>Step by Step</p>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,36px)', fontWeight: 900, color: '#1C1C1E', letterSpacing: '-0.02em' }}>Return Process Timeline</h2>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            <div style={{
              position: 'absolute', top: 44, left: '10%', right: '10%', height: 2,
              background: 'linear-gradient(90deg, #FC2779, #f59e0b, #8b5cf6, #06b6d4, #10b981)',
              zIndex: 0,
            }} />
            {TIMELINE.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: '#fff', border: `3px solid ${step.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, marginBottom: 16,
                  boxShadow: `0 4px 24px ${step.color}35`,
                }}>
                  {step.icon}
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{step.day}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E', marginBottom: 5 }}>{step.label}</p>
                <p style={{ fontSize: 15, color: '#777', lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligible / Not Eligible */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✅</div>
              <h2 style={{ fontSize: 'clamp(20px,2vw,26px)', fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.01em' }}>Eligible for Return</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ELIGIBLE.map((item, i) => (
                <div key={i} style={{
                  background: '#fff', border: '1.5px solid #bbf7d0',
                  borderRadius: 14, padding: '18px 22px',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: '#065f46', marginBottom: 5 }}>{item.title}</p>
                    <p style={{ fontSize: 15, color: '#444', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>❌</div>
              <h2 style={{ fontSize: 'clamp(20px,2vw,26px)', fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.01em' }}>Not Eligible for Return</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {NOT_ELIGIBLE.map((item, i) => (
                <div key={i} style={{
                  background: '#fff', border: '1.5px solid #fecaca',
                  borderRadius: 14, padding: '18px 22px',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(239,68,68,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: '#991b1b', marginBottom: 5 }}>{item.title}</p>
                    <p style={{ fontSize: 15, color: '#444', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Refund Methods */}
        <section>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>Where Does the Money Go?</p>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,36px)', fontWeight: 900, color: '#1C1C1E', letterSpacing: '-0.02em' }}>Refund Methods</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
            {[
              { method: 'Credit / Debit Card', time: '5–7 business days', icon: '💳', color: '#4f46e5' },
              { method: 'UPI / Net Banking', time: '3–5 business days', icon: '📲', color: '#0891b2' },
              { method: 'Wallets (Paytm etc.)', time: '1–3 business days', icon: '👛', color: '#7c3aed' },
              { method: 'GlowCoins (Store Credit)', time: 'Instant', icon: '✨', color: '#FC2779' },
              { method: 'COD Orders', time: '7–10 business days', icon: '💵', color: '#059669' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #F0E0EA',
                borderRadius: 16, padding: '24px 20px',
                display: 'flex', flexDirection: 'column', gap: 12,
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.boxShadow = `0 6px 24px ${item.color}20`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0E0EA'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{item.icon}</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E', lineHeight: 1.3 }}>{item.method}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <p style={{ fontSize: 15, color: item.color, fontWeight: 700 }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: '#888', marginTop: 18, lineHeight: 1.7 }}>
            * Refund timelines begin from the date GlowPick approves your return after quality inspection. Delays due to banking processes or bank holidays are outside GlowPick's control.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>Got Questions?</p>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,36px)', fontWeight: 900, color: '#1C1C1E', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: '#fff',
                border: `1.5px solid ${openFaq === i ? '#FC2779' : '#F0E0EA'}`,
                borderRadius: 16, overflow: 'hidden',
                transition: 'border-color 0.2s',
                boxShadow: openFaq === i ? '0 4px 24px rgba(252,39,121,0.1)' : 'none',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '22px 28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#1C1C1E', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: openFaq === i ? '#FC2779' : '#FFF0F7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, color: openFaq === i ? '#fff' : '#FC2779',
                    fontWeight: 700, transition: 'all 0.2s',
                  }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 28px 24px' }}>
                    <p style={{ fontSize: 15, color: '#444', lineHeight: 1.85, borderTop: '1px solid #F5EAF0', paddingTop: 16, margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #FC2779, #ff6bad)',
          borderRadius: 20, padding: 'clamp(32px,4vw,52px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 28, flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.01em' }}>Still need help?</h3>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 15, lineHeight: 1.6 }}>Our customer support team is available Mon–Sat, 9 AM – 6 PM IST.</p>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="mailto:support@glowpick.in" style={{
              background: '#fff', color: '#FC2779',
              borderRadius: 99, padding: '13px 26px',
              fontSize: 15, fontWeight: 800, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              📧 Email Support
            </a>
            <div style={{
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              borderRadius: 99, padding: '13px 26px',
              fontSize: 15, fontWeight: 700,
              border: '1.5px solid rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              📞 1800-XXX-XXXX
            </div>
          </div>
        </div>

        {/* Related links */}
        <div style={{
          background: '#1C1C1E', borderRadius: 16, padding: '32px 36px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 5 }}>Related Policies</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Read our other legal documents</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[{ label: 'Privacy Policy', to: '/privacy' }, { label: 'Terms of Use', to: '/terms' }].map(l => (
              <Link key={l.label} to={l.to} style={{
                background: 'rgba(252,39,121,0.15)', color: '#FF6BAD',
                border: '1px solid rgba(252,39,121,0.3)',
                borderRadius: 99, padding: '10px 22px',
                fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FC2779'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(252,39,121,0.15)'; e.currentTarget.style.color = '#FF6BAD'; }}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
