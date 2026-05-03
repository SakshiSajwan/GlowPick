import { useState } from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    id: 'info-collect',
    title: '1. Information We Collect',
    content: [
      {
        sub: 'Personal Information',
        text: 'When you create an account, place an order, or use our AI Skin Analysis feature, we collect information you provide directly — including your name, email address, phone number, delivery address, and payment details.',
      },
      {
        sub: 'Skin & Beauty Data',
        text: 'When you use our AI Skin Analysis feature, we may collect photos, skin type information, skin concerns, and other beauty preferences you provide. This data is used solely to personalise your product recommendations and is never sold to third parties.',
      },
      {
        sub: 'Usage Data',
        text: 'We automatically collect data about how you interact with GlowPick — pages visited, products viewed, search queries, time spent, device type, browser, IP address, and referring URLs.',
      },
      {
        sub: 'Cookies & Tracking',
        text: 'We use cookies, web beacons, and similar tracking technologies to enhance your browsing experience, remember your preferences, and serve relevant content. You can control cookie settings in your browser at any time.',
      },
    ],
  },
  {
    id: 'how-use',
    title: '2. How We Use Your Information',
    content: [
      { sub: 'Order Fulfilment', text: 'To process, confirm, ship and deliver your orders; send order-related communications; and handle returns or refunds.' },
      { sub: 'Personalisation', text: 'To power our AI Skin Analysis engine, recommend products tailored to your skin profile, and customise your homepage experience.' },
      { sub: 'Communications', text: 'To send transactional emails (receipts, shipping updates), promotional offers (with your consent), and service announcements.' },
      { sub: 'Analytics & Improvement', text: 'To understand how our platform is used, diagnose technical issues, test new features, and continuously improve GlowPick.' },
      { sub: 'Legal & Safety', text: 'To comply with applicable laws, enforce our Terms of Use, prevent fraud, and protect the rights and safety of GlowPick and our users.' },
    ],
  },
  {
    id: 'sharing',
    title: '3. Information Sharing',
    content: [
      { sub: 'We Never Sell Your Data', text: 'GlowPick does not sell, rent, or trade your personal information to any third party for their own marketing purposes — ever.' },
      { sub: 'Service Providers', text: 'We share data with trusted vendors who help us operate the platform: payment processors (Razorpay), logistics partners, cloud hosting providers (AWS), and email delivery services. All vendors are contractually bound to protect your data.' },
      { sub: 'Legal Obligations', text: 'We may disclose information if required by law, court order, or government authority, or to protect the legal rights and safety of GlowPick, its users, or the public.' },
      { sub: 'Business Transfers', text: 'If GlowPick is acquired, merged, or undergoes a change of ownership, your data may be transferred as part of that transaction. We will notify you in advance.' },
    ],
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: [
      { sub: 'Encryption', text: 'All data transmitted between your browser and our servers is encrypted using TLS (HTTPS). Payment information is processed through PCI-DSS-compliant systems and is never stored on GlowPick servers.' },
      { sub: 'Access Controls', text: 'Access to personal data within our organisation is restricted to employees and contractors who need it to perform their job functions, and is governed by strict internal policies.' },
      { sub: 'No System is Perfect', text: 'While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password and to log out after each session.' },
    ],
  },
  {
    id: 'your-rights',
    title: '5. Your Rights',
    content: [
      { sub: 'Access & Portability', text: 'You have the right to request a copy of all personal data we hold about you, in a structured, machine-readable format.' },
      { sub: 'Correction', text: 'You may update or correct your personal information at any time from your account settings, or by contacting us.' },
      { sub: 'Deletion', text: 'You may request deletion of your account and associated personal data. We will honour this request within 30 days, except where retention is required by law.' },
      { sub: 'Opt-Out', text: 'You may unsubscribe from marketing emails at any time using the unsubscribe link in any email, or by updating your notification preferences in your account settings.' },
    ],
  },
  {
    id: 'children',
    title: "6. Children's Privacy",
    content: [
      { sub: 'Age Restriction', text: 'GlowPick is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have done so, we will delete that information immediately.' },
    ],
  },
  {
    id: 'changes',
    title: '7. Changes to This Policy',
    content: [
      { sub: 'Updates', text: 'We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or by displaying a prominent notice on our website at least 14 days before the changes take effect.' },
    ],
  },
  {
    id: 'contact',
    title: '8. Contact Us',
    content: [
      { sub: 'Privacy Team', text: 'For any questions, requests, or concerns about your privacy, please contact our dedicated privacy team at privacy@glowpick.in or write to us at: GlowPick Beauty Technologies Pvt. Ltd., New Delhi, India.' },
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div style={{ background: '#FFFBF8', minHeight: '100vh', paddingBottom: 100 }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2d1a24 55%, #3d1030 100%)',
        padding: 'clamp(52px,7vw,96px) clamp(24px,6vw,80px)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(252,39,121,0.15)',
      }}>
        {/* Geometric accent lines — cleaner than blobs */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', borderLeft: '1px solid rgba(252,39,121,0.08)', background: 'linear-gradient(90deg, transparent, rgba(252,39,121,0.04))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(252,39,121,0.3), transparent)' }} />
        <div style={{ position: 'absolute', top: 0, left: '60%', width: 1, height: '100%', background: 'rgba(252,39,121,0.08)' }} />

        <div style={{ position: 'relative', maxWidth: 860 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 19, textDecoration: 'none', fontWeight: 500, transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = '#FC2779'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
            >Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 19 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 19, fontWeight: 600 }}>Privacy Policy</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px,5.5vw,68px)',
            fontWeight: 900, color: '#fff', lineHeight: 1.0,
            marginBottom: 18, letterSpacing: '-0.03em',
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.6vw,20px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 580, fontWeight: 400 }}>
            At GlowPick, we believe in complete transparency about how we collect, use, and protect your personal information.
          </p>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)', marginTop: 28, fontWeight: 500 }}>
            Last updated: April 30, 2026 · Effective: April 30, 2026
          </p>
        </div>
      </div>

      {/* ── Body — full width with sidebar ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: 0,
        alignItems: 'start',
        minHeight: '70vh',
      }}>

        {/* ── Sticky Sidebar ── */}
        <aside style={{
          position: 'sticky', top: 0,
          height: '100vh',
          background: '#fff',
          borderRight: '1px solid #F0E0EA',
          overflowY: 'auto',
          padding: '36px 0 40px',
        }}>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '0.14em', padding: '0 28px', marginBottom: 16 }}>Contents</p>
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block',
              padding: '11px 28px',
              fontSize: 20, fontWeight: 500,
              color: '#444',
              textDecoration: 'none',
              borderLeft: '3px solid transparent',
              transition: 'all 0.2s',
              lineHeight: 1.45,
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FC2779'; e.currentTarget.style.borderLeftColor = '#FC2779'; e.currentTarget.style.background = '#FFF0F7'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#444'; e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
            >
              {s.title.replace(/^\d+\.\s/, '')}
            </a>
          ))}
        </aside>

        {/* ── Main content — full remaining width ── */}
        <div style={{ padding: 'clamp(40px,5vw,72px) clamp(32px,5vw,80px)', display: 'flex', flexDirection: 'column', gap: 56 }}>

          {/* Intro card */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF0F7, #fff)',
            border: '1.5px solid #F0E0EA',
            borderRadius: 16, padding: '28px 36px',
          }}>
            <p style={{ fontSize: 24, color: '#333', lineHeight: 1.85, margin: 0 }}>
              This Privacy Policy describes how <strong style={{ color: '#FC2779' }}>GlowPick Beauty Technologies Pvt. Ltd.</strong> ("GlowPick", "we", "us", or "our") collects, uses, and shares information when you use our website, mobile applications, and services. By using GlowPick, you agree to the practices described in this policy.
            </p>
          </div>

          {SECTIONS.map(sec => (
            <section key={sec.id} id={sec.id} style={{ scrollMarginTop: 32 }}>
              <h2 style={{
                fontSize: 'clamp(22px,2.2vw,28px)',
                fontWeight: 800, color: '#1C1C1E',
                marginBottom: 24,
                paddingBottom: 14,
                borderBottom: '2px solid #F0E0EA',
                display: 'flex', alignItems: 'center', gap: 12,
                letterSpacing: '-0.01em',
              }}>
                <span style={{ width: 5, height: 26, background: '#FC2779', borderRadius: 99, display: 'inline-block', flexShrink: 0 }} />
                {sec.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {sec.content.map((item, i) => (
                  <div key={i} style={{
                    background: '#fff',
                    border: '1.5px solid #F5EAF0',
                    borderRadius: 14,
                    padding: '22px 28px',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(252,39,121,0.09)'; e.currentTarget.style.borderColor = '#FCCDE3'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F5EAF0'; }}
                  >
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                      {item.sub}
                    </p>
                    <p style={{ fontSize: 20, color: '#333', lineHeight: 1.85, margin: 0 }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Bottom links */}
          <div style={{
            background: '#1C1C1E', borderRadius: 16,
            padding: '32px 36px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
          }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 24, marginBottom: 5 }}>Related Policies</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 18 }}>Read our other legal documents</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[{ label: 'Terms of Use', to: '/terms' }, { label: 'Refund Policy', to: '/refund-policy' }].map(l => (
                <Link key={l.label} to={l.to} style={{
                  background: 'rgba(252,39,121,0.15)', color: '#FF6BAD',
                  border: '1px solid rgba(252,39,121,0.3)',
                  borderRadius: 99, padding: '10px 22px',
                  fontSize: 18, fontWeight: 700, textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FC2779'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(252,39,121,0.15)'; e.currentTarget.style.color = '#FF6BAD'; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}