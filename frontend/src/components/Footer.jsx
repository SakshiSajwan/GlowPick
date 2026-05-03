import React, { useState } from 'react'; // Added useState
import { Link } from 'react-router-dom';

const Footer = () => {
    const transition = 'all 0.2s ease-in-out';

    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleJoin = () => {
        if (email.includes('@')) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        } else {
            alert("Please enter a valid email address!");
        }
    };

    const socialLinks = [
        { icon: '📸', url: 'https://instagram.com/glowpick', label: 'Instagram' },
        { icon: '🐦', url: 'https://twitter.com/glowpick', label: 'Twitter' },
        { icon: '📘', url: 'https://facebook.com/glowpick', label: 'Facebook' },
        { icon: '▶️', url: 'https://youtube.com/glowpick', label: 'YouTube' }
    ];

    return (
        <footer style={{ 
            background: '#0F172A', 
            color: '#F8FAFC', 
            marginTop: 'auto',
            borderTop: '1px solid #1E293B'
        }}>

            {/* Main grid */}
            <div style={{
                width: '100%',
                padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px)', 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '48px',
                boxSizing: 'border-box',
            }}>

                {/* Brand col */}
                <div style={{ gridColumn: 'span 1' }}>
                    <div style={{ marginBottom: 24 }}>
                        <span style={{ fontSize: 40, fontWeight: 900, color: '#F472B6', letterSpacing: '-0.02em' }}>GLOW</span>
                        <span style={{ fontSize: 40, fontWeight: 900, color: '#FDA4AF', letterSpacing: '-0.02em' }}>PICK</span>
                    </div>
                    <p style={{ 
                        fontSize: 20, 
                        color: '#94A3B8', 
                        lineHeight: 1.8, 
                        marginBottom: 30, 
                        maxWidth: 300 
                    }}>
                        India's smartest beauty shopping experience powered by AI skin analysis.
                    </p>
                    
                    {/* SOCIAL LINKS (Functional anchors) */}
                    <div style={{ display: 'flex', gap: 14 }}>
                        {socialLinks.map((item, i) => (
                            <a 
                                key={i} 
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={item.label}
                                style={{
                                    width: 44, height: 44,
                                    background: '#1E293B',
                                    border: '1px solid #334155',
                                    borderRadius: 12,
                                    fontSize: 18,
                                    textDecoration: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#F472B6';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = '#1E293B';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Shop col */}
                <div>
                    <h4 style={{ color: '#F472B6', fontWeight: 800, fontSize: 26, marginBottom: 28, textTransform: 'uppercase' }}>Shop</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: 'Makeup',       path: '/products?category=Makeup' },
                            { label: 'Skincare',     path: '/products?category=Skincare' },
                            { label: 'Haircare',     path: '/products?category=Haircare' },
                            { label: 'Fragrance',    path: '/products?category=Fragrance' },
                            { label: 'All Products', path: '/products' },
                        ].map(item => (
                            <li key={item.label}>
                                <Link to={item.path} style={{
                                    color: '#E2E8F0', 
                                    textDecoration: 'none',
                                    fontSize: 20, 
                                    fontWeight: 500,
                                    transition,
                                }}
                                    onMouseEnter={e => e.target.style.color = '#F472B6'}
                                    onMouseLeave={e => e.target.style.color = '#E2E8F0'}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Features col */}
                <div>
                    <h4 style={{ color: '#F472B6', fontWeight: 800, fontSize: 26, marginBottom: 28, textTransform: 'uppercase' }}>Features</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: '✨ AI Skin Analysis', path: '/recommend' },
                            { label: 'My Cart',             path: '/cart' },
                            { label: 'My Orders',           path: '/orders' },
                            { label: 'My Profile',          path: '/profile' },
                        ].map(item => (
                            <li key={item.label}>
                                <Link to={item.path} style={{
                                    color: '#E2E8F0',
                                    textDecoration: 'none',
                                    fontSize: 20,
                                    fontWeight: 500,
                                    transition,
                                }}
                                    onMouseEnter={e => e.target.style.color = '#F472B6'}
                                    onMouseLeave={e => e.target.style.color = '#E2E8F0'}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support col */}
                <div>
                    <h4 style={{ color: '#F472B6', fontWeight: 800, fontSize: 26, marginBottom: 28, textTransform: 'uppercase' }}>Support</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
                        <li style={{ fontSize: 20, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 20 }}>📧</span> hello@glowpick.in
                        </li>
                        <li style={{ fontSize: 20, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 20 }}>📞</span> 1800-XXX-XXXX
                        </li>
                    </ul>

                    {/* Newsletter */}
                    <div style={{ background: '#1E293B', borderRadius: 20, padding: 24, border: '1px solid #334155' }}>
                        <p style={{ fontSize: 18, color: 'white', fontWeight: 700, marginBottom: 16 }}>
                            {isSubscribed ? "🎉 You're on the list!" : "Get deals in your inbox"}
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                style={{
                                    flex: 1,
                                    fontSize: 16,
                                    background: '#0F172A',
                                    color: 'white',
                                    border: '1px solid #475569',
                                    borderRadius: 12,
                                    padding: '12px 16px',
                                    outline: 'none',
                                }}
                            />
                            <button 
                                onClick={handleJoin}
                                style={{
                                    background: '#F472B6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 12,
                                    padding: '0 20px',
                                    fontSize: 16,
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#DB2777'}
                                onMouseLeave={e => e.currentTarget.style.background = '#F472B6'}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid #1E293B', background: '#0B1120' }}>
                <div style={{
                    width: '100%',
                    padding: '30px clamp(24px, 6vw, 80px)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                }}>
                    <p style={{ fontSize: 18, color: '#94A3B8' }}>
                        © {new Date().getFullYear()}{' '}
                        <span style={{ color: '#F472B6', fontWeight: 700 }}>GlowPick</span>
                        . All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 32 }}>
                        {[
                            { label: 'Privacy Policy', to: '/privacy' },
                            { label: 'Terms of Use',   to: '/terms' },
                            { label: 'Refund Policy',  to: '/refund-policy' },
                        ].map(item => (
                            <Link key={item.label} to={item.to} style={{
                                fontSize: 18, color: '#94A3B8',
                                textDecoration: 'none',
                                transition, fontWeight: 500
                            }}
                                onMouseEnter={e => e.target.style.color = '#F472B6'}
                                onMouseLeave={e => e.target.style.color = '#94A3B8'}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;