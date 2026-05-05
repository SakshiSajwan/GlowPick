import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import { toast } from 'react-toastify';

const NAV_LINKS = [
    { label: 'Home',         to: '/',                             exact: true       },
    { label: 'Makeup',       to: '/products?category=Makeup',     cat: 'Makeup'     },
    { label: 'Skincare',     to: '/products?category=Skincare',   cat: 'Skincare'   },
    { label: 'Haircare',     to: '/products?category=Haircare',   cat: 'Haircare'   },
    { label: 'Fragrance',    to: '/products?category=Fragrance',  cat: 'Fragrance'  },
    { label: 'All Products', to: '/products',                     allProducts: true },
];

const MARQUEE_ITEMS = [
    '🎁 Free delivery on orders above ₹299',
    '✨ Use code GLOW10 for 10% off',
    '💄 New arrivals every week!',
    '🌸 Cruelty-free & dermatologist-tested',
    '🚚 Express delivery available',
    '💅 Explore 500+ beauty products',
];

export default function Header() {
    const { state, dispatch, openLogin, userInfo, cartItems } = useGlobalContext();
    const navigate  = useNavigate();
    const location  = useLocation();

    const [keyword,      setKeyword]      = useState('');
    const [scrolled,     setScrolled]     = useState(false);
    const [mobileOpen,   setMobileOpen]   = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 4);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

    const searchHandler = (e) => {
        e.preventDefault();
        navigate(keyword.trim() ? `/products?search=${keyword.trim()}` : '/products');
    };

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        dispatch({ type: 'USER_LOGOUT' });
        toast.success('Logged out successfully');
        navigate('/');
    };

    const cartCount = cartItems.reduce((a, i) => a + (i.qty || 1), 0);

    const urlParams       = new URLSearchParams(location.search);
    const currentCategory = urlParams.get('category');

    const isLinkActive = (link) => {
        if (link.exact)       return location.pathname === '/';
        if (link.allProducts) return location.pathname === '/products' && !currentCategory;
        if (link.cat)         return location.pathname === '/products' && currentCategory === link.cat;
        return false;
    };

    const activeStyle = {
        color: '#FC2779',
        fontWeight: 700,
        background: 'linear-gradient(to bottom, #fff, #FFF5FA)',
        borderBottom: '3px solid #FC2779',
    };
    const inactiveStyle = {
        color: '#2D2D2D',
        fontWeight: 600,
        background: 'transparent',
        borderBottom: '3px solid transparent',
    };

    const marqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

    return (
        <>
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .gp-marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marquee 32s linear infinite;
                }
                .gp-marquee-track:hover { animation-play-state: paused; }
                .gp-nav-link {
                    transition: color 0.18s, background 0.18s, border-color 0.18s !important;
                }
                .gp-nav-link:hover {
                    color: #FC2779 !important;
                    background: linear-gradient(to bottom, #fff, #FFF5FA) !important;
                }
                .hide-mobile { display: flex !important; }
                .show-mobile { display: none !important; }
                @media (max-width: 768px) {
                    .hide-mobile { display: none !important; }
                    .show-mobile { display: flex !important; }
                }
                .gp-search-input:focus {
                    border-color: #FC2779 !important;
                    box-shadow: 0 0 0 3px rgba(252,39,121,0.1) !important;
                    background: white !important;
                }
                .full-nav::-webkit-scrollbar { display: none; }
                .gp-action-btn {
                    transition: color 0.2s, background 0.2s, border-color 0.2s;
                }
                .gp-action-btn:hover {
                    color: #FC2779 !important;
                    background: #FFF5FA !important;
                    border-color: #FC2779 !important;
                }
            `}</style>

            {/* Marquee announcement bar */}
            <div style={{
                background: 'linear-gradient(90deg, #B5006B 0%, #FC2779 50%, #FF4D6D 100%)',
                overflow: 'hidden', height: 36,
                display: 'flex', alignItems: 'center', position: 'relative',
            }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #B5006B, transparent)', zIndex: 2, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #FF4D6D, transparent)', zIndex: 2, pointerEvents: 'none' }} />
                <div className="gp-marquee-track">
                    {marqueeItems.map((text, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center',
                            color: 'white', fontSize: 12, fontWeight: 600,
                            letterSpacing: '.04em', whiteSpace: 'nowrap', padding: '0 24px',
                        }}>
                            {text}
                            <span style={{ marginLeft: 24, color: 'rgba(255,255,255,.35)', fontSize: 12 }}>✦</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Main header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 1000,
                background: 'rgba(255,255,255,.98)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid #F0E0EA',
                boxShadow: scrolled ? '0 4px 28px rgba(252,39,121,0.10)' : '0 1px 0 #F0E0EA',
                transition: 'box-shadow 0.3s',
            }}>
                {/* Top row */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, height: 64,
                    paddingLeft: 'clamp(16px, 4vw, 48px)',
                    paddingRight: 'clamp(16px, 4vw, 48px)',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: '#FC2779', letterSpacing: '-0.01em', lineHeight: 1 }}>
                            GLOW<span style={{ fontStyle: 'italic', color: '#B5006B' }}>PICK</span>
                        </span>
                    </Link>

                    {/* Search */}
                    <form onSubmit={searchHandler} className="hide-mobile" style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#FC2779', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text" placeholder="Search products, brands..."
                            value={keyword} onChange={e => setKeyword(e.target.value)}
                            className="gp-search-input"
                            style={{
                                width: '100%', height: 42,
                                border: '2px solid #F0E0EA', borderRadius: 99,
                                padding: '0 16px 0 46px',
                                fontFamily: 'var(--font-body)', fontSize: 12,
                                color: '#2D2D2D', background: '#FFF5FA', outline: 'none',
                                transition: 'all 0.2s',
                            }}
                        />
                    </form>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>

                        {/* AI Skin Match */}
                        <Link to="/recommend" className="hide-mobile" style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #B5006B, #FC2779)',
                            color: 'white', borderRadius: 99, padding: '9px 18px',
                            fontSize: 11, fontWeight: 700,
                            textDecoration: 'none', whiteSpace: 'nowrap',
                            boxShadow: '0 4px 18px rgba(252,39,121,0.32)', transition: 'all .2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(252,39,121,0.42)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(252,39,121,0.32)'; }}
                        >✨ AI Skin Match</Link>

                        {/* User */}
                        <div style={{ position: 'relative' }}>
                            {userInfo ? (
                                <>
                                    <button onClick={() => setUserMenuOpen(v => !v)} style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '6px 10px', borderRadius: 99,
                                        color: '#2D2D2D', fontSize: 11, fontWeight: 600,
                                        transition: 'background .2s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#FFF5FA'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <span style={{
                                            width: 34, height: 34, borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #FFF0F7, #FFE4F0)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 800, color: '#FC2779',
                                            border: '2px solid #FC2779', flexShrink: 0,
                                        }}>
                                            {userInfo.name?.[0]?.toUpperCase()}
                                        </span>
                                        <span className="hide-mobile" style={{ fontSize: 11 }}>
                                            {userInfo.name?.split(' ')[0]}
                                        </span>
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3.5l3 3 3-3"/></svg>
                                    </button>

                                    {userMenuOpen && (
                                        <div style={{
                                            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                            background: 'white', borderRadius: 16, padding: '8px',
                                            minWidth: 190,
                                            boxShadow: '0 12px 40px rgba(252,39,121,0.12)',
                                            border: '1.5px solid #F0E0EA', zIndex: 999,
                                        }}>
                                            <Link to="/cart" style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '10px 14px', fontSize: 12, color: '#2D2D2D',
                                                textDecoration: 'none', borderRadius: 10,
                                                fontWeight: 600, transition: 'background .15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#FFF5FA'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                                My Cart
                                                {cartCount > 0 && (
                                                    <span style={{ marginLeft: 'auto', background: '#FC2779', color: 'white', fontSize: 12, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount > 9 ? '9+' : cartCount}</span>
                                                )}
                                            </Link>
                                            <hr style={{ border: 'none', borderTop: '1px solid #F0E0EA', margin: '6px 8px' }} />
                                            <button onClick={logoutHandler} style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                width: '100%', textAlign: 'left',
                                                padding: '10px 14px', fontSize: 12, color: '#E53E3E',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                borderRadius: 10, fontWeight: 600,
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button onClick={openLogin} className="gp-action-btn" style={{
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    background: 'none', border: '2px solid #F0E0EA',
                                    borderRadius: 99, padding: '8px 16px',
                                    fontSize: 11, fontWeight: 600, color: '#2D2D2D',
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                                    <span className="hide-mobile">Login</span>
                                </button>
                            )}
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="gp-action-btn" style={{
                            position: 'relative', display: 'flex', alignItems: 'center',
                            gap: 6, textDecoration: 'none', color: '#2D2D2D',
                            padding: '8px 12px', borderRadius: 99,
                            fontSize: 12, fontWeight: 600,
                            whiteSpace: 'nowrap', border: '2px solid transparent',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                            <span className="hide-mobile">Cart</span>
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: 2, right: 2,
                                    background: 'linear-gradient(135deg, #FC2779, #B5006B)',
                                    color: 'white', fontSize: 12, fontWeight: 800,
                                    minWidth: 18, height: 18, borderRadius: 99,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid white', lineHeight: 1,
                                }}>{cartCount > 9 ? '9+' : cartCount}</span>
                            )}
                        </Link>

                        {/* Hamburger */}
                        <button onClick={() => setMobileOpen(v => !v)} className="show-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#2D2D2D', borderRadius: 10, transition: 'background .2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FFF5FA'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            {mobileOpen
                                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                            }
                        </button>
                    </div>
                </div>

                {/* Category Navbar */}
                <nav className="full-nav" style={{
                    borderTop: '1px solid #F5E8F0', background: 'white',
                    display: 'flex', width: '100%',
                    overflowX: 'auto', scrollbarWidth: 'none',
                }}>
                    {NAV_LINKS.map(link => {
                        const active = isLinkActive(link);
                        return (
                            <Link key={link.to} to={link.to} className="gp-nav-link" style={{
                                flex: 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '13px 12px', fontSize: 12,
                                textDecoration: 'none', whiteSpace: 'nowrap',
                                ...(active ? activeStyle : inactiveStyle),
                            }}>{link.label}</Link>
                        );
                    })}
                    <Link to="/recommend" className="gp-nav-link" style={{
                        flex: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 5, padding: '13px 12px',
                        fontSize: 12, fontWeight: 700,
                        color: '#FC2779', textDecoration: 'none', whiteSpace: 'nowrap',
                        borderBottom: location.pathname === '/recommend' ? '3px solid #FC2779' : '3px solid transparent',
                        background: location.pathname === '/recommend' ? 'linear-gradient(to bottom, #fff, #FFF5FA)' : 'transparent',
                        transition: 'all .18s',
                    }}>✨ AI Skin Analysis</Link>
                </nav>

                {/* Mobile dropdown */}
                {mobileOpen && (
                    <div style={{ borderTop: '1px solid #F0E0EA', background: 'white', padding: '14px 18px 20px', boxShadow: '0 8px 24px rgba(252,39,121,0.08)' }}>
                        <form onSubmit={searchHandler} style={{ marginBottom: 12, position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#FC2779', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                            <input type="text" placeholder="Search products..."
                                value={keyword} onChange={e => setKeyword(e.target.value)}
                                style={{ width: '100%', height: 44, boxSizing: 'border-box', border: '2px solid #F0E0EA', borderRadius: 99, padding: '0 16px 0 44px', fontSize: 12, fontFamily: 'var(--font-body)', outline: 'none', background: '#FFF5FA' }}
                            />
                        </form>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {NAV_LINKS.map(link => {
                                const active = isLinkActive(link);
                                return (
                                    <Link key={link.to} to={link.to} style={{ padding: '11px 14px', fontSize: 12, fontWeight: active ? 700 : 500, color: active ? '#FC2779' : '#2D2D2D', borderRadius: 10, textDecoration: 'none', background: active ? '#FFF5FA' : 'transparent', transition: 'background .15s' }}>
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <Link to="/recommend" style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: '#FC2779', borderRadius: 10, textDecoration: 'none', background: '#FFF5FA' }}>✨ AI Skin Analysis</Link>
                            {!userInfo && (
                                <button onClick={() => { setMobileOpen(false); openLogin(); }} style={{ padding: '11px 14px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'white', borderRadius: 10, marginTop: 8, background: 'linear-gradient(135deg, #B5006B, #FC2779)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(252,39,121,0.3)' }}>
                                    Sign in / Create account
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}

