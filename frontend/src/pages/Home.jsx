import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import { toast } from 'react-toastify';
import { products as localProducts } from '../assets/productData';

const HERO_SLIDES = [
  {
    tag: 'NEW LAUNCH',
    heading: 'Glow Like\nNever Before',
    sub: 'Discover AI-matched skincare for your unique skin type and concerns.',
    cta: 'EXPLORE SKINCARE',
    to: '/products?category=Skincare',
    image: 'https://media6.ppl-media.com/tr:w-1280,c-at_max,pr-true,dpr-2/mediafiles/ecomm/misc/1770123465_dermdoc-_niacinamide-serum-new_2596x836.jpeg',
  },
  {
    tag: 'BESTSELLER',
    heading: 'Makeup That\nSpeaks',
    sub: 'Top-rated products loved by millions. From bold lips to flawless base.',
    cta: 'SHOP MAKEUP',
    to: '/products?category=Makeup',
    image: 'https://media6.ppl-media.com/tr:w-1280,c-at_max,pr-true,dpr-2/mediafiles/ecomm/misc/1770123478_maybelline-mascara-makeup-copy-1_2596x836.jpeg',
  },
  {
    tag: 'TRENDING NOW',
    heading: 'Define Your\nBeauty',
    sub: 'Premium picks curated by AI. Shop looks that are made for you.',
    cta: 'SHOP NOW',
    to: '/products',
    image: 'https://media6.ppl-media.com/tr:w-1280,c-at_max,pr-true,dpr-2/mediafiles/ecomm/misc/1769895753_lakme-makeup-eyeconic_2596x836-1.jpeg',
  },
  {
    tag: 'EXCLUSIVE',
    heading: 'Gentle.\nEffective. You.',
    sub: 'Dermatologist-recommended skincare for every skin type and tone.',
    cta: 'SHOP SKINCARE',
    to: '/products?category=Skincare',
    image: 'https://media6.ppl-media.com/tr:w-1280,c-at_max,pr-true,dpr-2/mediafiles/ecomm/misc/1770181257_cetaphil-new-look_2596x836.jpeg',
  },
];

const CATEGORIES = [
  {
    name: 'Makeup',
    to: '/products?category=Makeup',
    desc: '50+ Products',
    image: 'https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Skincare',
    to: '/products?category=Skincare',
    desc: '40+ Products',
    image: 'https://images.unsplash.com/photo-1591130901921-3f0652bb3915?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Haircare',
    to: '/products?category=Haircare',
    desc: '25+ Products',
    image: 'https://images.unsplash.com/photo-1734892498467-9344ffc6917b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Fragrance',
    to: '/products?category=Fragrance',
    desc: '15+ Products',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const PERKS = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#FC2779" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5S5.17 15.5 6 15.5s1.5.67 1.5 1.5S6.83 18.5 6 18.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    label: 'Free Delivery',
    sub: 'On orders above ₹299',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#FC2779" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
      </svg>
    ),
    label: '100% Authentic',
    sub: 'Verified genuine products',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#FC2779" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
      </svg>
    ),
    label: 'Easy Returns',
    sub: '7-day hassle-free returns',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#FC2779" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
      </svg>
    ),
    label: 'Secure Payments',
    sub: 'UPI, Cards, Wallets & more',
  },
];

const VALUES = [
  { icon: '🤖', title: 'AI-Powered Recommendations', desc: 'Our algorithm matches products to your unique skin type, concerns and allergies in seconds.' },
  { icon: '🏆', title: 'Only Curated Brands', desc: "Every product is hand-picked — Maybelline, Lakme, L'Oreal, SUGAR, Minimalist and more." },
  { icon: '🌿', title: 'Clean & Sustainable', desc: 'Cruelty-free, ethically sourced products. No parabens, no sulfates, no compromises.' },
];

/* ─── FLOATING AI BUTTON ─────────────────────────────────────────── */
function FloatingAIButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/recommend"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: 36,
        right: 36,
        width: 110,
        height: 110,
        borderRadius: '50%',
        background: hovered
          ? 'linear-gradient(135deg, #B5006B, #D91A66)'
          : 'linear-gradient(135deg, #D91A66, #FC2779)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        zIndex: 9999,
        cursor: 'pointer',
        transform: hovered ? 'scale(1.1) translateY(-3px)' : 'scale(1)',
        transition: 'all .3s ease',
        boxShadow: hovered
          ? '0 16px 48px rgba(252,39,121,.6)'
          : '0 8px 28px rgba(252,39,121,.42)',
        border: '3px solid rgba(255,255,255,.3)',
      }}
    >
      <svg
        width="62"
        height="62"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="32" y1="6" x2="32" y2="15" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="4" r="3.5" fill="white" />
        <rect x="11" y="15" width="42" height="28" rx="11" fill="white" />
        <circle cx="23" cy="27" r="5.5" fill="#FC2779" />
        <circle cx="41" cy="27" r="5.5" fill="#FC2779" />
        <circle cx="24.8" cy="25.2" r="2" fill="white" />
        <circle cx="42.8" cy="25.2" r="2" fill="white" />
        <rect x="24" y="35" width="16" height="4" rx="2" fill="#FC2779" opacity=".5" />
        <path d="M26 43 L32 52 L38 43" fill="white" />
      </svg>
    </a>
  );
}

/* ─── PRODUCT CARD ───────────────────────────────────────────────── */
function ProductCard({ product, onAddToCart }) {
  const [hov, setHov] = useState(false);
  const price = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice : product.price;
  const pct = product.discountPrice && product.discountPrice < product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 18,
        border: `1.5px solid ${hov ? '#FC2779' : '#F0E0EA'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow .25s, transform .25s, border-color .25s',
        boxShadow: hov ? '0 14px 44px rgba(252,39,121,.18)' : '0 2px 12px rgba(0,0,0,.05)',
        transform: hov ? 'translateY(-5px)' : 'none',
        cursor: 'pointer',
        width: '100%',
        minHeight: '480px',
        padding: '12px',
        justifyContent: 'space-between',
      }}
    >
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
        <div style={{ position: 'relative', aspectRatio: '1', background: '#FFF5FA', overflow: 'hidden', borderRadius: 12 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform .5s',
              transform: hov ? 'scale(1.06)' : 'scale(1)',
            }}
            onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80'; }}
          />
          {pct > 0 && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: '#FC2779', color: '#fff',
              fontSize: 13, fontWeight: 900,
              padding: '6px 12px', borderRadius: 6, zIndex: 10,
              boxShadow: '0 4px 10px rgba(252,39,121,.4)',
              letterSpacing: '.02em',
            }}>
              {pct}% OFF
            </div>
          )}
          {product.rating >= 4.7 && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(255,255,255,.94)', color: '#1C1C1E',
              fontSize: 12, fontWeight: 800,
              padding: '6px 10px', borderRadius: 8,
              backdropFilter: 'blur(4px)',
            }}>
              ⭐ {product.rating}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 8px 6px' }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: '#FC2779',
            textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8,
          }}>
            {product.brand}
          </div>
          <div style={{
            fontSize: 16, fontWeight: 700, color: '#1C1C1E',
            lineHeight: 1.4, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '45px',
          }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{
                fontSize: 16,
                color: i <= Math.round(product.rating || 4) ? '#F59E0B' : '#E5E7EB',
                lineHeight: 1,
              }}>★</span>
            ))}
            <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 5, fontWeight: 600 }}>
              ({(product.numReviews || 0).toLocaleString()})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E' }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            {pct > 0 && (
              <span style={{ fontSize: 15, color: '#B0B0B0', textDecoration: 'line-through', fontWeight: 500 }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 8px 12px', marginTop: 'auto' }}>
        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: '100%', height: 48,
            border: '2px solid #FC2779', borderRadius: 12,
            background: hov ? '#FC2779' : '#fff',
            color: hov ? '#fff' : '#FC2779',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            transition: 'all .2s', letterSpacing: '.06em',
          }}
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}

/* ─── SECTION HEADER ─────────────────────────────────────────────── */
function SectionHeader({ eyebrow, title, sub, linkTo, linkLabel = 'View All →' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        {eyebrow && (
          <div style={{
            fontSize: 13, fontWeight: 800, color: '#FC2779',
            textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 8,
          }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{
          fontSize: 'clamp(24px,2.8vw,36px)',
          fontWeight: 900, color: '#1C1C1E',
          letterSpacing: '-.02em', lineHeight: 1.1,
          marginBottom: sub ? 8 : 0,
        }}>
          {title}
        </h2>
        {sub && (
          <p style={{ fontSize: 15, color: '#6E6E73', fontWeight: 400, marginTop: 4 }}>{sub}</p>
        )}
      </div>
      {linkTo && (
        <Link to={linkTo} style={{
          fontSize: 18, fontWeight: 800, color: '#FC2779',
          textDecoration: 'none', whiteSpace: 'nowrap',
          letterSpacing: '.02em', flexShrink: 0, marginLeft: 24,
        }}>
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

/* ─── PRODUCT GRID ───────────────────────────────────────────────── */
function ProductGrid({ products, onAddToCart }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 24,
    }}>
      {products.map(p => <ProductCard key={p._id} product={p} onAddToCart={onAddToCart} />)}
    </div>
  );
}

/* ─── MAIN HOME ──────────────────────────────────────────────────── */
export default function Home() {
  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState('');
  const timerRef = useRef(null);

  const makeupProducts   = localProducts.filter(p => p.category === 'Makeup').slice(0, 5);
  const skincareProducts = localProducts.filter(p => p.category === 'Skincare').slice(0, 5);
  const haircareProducts = localProducts.filter(p => p.category === 'Haircare').slice(0, 5);
  const bestSellers      = [...localProducts].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0)).slice(0, 5);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4500);
  };
  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);
  const goSlide = i => { setSlide(i); startTimer(); };

  const addToCart = p => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...p, qty: 1 } });
    toast.success(`${p.name.slice(0, 30)}… added to bag! 🛍️`);
  };

  const s = HERO_SLIDES[slide];
  const PAD = 'clamp(20px,5vw,64px)';

  return (
    <div style={{ background: '#FFFBF8', width: '100%', boxSizing: 'border-box' }}>

      {/* ══ HERO BANNER ══════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', width: '100%',
        height: 'clamp(380px,62vw,836px)',
        overflow: 'hidden', background: '#111',
      }}>
        {HERO_SLIDES.map((sl, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === slide ? 1 : 0,
            transition: 'opacity 1s ease',
          }}>
            <img
              src={sl.image} alt={sl.tag}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 40%, rgba(0,0,0,.05) 100%)',
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: `0 ${PAD}`, maxWidth: 560,
        }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(252,39,121,.92)', color: '#fff',
            fontSize: 13, fontWeight: 800, letterSpacing: '.16em',
            textTransform: 'uppercase', padding: '5px 16px',
            borderRadius: 99, width: 'fit-content', marginBottom: 20,
          }}>{s.tag}</span>

          <h1 style={{
            fontSize: 'clamp(38px,4.5vw,64px)',
            fontWeight: 900, color: '#fff', lineHeight: 1.05,
            letterSpacing: '-.03em', whiteSpace: 'pre-line',
            marginBottom: 18, textShadow: '0 2px 20px rgba(0,0,0,.4)',
          }}>{s.heading}</h1>

          <p style={{
            fontSize: 'clamp(15px,1.4vw,18px)',
            color: 'rgba(255,255,255,.88)', lineHeight: 1.7,
            marginBottom: 34, maxWidth: 480, fontWeight: 400,
          }}>{s.sub}</p>

          <button
            onClick={() => navigate(s.to)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              border: '2.5px solid #fff', background: 'transparent',
              color: '#fff', fontSize: 14, fontWeight: 800,
              letterSpacing: '.14em', padding: '14px 36px',
              borderRadius: 99, cursor: 'pointer', width: 'fit-content',
              transition: 'all .25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1C1C1E'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
          >
            {s.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} style={{
              border: 'none', cursor: 'pointer', borderRadius: 99, padding: 0,
              background: i === slide ? '#fff' : 'rgba(255,255,255,.38)',
              width: i === slide ? 28 : 8, height: 8,
              transition: 'all .35s',
            }} />
          ))}
        </div>

        {['prev', 'next'].map(dir => (
          <button key={dir}
            onClick={() => goSlide(dir === 'next'
              ? (slide + 1) % HERO_SLIDES.length
              : (slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
            )}
            style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              [dir === 'next' ? 'right' : 'left']: 'clamp(10px,2vw,28px)',
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,.18)',
              border: '1.5px solid rgba(255,255,255,.4)',
              color: '#fff', fontSize: 26, cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.35)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.18)'}
          >
            {dir === 'next' ? '›' : '‹'}
          </button>
        ))}
      </div>

      {/* ══ PERKS BAR ════════════════════════════════════════════════ */}
      <div style={{ background: '#FFFBF8', padding: `20px ${PAD}`, borderBottom: '1px solid #F5E0EC' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '18px 24px', background: '#fff',
              borderRadius: 16, border: '1.5px solid #F5E0EC',
              boxShadow: '0 2px 12px rgba(252,39,121,.06)',
            }}>
              <div style={{
                width: 58, height: 58, borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFF0F7, #FFE0EF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: '1.5px solid #FFD6EA',
              }}>
                {p.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1C1C1E', marginBottom: 3, letterSpacing: '-.01em' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 18, color: '#6E6E73', lineHeight: 1.5 }}>
                  {p.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CATEGORIES ═══════════════════════════════════════════════ */}
      <div style={{ padding: `clamp(32px,4vw,60px) ${PAD}` }}>
        <SectionHeader title="Shop by Category" linkTo="/products" linkLabel="All Categories →" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '260px 260px',
          gap: 16,
        }}>
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.name} to={cat.to} style={{
              gridColumn: i === 0 ? '1' : 'auto',
              gridRow: i === 0 ? '1 / 3' : 'auto',
              position: 'relative', borderRadius: 20,
              overflow: 'hidden', textDecoration: 'none', display: 'block',
            }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}
                onMouseEnter={e => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1.07)'; }}
                onMouseLeave={e => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1)'; }}
              >
                <img src={cat.image} alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .55s ease', display: 'block' }}
                  onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 55%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                  <div style={{
                    color: '#fff', fontWeight: 900, letterSpacing: '-.01em',
                    fontSize: i === 0 ? 'clamp(28px,3.5vw,48px)' : 'clamp(22px,2.5vw,32px)',
                    marginBottom: 8,
                  }}>{cat.name}</div>
                  <div style={{
                    color: '#fff', fontSize: 15, fontWeight: 700,
                    background: '#FC2779', padding: '7px 16px',
                    borderRadius: 99, display: 'inline-block', letterSpacing: '.02em',
                  }}>{cat.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ BEST SELLERS ═════════════════════════════════════════════ */}
      <div style={{ padding: `0 ${PAD} clamp(32px,4vw,60px)` }}>
        <SectionHeader
          eyebrow="🔥 Most Loved"
          title="Best Sellers"
          sub="Top-rated products by our community"
          linkTo="/products"
          linkLabel="View All →"
        />
        <ProductGrid products={bestSellers} onAddToCart={addToCart} />
      </div>

      {/* ══ AI BANNER ════════════════════════════════════════════════ */}
      <div style={{ padding: `0 ${PAD} clamp(40px,6vw,80px)` }}>
        <div style={{
          background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
          borderRadius: 32, padding: 'clamp(48px,8vw,80px) clamp(40px,6vw,100px)',
          position: 'relative', overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1.2fr 0.8fr',
          alignItems: 'center', gap: 40,
          boxShadow: '0 20px 50px rgba(233,30,99,.25)',
        }}>
          <div style={{ position: 'absolute', right: '-5%', top: '-20%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: '15%', bottom: '-30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: 'clamp(32px,5vw,62px)', fontWeight: 900, color: '#fff',
              lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: 24,
            }}>
              Your Perfect Routine,<br />
              <span style={{ opacity: .9 }}>Defined by AI.</span>
            </h2>
            <p style={{
              fontSize: 'clamp(16px,1.6vw,20px)',
              color: 'rgba(255,255,255,.9)', lineHeight: 1.6,
              marginBottom: 40, maxWidth: 520, fontWeight: 400,
            }}>
              Our algorithm analyzes your skin texture, concerns, and environment to recommend a personalized GlowPick regimen in seconds.
            </p>
            <Link to="/recommend" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: '#fff', color: '#C2185B',
              fontSize: 15, fontWeight: 800, letterSpacing: '.05em',
              padding: '18px 42px', borderRadius: 16,
              textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,.15)',
              transition: 'all .3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,.15)'; }}
            >
              ✦ TRY AI SKIN ANALYSIS
            </Link>
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 1 }}>
            <div style={{
              width: 'clamp(180px,20vw,280px)', height: 'clamp(180px,20vw,280px)',
              borderRadius: '50%',
              background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'clamp(60px,8vw,100px)', color: '#fff',
            }}>✦</div>
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px solid rgba(255,255,255,.1)' }} />
            <div style={{ position: 'absolute', inset: -50, borderRadius: '50%', border: '1px dashed rgba(255,255,255,.05)' }} />
          </div>
        </div>
      </div>

      {/* ══ SKINCARE ESSENTIALS ══════════════════════════════════════ */}
      <div style={{ padding: `0 ${PAD} clamp(32px,4vw,60px)` }}>
        <SectionHeader
          eyebrow="🌿 Clean Beauty"
          title="Skincare Essentials"
          sub="The foundation for every glowing routine"
          linkTo="/products?category=Skincare"
          linkLabel="Shop Skincare →"
        />
        <ProductGrid products={skincareProducts} onAddToCart={addToCart} />
      </div>

      {/* ══ MAKEUP MUST-HAVES ════════════════════════════════════════ */}
      <div style={{ padding: `0 ${PAD} clamp(32px,4vw,60px)` }}>
        <SectionHeader
          eyebrow="💄 Trending Now"
          title="Makeup Must-Haves"
          sub="Bold looks, bestselling formulas"
          linkTo="/products?category=Makeup"
          linkLabel="Shop Makeup →"
        />
        <ProductGrid products={makeupProducts} onAddToCart={addToCart} />
      </div>

      {/* ══ HAIRCARE ════════════════════════════════════════════════ */}
      <div style={{ padding: `0 ${PAD} clamp(32px,4vw,60px)` }}>
        <SectionHeader
          eyebrow="💆 Top Picks"
          title="Haircare Favorites"
          sub="Clinically proven, loved by millions"
          linkTo="/products?category=Haircare"
          linkLabel="Shop Haircare →"
        />
        <ProductGrid products={haircareProducts} onAddToCart={addToCart} />
      </div>

      {/* ══ GLOWPICK PROMISE ═════════════════════════════════════════ */}
      <div style={{ padding: `0 ${PAD} clamp(32px,4vw,60px)` }}>
        <div style={{
          background: '#fff', borderRadius: 24,
          padding: 'clamp(36px,5vw,64px) clamp(28px,4vw,64px)',
          border: '1.5px solid #F0E0EA',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 900, color: '#1C1C1E', letterSpacing: '-.02em', marginBottom: 10 }}>
              The GlowPick Promise
            </h2>
            <p style={{ fontSize: 20, color: '#6E6E73' }}>Why 2 million+ customers trust us</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'clamp(24px,4vw,56px)' }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ textAlign: 'center', padding: '0 12px' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#FFF0F7,#FFE0EF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 30, border: '1.5px solid #F0E0EA',
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1C1E', marginBottom: 12, letterSpacing: '-.01em' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: 20, color: '#6E6E73', lineHeight: 1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ NEWSLETTER ══════════════════════════════════════════════ */}
      <div style={{ padding: `0 ${PAD} clamp(40px,5vw,80px)` }}>
        <div style={{
          background: '#1C1C1E', borderRadius: 24,
          padding: 'clamp(32px,4vw,56px) clamp(36px,5vw,72px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(20px,2.5vw,32px)', fontWeight: 900, color: '#fff', letterSpacing: '-.02em', marginBottom: 8 }}>
              Get 10% off your first order
            </h2>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,.55)' }}>
              Join 2M+ beauty lovers. Unsubscribe anytime.
            </p>
          </div>
          <div style={{ display: 'flex', flexShrink: 0 }}>
            <input
              type="email" placeholder="Your email address"
              value={email} onChange={e => setEmail(e.target.value)}
              style={{
                height: 52, padding: '0 20px', minWidth: 260,
                border: 'none', borderRadius: '12px 0 0 12px',
                fontSize: 18, fontFamily: 'inherit',
                background: 'rgba(255,255,255,.1)', color: '#fff', outline: 'none',
              }}
              onFocus={e => e.target.style.background = 'rgba(255,255,255,.18)'}
              onBlur={e => e.target.style.background = 'rgba(255,255,255,.1)'}
            />
            <button
              onClick={() => { if (email) { toast.success('Subscribed! 10% code sent ✨'); setEmail(''); } }}
              style={{
                height: 52, padding: '0 28px',
                background: '#FC2779', border: 'none',
                borderRadius: '0 12px 12px 0',
                color: '#fff', fontSize: 18, fontWeight: 700,
                cursor: 'pointer', transition: 'background .2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#D91A66'}
              onMouseLeave={e => e.currentTarget.style.background = '#FC2779'}
            >
              Subscribe →
            </button>
          </div>
        </div>
      </div>

      {/* ══ FLOATING AI BUTTON ══════════════════════════════════════ */}
      <FloatingAIButton />

    </div>
  );
}