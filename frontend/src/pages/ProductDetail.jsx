import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaHeart, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { useGlobalContext } from '../context/Context';
import { toast } from 'react-toastify';
import { products as localProducts } from '../assets/productData';

const fallbackImage = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop';

const styles = {
    page: {
        background: '#fff',
        padding: '24px',
        borderRadius: 12,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    },
    loadingWrap: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 256,
    },
    spinner: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '2px solid #FCE7F3',
        borderTopColor: '#FC2779',
        animation: 'spin 0.8s linear infinite',
    },
    errorBox: {
        background: '#FEF2F2',
        color: '#991B1B',
        padding: 16,
        borderRadius: 10,
        border: '1px solid #FECACA',
        textAlign: 'center',
        margin: '40px 0',
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 8,
    },
    backLink: {
        marginTop: 16,
        display: 'inline-block',
        background: '#FC2779',
        color: '#fff',
        padding: '8px 24px',
        borderRadius: 8,
        textDecoration: 'none',
        fontWeight: 700,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 40,
    },
    gallery: {
        display: 'flex',
        gap: 16,
    },
    thumbnails: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: 384,
        overflowY: 'auto',
        flexShrink: 0,
    },
    thumb: {
        width: 64,
        height: 64,
        objectFit: 'contain',
        border: '1px solid #E5E7EB',
        borderRadius: 6,
        cursor: 'pointer',
        padding: 4,
        background: '#fff',
    },
    mainImageWrap: {
        flex: 1,
        minHeight: 360,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #F3F4F6',
        borderRadius: 10,
        padding: 16,
        position: 'relative',
        background: '#fff',
    },
    mainImage: {
        maxHeight: 384,
        maxWidth: '100%',
        objectFit: 'contain',
    },
    heartBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        color: '#9CA3AF',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    breadcrumb: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 16,
    },
    breadcrumbLink: {
        color: '#6B7280',
        textDecoration: 'none',
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: '#1F2937',
        marginBottom: 8,
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    ratingBadge: {
        display: 'flex',
        alignItems: 'center',
        background: '#16A34A',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 700,
        gap: 4,
    },
    reviewCount: {
        color: '#6B7280',
        fontSize: 12,
    },
    priceBox: {
        borderTop: '1px solid #F3F4F6',
        borderBottom: '1px solid #F3F4F6',
        padding: '16px 0',
        marginBottom: 16,
    },
    priceRow: {
        display: 'flex',
        alignItems: 'flex-end',
        marginBottom: 8,
        flexWrap: 'wrap',
        gap: 12,
    },
    currentPrice: {
        fontSize: 20,
        fontWeight: 700,
        color: '#111827',
    },
    oldPrice: {
        color: '#9CA3AF',
        textDecoration: 'line-through',
        fontSize: 13,
    },
    discount: {
        color: '#DB2777',
        fontWeight: 700,
    },
    taxText: {
        fontSize: 12,
        color: '#16A34A',
        fontWeight: 500,
    },
    actionRow: {
        display: 'flex',
        gap: 16,
        marginBottom: 24,
    },
    qtyBox: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #D1D5DB',
        borderRadius: 6,
        overflow: 'hidden',
    },
    qtyBtn: {
        padding: '4px 12px',
        background: '#F3F4F6',
        border: 'none',
        cursor: 'pointer',
        fontSize: 13,
    },
    qtyText: {
        padding: '4px 16px',
        fontWeight: 500,
    },
    cartBtn: {
        flex: 1,
        background: '#FC2779',
        color: '#fff',
        fontWeight: 700,
        padding: '12px 16px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },
    serviceList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontSize: 12,
        color: '#4B5563',
    },
    serviceItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    serviceIcon: {
        color: '#FC2779',
        flexShrink: 0,
    },
    descriptionWrap: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 8,
    },
    description: {
        color: '#374151',
        lineHeight: 1.65,
        maxHeight: 192,
        overflowY: 'auto',
    },
    reviewsWrap: {
        marginTop: 48,
        background: '#F9FAFB',
        padding: 24,
        borderRadius: 10,
    },
    reviewCard: {
        background: '#fff',
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },
    reviewHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    reviewer: {
        fontWeight: 700,
    },
    smallRating: {
        background: '#16A34A',
        color: '#fff',
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
    },
    reviewComment: {
        color: '#4B5563',
    },
    noReviews: {
        color: '#6B7280',
        fontStyle: 'italic',
    },
};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);
    const [mainImage, setMainImage] = useState('');

    const { dispatch } = useGlobalContext();

    useEffect(() => {
        const fetchProduct = async () => {
            const localProduct = localProducts.find(p => p._id === id);
            if (localProduct) {
                setProduct(localProduct);
                setMainImage(localProduct.image);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
                const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
                    signal: controller.signal
                });
                clearTimeout(timeout);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
                setMainImage(data.image);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Product not found or backend unavailable.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty } });
        toast.success(`${product.name} added to cart!`);
    };

    if (loading) {
        return (
            <div style={styles.loadingWrap}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={styles.spinner}></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={styles.errorBox}>
                <h3 style={styles.errorTitle}>Oops! Product not found</h3>
                <p>{error || 'The product you are looking for does not exist.'}</p>
                <Link to="/products" style={styles.backLink}>
                    Back to Products
                </Link>
            </div>
        );
    }

    const allImages = product.images && product.images.length > 0
        ? product.images.map(img => img.url)
        : [product.image];

    return (
        <div style={styles.page}>
            <div style={styles.grid}>
                {/* Image Gallery */}
                <div style={styles.gallery}>
                    <div style={styles.thumbnails}>
                        {allImages.map((img, index) => (
                            <img
                                key={index}
                                src={img || fallbackImage}
                                alt={`View ${index}`}
                                style={{
                                    ...styles.thumb,
                                    borderColor: mainImage === img ? '#FC2779' : '#E5E7EB',
                                }}
                                onMouseEnter={() => setMainImage(img)}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallbackImage;
                                }}
                            />
                        ))}
                    </div>
                    <div style={styles.mainImageWrap}>
                        <img
                            src={mainImage || fallbackImage}
                            alt={product.name}
                            style={styles.mainImage}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackImage;
                            }}
                        />
                        <button style={styles.heartBtn}>
                            <FaHeart size={20} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <nav style={styles.breadcrumb}>
                        <Link to="/" style={styles.breadcrumbLink}>Home</Link> / <Link to="/products" style={styles.breadcrumbLink}>{product.category}</Link> / <span style={{ color: '#111827' }}>{product.name}</span>
                    </nav>

                    <h1 style={styles.title}>{product.name}</h1>
                    <div style={styles.ratingRow}>
                        <div style={styles.ratingBadge}>
                            {product.rating} <FaStar size={10} />
                        </div>
                        <span style={styles.reviewCount}>{product.numReviews || 0} Ratings &amp; Reviews</span>
                    </div>

                    <div style={styles.priceBox}>
                        <div style={styles.priceRow}>
                            <span style={styles.currentPrice}>&#8377;{product.discountPrice || product.price}</span>
                            {product.price > product.discountPrice && product.discountPrice > 0 && (
                                <>
                                    <span style={styles.oldPrice}>&#8377;{product.price}</span>
                                    <span style={styles.discount}>{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF</span>
                                </>
                            )}
                        </div>
                        <p style={styles.taxText}>Inclusive of all taxes</p>
                    </div>

                    <div style={styles.actionRow}>
                        <div style={styles.qtyBox}>
                            <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                            <span style={styles.qtyText}>{qty}</span>
                            <button style={styles.qtyBtn} onClick={() => setQty(Math.min(product.countInStock || 10, qty + 1))}>+</button>
                        </div>
                        <button
                            onClick={addToCartHandler}
                            style={styles.cartBtn}
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div style={styles.serviceList}>
                        <div style={styles.serviceItem}><FaTruck style={styles.serviceIcon} /> Free delivery for Members</div>
                        <div style={styles.serviceItem}><FaShieldAlt style={styles.serviceIcon} /> 100% Genuine Product</div>
                    </div>

                    <div style={styles.descriptionWrap}>
                        <h3 style={styles.sectionTitle}>Description</h3>
                        <p style={styles.description}>{product.description}</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div style={styles.reviewsWrap}>
                <h3 style={{ ...styles.sectionTitle, fontSize: 16, marginBottom: 16 }}>Ratings &amp; Reviews</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                            <div key={review._id} style={styles.reviewCard}>
                                <div style={styles.reviewHeader}>
                                    <span style={styles.reviewer}>{review.name}</span>
                                    <span style={styles.smallRating}>{review.rating} <FaStar size={8} /></span>
                                </div>
                                <p style={styles.reviewComment}>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p style={styles.noReviews}>No reviews yet for this product.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
