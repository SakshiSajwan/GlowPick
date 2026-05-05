import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: [
      { sub: 'Agreement', text: 'By accessing or using the GlowPick website, mobile applications, or any related services (collectively, the "Platform"), you confirm that you are at least 18 years old (or 13 years old with parental consent), have read and understood these Terms, and agree to be legally bound by them.' },
      { sub: 'Updates to Terms', text: "GlowPick reserves the right to modify these Terms at any time. We will provide at least 14 days' notice of material changes via email or a prominent banner on the Platform. Continued use after the effective date constitutes acceptance of the revised Terms." },
    ],
  },
  {
    id: 'account',
    title: '2. Your Account',
    content: [
      { sub: 'Registration', text: 'To access certain features — including order history, saved addresses, and AI Skin Analysis — you must create an account. You agree to provide accurate, current, and complete information during registration.' },
      { sub: 'Account Security', text: 'You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account. Notify us immediately at glowpick04@gmail.com if you suspect any unauthorised access.' },
      { sub: 'Termination', text: 'GlowPick reserves the right to suspend or terminate your account at any time if you violate these Terms, engage in fraudulent activity, or conduct yourself in a manner that harms GlowPick or other users.' },
    ],
  },
  {
    id: 'orders',
    title: '3. Orders & Pricing',
    content: [
      { sub: 'Order Acceptance', text: 'Placing an order constitutes an offer to purchase. GlowPick reserves the right to refuse or cancel any order at our discretion — including if a product is out of stock, if there is an error in the product description or pricing, or if we suspect fraud.' },
      { sub: 'Pricing', text: 'All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Shipping charges, if any, are displayed at checkout. GlowPick reserves the right to change prices at any time without prior notice.' },
      { sub: 'Payment', text: 'We accept UPI, credit/debit cards, net banking, and popular digital wallets via our payment partner, Razorpay. By providing payment information, you represent that you are authorised to use the payment method.' },
      { sub: 'Product Descriptions', text: 'GlowPick endeavours to describe products accurately. However, we do not warrant that descriptions, images, or other content are complete, accurate, or error-free. If a product you receive is materially different from its description, you may return it under our Refund Policy.' },
    ],
  },
  {
    id: 'ai-analysis',
    title: '4. AI Skin Analysis',
    content: [
      { sub: 'Not Medical Advice', text: "GlowPick's AI Skin Analysis feature provides personalised cosmetic product recommendations based on the information you supply. It is not a substitute for professional medical or dermatological advice. Always consult a qualified dermatologist for skin conditions or medical concerns." },
      { sub: 'Data Usage', text: 'Photos and skin data you provide for AI Analysis are processed to generate recommendations. This data is handled in accordance with our Privacy Policy and is not shared with third parties for marketing purposes.' },
      { sub: 'Accuracy', text: 'AI recommendations are probabilistic and may not be perfectly suited to every individual. GlowPick makes no guarantees about the effectiveness of recommended products for any specific user.' },
    ],
  },
  {
    id: 'prohibited',
    title: '5. Prohibited Conduct',
    content: [
      { sub: 'You Must Not', text: 'Use the Platform for any unlawful purpose or in violation of any regulations; post false, misleading, or defamatory product reviews; attempt to gain unauthorised access to our systems; use automated tools (bots, scrapers) to collect data from the Platform without written permission; resell products purchased on GlowPick without authorisation; or impersonate any person or entity.' },
      { sub: 'Consequences', text: 'Violation of this section may result in immediate account suspension, cancellation of pending orders without refund, and legal action where appropriate.' },
    ],
  },
  {
    id: 'ip',
    title: '6. Intellectual Property',
    content: [
      { sub: 'GlowPick Content', text: 'All content on the Platform — including logos, text, graphics, images, product descriptions, UI design, and software — is the exclusive property of GlowPick Beauty Technologies Pvt. Ltd. or its licensors and is protected by Indian and international copyright, trademark, and intellectual property laws.' },
      { sub: 'Limited Licence', text: 'We grant you a limited, non-exclusive, non-transferable, revocable licence to access and use the Platform for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works of any Platform content without our prior written consent.' },
      { sub: 'User Reviews', text: 'By submitting a product review, photo, or other content to GlowPick, you grant us a worldwide, royalty-free, perpetual licence to use, display, and distribute that content on the Platform and in our marketing materials.' },
    ],
  },
  {
    id: 'liability',
    title: '7. Limitation of Liability',
    content: [
      { sub: 'As-Is Basis', text: 'The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including merchantability, fitness for a particular purpose, or non-infringement.' },
      { sub: 'Liability Cap', text: "To the maximum extent permitted by applicable law, GlowPick's total liability to you for any claim arising from use of the Platform is limited to the amount you paid for the specific order giving rise to the claim in the three months preceding the claim." },
      { sub: 'Indirect Damages', text: 'GlowPick is not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, even if advised of the possibility of such damages.' },
    ],
  },
  {
    id: 'governing',
    title: '8. Governing Law & Disputes',
    content: [
      { sub: 'Governing Law', text: 'These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from or related to these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.' },
      { sub: 'Informal Resolution', text: 'Before initiating formal legal proceedings, both parties agree to attempt to resolve disputes informally by contacting GlowPick at glowpick04@gmail.com. We will make good-faith efforts to resolve the issue within 30 days.' },
    ],
  },
  {
    id: 'contact',
    title: '9. Contact',
    content: [
      { sub: 'Legal Queries', text: 'For legal questions about these Terms, please write to glowpick04@gmail.com or GlowPick Beauty Technologies Pvt. Ltd., New Delhi, India.' },
    ],
  },
];

export default function TermsOfUse() {
  return (
    <div style={{ background: '#FFFBF8', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1923 0%, #1a0a2e 50%, #2d0a1e 100%)',
        padding: 'clamp(52px,7vw,96px) clamp(24px,6vw,80px)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(252,39,121,0.15)',
      }}>
        {/* Geometric lines */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', borderLeft: '1px solid rgba(252,39,121,0.08)', background: 'linear-gradient(90deg, transparent, rgba(252,39,121,0.04))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(252,39,121,0.3), transparent)' }} />
        <div style={{ position: 'absolute', top: 0, left: '60%', width: 1, height: '100%', background: 'rgba(252,39,121,0.07)' }} />

        <div style={{ position: 'relative', maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = '#FC2779'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
            >Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 15 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 600 }}>Terms of Use</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(30px,4.5vw,48px)',
            fontWeight: 900, color: '#fff', lineHeight: 1.0,
            marginBottom: 18, letterSpacing: '-0.03em',
          }}>
            Terms of Use
          </h1>
          <p style={{ fontSize: 'clamp(13px,1.3vw,16px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 580, fontWeight: 400 }}>
            Please read these Terms carefully before using GlowPick. They govern your use of our platform, products, and services.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 28, fontWeight: 500 }}>
            Last updated: April 30, 2026 · Effective: April 30, 2026
          </p>
        </div>
      </div>

      {/* Body — full width with sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: 0,
        alignItems: 'start',
        minHeight: '70vh',
      }}>

        {/* Sticky Sidebar */}
        <aside style={{
          position: 'sticky', top: 0,
          height: '100vh',
          background: '#fff',
          borderRight: '1px solid #F0E0EA',
          overflowY: 'auto',
          padding: '36px 0 40px',
        }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '0.14em', padding: '0 28px', marginBottom: 16 }}>Contents</p>
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block',
              padding: '11px 28px',
              fontSize: 13, fontWeight: 500,
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

        {/* Main content */}
        <div style={{ padding: 'clamp(40px,5vw,72px) clamp(32px,5vw,80px)', display: 'flex', flexDirection: 'column', gap: 56 }}>

          {/* Warning banner */}
          <div style={{
            background: 'linear-gradient(135deg, #fff8e1, #fff)',
            border: '1.5px solid #fde68a',
            borderRadius: 16, padding: '24px 28px',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>⚠️</span>
            <p style={{ fontSize: 14, color: '#333', lineHeight: 1.85, margin: 0 }}>
              <strong style={{ color: '#1C1C1E' }}>Please read carefully.</strong> These Terms of Use constitute a legally binding agreement between you and GlowPick Beauty Technologies Pvt. Ltd. If you do not agree to any part of these Terms, you must not use the Platform.
            </p>
          </div>

          {SECTIONS.map(sec => (
            <section key={sec.id} id={sec.id} style={{ scrollMarginTop: 32 }}>
              <h2 style={{
                fontSize: 'clamp(18px,1.8vw,22px)',
                fontWeight: 800, color: '#1C1C1E',
                marginBottom: 24, paddingBottom: 14,
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
                    background: '#fff', border: '1.5px solid #F5EAF0',
                    borderRadius: 14, padding: '22px 28px',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(252,39,121,0.09)'; e.currentTarget.style.borderColor = '#FCCDE3'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F5EAF0'; }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                      {item.sub}
                    </p>
                    <p style={{ fontSize: 13, color: '#333', lineHeight: 1.85, margin: 0 }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Related links */}
          <div style={{
            background: '#1C1C1E', borderRadius: 16,
            padding: '32px 36px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
          }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 5 }}>Related Policies</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Other legal documents you should know about</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[{ label: 'Privacy Policy', to: '/privacy' }, { label: 'Refund Policy', to: '/refund-policy' }].map(l => (
                <Link key={l.label} to={l.to} style={{
                  background: 'rgba(252,39,121,0.15)', color: '#FF6BAD',
                  border: '1px solid rgba(252,39,121,0.3)',
                  borderRadius: 99, padding: '10px 22px',
                  fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FC2779'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(252,39,121,0.15)'; e.currentTarget.style.color = '#FF6BAD'; }}
                >{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
