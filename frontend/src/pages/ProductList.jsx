import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaFilter, FaTimes, FaChevronDown, FaSearch } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { products as localProducts } from '../assets/productData';
import { useGlobalContext } from '../context/Context';
import { toast } from 'react-toastify';

const ProductList = () => {
    const [products, setProducts]               = useState(localProducts);
    const [priceRange, setPriceRange]           = useState(5000);
    const [selectedBrands, setSelectedBrands]   = useState([]);
    const [sortBy, setSortBy]                   = useState('popularity');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const { state, dispatch } = useGlobalContext();
    const { cartItems } = state;
    const { search } = useLocation();
    const params        = new URLSearchParams(search);
    const categoryQuery = params.get('category');
    const searchQuery   = params.get('search');

    useEffect(() => {
        setSelectedBrands([]);
        setPriceRange(5000);
        setSortBy('popularity');
        setShowMobileFilters(false);
    }, [categoryQuery, searchQuery]);

    useEffect(() => {
        (async () => {
            try {
                const ctrl = new AbortController();
                setTimeout(() => ctrl.abort(), 4000);
                const { data } = await axios.get('http://127.0.0.1:5000/api/products', { signal: ctrl.signal });
                if (data?.length && data.every(p => p.image)) setProducts(data);
            } catch {}
        })();
    }, []);

    /* ── Cart helpers ── */
    const getCartItem = (id) => cartItems.find(i => i._id === id);
    const addToCart   = (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty: 1 } });
        toast.success(`${product.name.slice(0, 28)}… added! 🛍️`);
    };
    const updateQty   = (product, qty) => {
        if (qty < 1) { dispatch({ type: 'REMOVE_FROM_CART', payload: product._id }); return; }
        dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty } });
    };

    /* ── Filter / sort logic ── */
    const brands = [...new Set(products
        .filter(p => !categoryQuery || p.category?.toLowerCase() === categoryQuery.toLowerCase())
        .map(p => p.brand)
    )].filter(Boolean).sort();

    const filtered = products.filter(p => {
        const price = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
        if (categoryQuery && p.category?.toLowerCase() !== categoryQuery.toLowerCase()) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!p.name?.toLowerCase().includes(q) && !p.brand?.toLowerCase().includes(q) && !p.category?.toLowerCase().includes(q)) return false;
        }
        if (price > priceRange) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        const pa = a.discountPrice && a.discountPrice < a.price ? a.discountPrice : a.price;
        const pb = b.discountPrice && b.discountPrice < b.price ? b.discountPrice : b.price;
        if (sortBy === 'priceLow')  return pa - pb;
        if (sortBy === 'priceHigh') return pb - pa;
        if (sortBy === 'rating')    return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest')    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return (b.numReviews || 0) - (a.numReviews || 0);
    });

    const activeFilterCount = selectedBrands.length + (priceRange < 5000 ? 1 : 0);
    const clearFilters = () => { setSelectedBrands([]); setPriceRange(5000); setSortBy('popularity'); };

    /* ── Filter panel ── */
    const FilterPanel = () => (
        <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid #F0E0EA', padding: '28px 24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FaFilter size={17} style={{ color: '#FC2779' }} />
                    <span style={{ fontWeight: 900, fontSize: 22, color: '#1C1C1E', letterSpacing: '-.01em' }}>Filters</span>
                    {activeFilterCount > 0 && (
                        <span style={{ background: '#FC2779', color: 'white', fontSize: 14, fontWeight: 800, padding: '3px 11px', borderRadius: 99 }}>
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FC2779', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <FaTimes size={13} /> Clear
                    </button>
                )}
            </div>

            {/* Category tag */}
            {categoryQuery && (
                <div style={{ marginBottom: 28 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Category</p>
                    <span style={{ background: '#FFF0F7', color: '#FC2779', fontSize: 17, fontWeight: 700, padding: '8px 18px', borderRadius: 99, border: '1px solid #FCCDE3', display: 'inline-block' }}>
                        {categoryQuery}
                    </span>
                </div>
            )}

            {/* Price Range */}
            <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Price Range</p>
                <input type="range" min="0" max="5000" step="50" value={priceRange}
                    onChange={e => setPriceRange(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#FC2779', cursor: 'pointer', height: 5 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, marginTop: 10, color: '#6B7280' }}>
                    <span>₹0</span>
                    <span style={{ color: '#FC2779' }}>₹{priceRange.toLocaleString()}</span>
                </div>
            </div>

            {/* Brands */}
            <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Brands</p>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {brands.map(brand => (
                        <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, cursor: 'pointer' }}>
                            <input type="checkbox" checked={selectedBrands.includes(brand)}
                                onChange={() => setSelectedBrands(prev =>
                                    prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                                )}
                                style={{ accentColor: '#FC2779', width: 20, height: 20, cursor: 'pointer' }} />
                            <span style={{ fontSize: 17, color: '#374151', fontWeight: 500 }}>{brand}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    const pageTitle = searchQuery ? `Results for "${searchQuery}"` : categoryQuery || 'All Products';
    const fallback  = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400';

    return (
        <div style={{ display: 'flex', gap: 32, paddingTop: 32, paddingBottom: 64, alignItems: 'flex-start' }}>

            {/* ── Sidebar — wider ── */}
            <div className="sidebar-desktop" style={{ width: 290, flexShrink: 0 }}>
                <div style={{ position: 'sticky', top: 108 }}>
                    <FilterPanel />
                </div>
            </div>

            <style>{`
                .sidebar-desktop { display: none; }
                @media(min-width: 768px) { .sidebar-desktop { display: block !important; } }
                .mobile-filter-btn { display: flex; }
                @media(min-width: 768px) { .mobile-filter-btn { display: none !important; } }
            `}</style>

            {/* ── Main ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

                {/* Topbar */}
                <div style={{
                    background: 'white', borderRadius: 18, border: '1.5px solid #F0E0EA',
                    padding: '22px 28px', marginBottom: 28,
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'space-between', alignItems: 'center', gap: 14,
                }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1C1C1E', marginBottom: 5, letterSpacing: '-.01em' }}>
                            {pageTitle}
                        </h1>
                        <p style={{ fontSize: 17, color: '#9CA3AF', fontWeight: 500 }}>
                            {sorted.length} product{sorted.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        {/* Mobile filter btn */}
                        <button onClick={() => setShowMobileFilters(v => !v)}
                            className="mobile-filter-btn"
                            style={{
                                alignItems: 'center', gap: 8, padding: '12px 20px',
                                border: '1.5px solid #F0E0EA', borderRadius: 12,
                                fontSize: 17, fontWeight: 700, color: '#374151',
                                background: showMobileFilters ? '#FFF0F7' : 'white', cursor: 'pointer',
                            }}>
                            <FaFilter size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                        </button>

                        {/* Sort dropdown */}
                        <div style={{ position: 'relative' }}>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                                style={{
                                    appearance: 'none', background: '#FAFAFA',
                                    border: '1.5px solid #F0E0EA', borderRadius: 12,
                                    paddingLeft: 18, paddingRight: 42, paddingTop: 12, paddingBottom: 12,
                                    fontSize: 17, fontWeight: 600, color: '#374151',
                                    cursor: 'pointer', outline: 'none',
                                }}>
                                <option value="popularity">Most Popular</option>
                                <option value="priceLow">Price: Low → High</option>
                                <option value="priceHigh">Price: High → Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="newest">Newest First</option>
                            </select>
                            <FaChevronDown size={13} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                    </div>
                </div>

                {/* Mobile filter panel */}
                {showMobileFilters && <div style={{ marginBottom: 24 }}><FilterPanel /></div>}

                {/* Empty state */}
                {sorted.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: 20, border: '2px dashed #F0E0EA', padding: '80px 24px', textAlign: 'center' }}>
                        <FaSearch size={48} style={{ color: '#E5E7EB', margin: '0 auto 20px' }} />
                        <h3 style={{ fontWeight: 800, color: '#9CA3AF', marginBottom: 12, fontSize: 26 }}>No products found</h3>
                        <p style={{ color: '#9CA3AF', fontSize: 18, marginBottom: 32 }}>Try adjusting your filters or search term.</p>
                        <button onClick={clearFilters} style={{ background: '#FC2779', color: 'white', border: 'none', borderRadius: 99, padding: '15px 36px', fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    /* ── Product Grid — 3-4 per row max, bigger cards ── */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: 24,
                    }}>
                        {sorted.map(product => {
                            const display  = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
                            const pct      = product.discountPrice && product.discountPrice < product.price
                                ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
                            const cartItem = getCartItem(product._id);

                            return (
                                <div key={product._id} style={{
                                    background: 'white', borderRadius: 20,
                                    border: '1.5px solid #F0E0EA',
                                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                    transition: 'box-shadow .25s, transform .25s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 36px rgba(252,39,121,.18)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    {/* Image */}
                                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: '#FFF5FA' }}>
                                            <img
                                                src={product.image || fallback}
                                                alt={product.name}
                                                onError={e => { e.target.onerror = null; e.target.src = fallback; }}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
                                                onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                                                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                            />
                                            {pct > 0 && (
                                                <span style={{
                                                    position: 'absolute', top: 12, left: 12,
                                                    background: '#FC2779', color: 'white',
                                                    fontSize: 14, fontWeight: 900, padding: '5px 13px', borderRadius: 99,
                                                    boxShadow: '0 2px 8px rgba(252,39,121,.4)',
                                                }}>
                                                    {pct}% OFF
                                                </span>
                                            )}
                                            {product.rating >= 4.7 && (
                                                <span style={{
                                                    position: 'absolute', top: 12, right: 12,
                                                    background: 'rgba(255,255,255,.95)', color: '#1C1C1E',
                                                    fontSize: 13, fontWeight: 800, padding: '5px 11px', borderRadius: 9,
                                                }}>
                                                    ⭐ {product.rating}
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Body */}
                                    <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Brand */}
                                        <p style={{ fontSize: 15, fontWeight: 800, color: '#FC2779', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 6 }}>
                                            {product.brand}
                                        </p>

                                        {/* Name */}
                                        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                            <p style={{
                                                fontSize: 19, fontWeight: 700, color: '#1C1C1E',
                                                lineHeight: 1.4, marginBottom: 10,
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            }}>
                                                {product.name}
                                            </p>
                                        </Link>

                                        {/* Rating */}
                                        {product.rating && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                                <span style={{
                                                    background: '#F0FDF4', color: '#15803D',
                                                    fontSize: 16, fontWeight: 800, padding: '4px 10px',
                                                    borderRadius: 8, display: 'flex', alignItems: 'center', gap: 5,
                                                }}>
                                                    {product.rating} <FaStar size={11} />
                                                </span>
                                                {product.numReviews && (
                                                    <span style={{ fontSize: 15, color: '#9CA3AF' }}>({product.numReviews.toLocaleString()})</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Price */}
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16, marginTop: 'auto' }}>
                                            <span style={{ fontSize: 26, fontWeight: 900, color: '#1C1C1E' }}>₹{display.toLocaleString('en-IN')}</span>
                                            {pct > 0 && (
                                                <span style={{ fontSize: 17, color: '#B0B0B0', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
                                            )}
                                        </div>

                                        {/* ADD TO CART / QTY STEPPER */}
                                        {!cartItem ? (
                                            <button
                                                onClick={() => addToCart(product)}
                                                style={{
                                                    width: '100%', height: 56,
                                                    border: '2px solid #FC2779',
                                                    borderRadius: 14, background: 'white',
                                                    color: '#FC2779', fontSize: 18, fontWeight: 800,
                                                    cursor: 'pointer', transition: 'all .2s', letterSpacing: '.04em',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#FC2779'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#FC2779'; }}
                                            >
                                                ADD TO CART
                                            </button>
                                        ) : (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                background: '#FC2779', borderRadius: 14, overflow: 'hidden', height: 56,
                                            }}>
                                                <button
                                                    onClick={() => updateQty(product, cartItem.qty - 1)}
                                                    style={{
                                                        width: 56, height: 56, border: 'none',
                                                        background: 'rgba(0,0,0,.15)',
                                                        color: 'white', fontSize: 26, fontWeight: 700,
                                                        cursor: 'pointer', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        transition: 'background .15s', flexShrink: 0,
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,.28)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,.15)'}
                                                >−</button>

                                                <span style={{
                                                    flex: 1, textAlign: 'center',
                                                    color: 'white', fontSize: 20, fontWeight: 900,
                                                    userSelect: 'none',
                                                }}>
                                                    {cartItem.qty}
                                                </span>

                                                <button
                                                    onClick={() => updateQty(product, cartItem.qty + 1)}
                                                    style={{
                                                        width: 56, height: 56, border: 'none',
                                                        background: 'rgba(0,0,0,.15)',
                                                        color: 'white', fontSize: 26, fontWeight: 700,
                                                        cursor: 'pointer', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        transition: 'background .15s', flexShrink: 0,
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,.28)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,.15)'}
                                                >+</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;