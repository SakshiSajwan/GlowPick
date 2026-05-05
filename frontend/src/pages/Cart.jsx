import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';

const Cart = () => {
    const navigate = useNavigate();
    const { state, dispatch, openLogin } = useGlobalContext();
    const { cartItems, userInfo } = state;

    const getEffectivePrice = (item) =>
        item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price
            ? item.discountPrice : item.price;

    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });

    const updateQty = (item, qty) => {
        if (qty < 1 || (item.countInStock && qty > item.countInStock)) return;
        dispatch({ type: 'ADD_TO_CART', payload: { ...item, qty } });
    };

    const totalQty      = cartItems.reduce((a, i) => a + i.qty, 0);
    const totalMRP      = cartItems.reduce((a, i) => a + i.qty * i.price, 0);
    const totalPrice    = cartItems.reduce((a, i) => a + i.qty * getEffectivePrice(i), 0);
    const totalDiscount = totalMRP - totalPrice;
    const shipping      = totalPrice >= 299 ? 0 : 49;
    const finalTotal    = totalPrice + shipping;

    const PAD = 'clamp(16px,5vw,60px)';

    /* Empty state */
    if (cartItems.length === 0) return (
        <div style={{ padding: `60px ${PAD}`, textAlign: 'center', background: '#FFFBF8', minHeight: '60vh' }}>
            <div style={{ fontSize: 86, marginBottom: 20 }}>🛍️</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1C1C1E', marginBottom: 10 }}>Your bag is empty</h2>
            <p style={{ fontSize: 22, color: '#6E6E73', marginBottom: 36 }}>Looks like you haven't added anything yet.</p>
            <Link to="/products" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #B5006B, #FC2779)',
                color: '#fff', fontWeight: 800, fontSize: 18,
                padding: '14px 36px', borderRadius: 99,
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(252,39,121,.35)',
            }}>
                Start Shopping
            </Link>
        </div>
    );

    return (
        <div style={{ background: '#FFFBF8', minHeight: '80vh', padding: `36px ${PAD} 80px` }}>

            {/* Page title */}
            <h1 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: '#1C1C1E', marginBottom: 32, letterSpacing: '-.02em' }}>
                My Cart
                <span style={{ fontSize: 18, fontWeight: 600, color: '#9CA3AF', marginLeft: 12 }}>
                    ({totalQty} {totalQty === 1 ? 'item' : 'items'})
                </span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>

                {/* LEFT — Cart items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {cartItems.map(item => {
                        const ep         = getEffectivePrice(item);
                        const hasDisc    = item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price;
                        const discPct    = hasDisc ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;

                        return (
                            <div key={item._id} style={{
                                background: '#fff',
                                borderRadius: 20,
                                border: '1.5px solid #F0E0EA',
                                padding: '20px 24px',
                                display: 'flex',
                                gap: 20,
                                alignItems: 'flex-start',
                                boxShadow: '0 2px 12px rgba(0,0,0,.04)',
                            }}>
                                {/* Product image */}
                                <Link to={`/product/${item._id}`} style={{ flexShrink: 0 }}>
                                    <div style={{
                                        width: 110, height: 110,
                                        borderRadius: 14,
                                        background: '#FFF5FA',
                                        border: '1px solid #F0E0EA',
                                        overflow: 'hidden',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                                            onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80'; }}
                                        />
                                    </div>
                                </Link>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
                                        {item.brand}
                                    </div>
                                    <Link to={`/product/${item._id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1C1E', lineHeight: 1.4, marginBottom: 10 }}>
                                            {item.name}
                                        </div>
                                    </Link>

                                    {/* Price row */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
                                        <span style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E' }}>₹{ep.toLocaleString('en-IN')}</span>
                                        {hasDisc && (
                                            <>
                                                <span style={{ fontSize: 16, color: '#B0B0B0', textDecoration: 'line-through' }}>₹{item.price.toLocaleString('en-IN')}</span>
                                                <span style={{ fontSize: 14, fontWeight: 800, color: '#16A34A' }}>{discPct}% off</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Qty stepper */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center',
                                            border: '1.5px solid #F0E0EA', borderRadius: 12, overflow: 'hidden',
                                        }}>
                                            <button
                                                onClick={() => updateQty(item, item.qty - 1)}
                                                disabled={item.qty <= 1}
                                                style={{
                                                    width: 40, height: 40,
                                                    border: 'none', background: item.qty <= 1 ? '#fafafa' : '#fff',
                                                    color: item.qty <= 1 ? '#D1D5DB' : '#FC2779',
                                                    fontSize: 18, fontWeight: 700,
                                                    cursor: item.qty <= 1 ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'background .15s',
                                                }}
                                                onMouseEnter={e => { if (item.qty > 1) e.currentTarget.style.background = '#FFF0F7'; }}
                                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                            >−</button>

                                            <span style={{ padding: '0 18px', fontSize: 14, fontWeight: 800, color: '#1C1C1E', userSelect: 'none', minWidth: 20, textAlign: 'center' }}>
                                                {item.qty}
                                            </span>

                                            <button
                                                onClick={() => updateQty(item, item.qty + 1)}
                                                disabled={item.qty >= (item.countInStock || 10)}
                                                style={{
                                                    width: 40, height: 40,
                                                    border: 'none', background: '#fff',
                                                    color: item.qty >= (item.countInStock || 10) ? '#D1D5DB' : '#FC2779',
                                                    fontSize: 20, fontWeight: 700,
                                                    cursor: item.qty >= (item.countInStock || 10) ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'background .15s',
                                                }}
                                                onMouseEnter={e => { if (item.qty < (item.countInStock || 10)) e.currentTarget.style.background = '#FFF0F7'; }}
                                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                            >+</button>
                                        </div>

                                        <span style={{ fontSize: 18, fontWeight: 700, color: '#6E6E73' }}>
                                            Subtotal: <span style={{ color: '#1C1C1E' }}>₹{(ep * item.qty).toLocaleString('en-IN')}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    title="Remove item"
                                    style={{
                                        flexShrink: 0, background: '#FFF5FA',
                                        border: '1.5px solid #F0E0EA', borderRadius: 10,
                                        width: 38, height: 38,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#FC2779', fontSize: 20,
                                        transition: 'all .2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#FC2779'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#FFF5FA'; e.currentTarget.style.color = '#FC2779'; }}
                                >
                                    🗑
                                </button>
                            </div>
                        );
                    })}

                    {/* Continue shopping */}
                    <Link to="/products" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontSize: 20, fontWeight: 700, color: '#FC2779',
                        textDecoration: 'none', marginTop: 4,
                        transition: 'opacity .2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        ← Continue Shopping
                    </Link>
                </div>

                {/* RIGHT — Order summary */}
                <div style={{ position: 'sticky', top: 100 }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        border: '1.5px solid #F0E0EA',
                        padding: '28px 28px 32px',
                        boxShadow: '0 4px 24px rgba(252,39,121,.07)',
                    }}>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 24, paddingBottom: 16, borderBottom: '1.5px solid #F0E0EA', letterSpacing: '-.01em' }}>
                            Price Details
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                            {[
                                { label: `MRP (${totalQty} ${totalQty === 1 ? 'item' : 'items'})`, value: `₹${totalMRP.toLocaleString('en-IN')}`, color: '#444' },
                                ...(totalDiscount > 0 ? [{ label: 'Discount', value: `−₹${totalDiscount.toLocaleString('en-IN')}`, color: '#16A34A' }] : []),
                                { label: 'Delivery', value: shipping === 0 ? 'FREE' : `₹${shipping}`, color: '#16A34A' },
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 18, color: '#555', fontWeight: 500 }}>{row.label}</span>
                                    <span style={{ fontSize: 18, fontWeight: 700, color: row.color }}>{row.value}</span>
                                </div>
                            ))}

                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderTop: '1.5px solid #F0E0EA', paddingTop: 16, marginTop: 4,
                            }}>
                                <span style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E' }}>Total Amount</span>
                                <span style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {totalDiscount > 0 && (
                            <div style={{
                                background: '#F0FDF4', color: '#16A34A',
                                fontSize: 16, fontWeight: 700,
                                textAlign: 'center', padding: '12px',
                                borderRadius: 12, marginBottom: 20,
                                border: '1px solid #BBF7D0',
                            }}>
                                🎉 You're saving ₹{totalDiscount.toLocaleString('en-IN')} on this order!
                            </div>
                        )}

                        {shipping === 0 && (
                            <div style={{
                                background: '#FFF0F7', color: '#FC2779',
                                fontSize: 16, fontWeight: 600,
                                textAlign: 'center', padding: '10px',
                                borderRadius: 12, marginBottom: 20,
                                border: '1px solid #FCCDE3',
                            }}>
                                ✅ Free delivery applied on this order
                            </div>
                        )}

                        {/* Checkout button */}
                        <button
                            onClick={() => {
                                if (!userInfo) {
                                    openLogin();
                                } else {
                                    navigate('/checkout');
                                }
                            }}
                            style={{
                                width: '100%', height: 54,
                                background: 'linear-gradient(135deg, #B5006B, #FC2779)',
                                color: '#fff', border: 'none', borderRadius: 14,
                                fontSize: 16, fontWeight: 800, cursor: 'pointer',
                                letterSpacing: '.04em',
                                boxShadow: '0 6px 24px rgba(252,39,121,.35)',
                                transition: 'all .2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(252,39,121,.45)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(252,39,121,.35)'; }}
                        >
                            {userInfo ? 'Proceed to Checkout →' : 'Login to Checkout →'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, color: '#9CA3AF', fontSize: 14, fontWeight: 500 }}>
                            🔒 Safe & Secure Payments
                        </div>

                        {/* Payment icons */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                            {['UPI', 'Cards', 'Wallets', 'COD'].map(m => (
                                <span key={m} style={{
                                    fontSize: 14, fontWeight: 700, color: '#6E6E73',
                                    background: '#F9F9F9', border: '1px solid #EBEBEB',
                                    padding: '4px 10px', borderRadius: 6,
                                }}>
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Offers card */}
                    <div style={{
                        background: '#fff', borderRadius: 20,
                        border: '1.5px solid #F0E0EA',
                        padding: '20px 24px', marginTop: 16,
                        boxShadow: '0 2px 12px rgba(0,0,0,.04)',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1C1C1E', marginBottom: 14 }}>Available Offers</h3>
                        {[
                            { icon: '🎁', text: 'Use code GLOW10 for extra 10% off' },
                            { icon: '🚚', text: 'Free delivery on orders above ₹299' },
                            { icon: '💳', text: '5% cashback on Razorpay payments' },
                        ].map((offer, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 2 ? 12 : 0 }}>
                                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{offer.icon}</span>
                                <span style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>{offer.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;