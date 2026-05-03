import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaHeart, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { useGlobalContext } from '../context/Context';
import { toast } from 'react-toastify';
import { products as localProducts } from '../assets/productData';

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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 text-center my-10">
                <h3 className="text-xl font-bold mb-2">Oops! Product not found</h3>
                <p>{error || 'The product you are looking for does not exist.'}</p>
                <Link to="/products" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition-colors">
                    Back to Products
                </Link>
            </div>
        );
    }

    const allImages = product.images && product.images.length > 0
        ? product.images.map(img => img.url)
        : [product.image];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Image Gallery */}
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:h-96 no-scrollbar">
                        {allImages.map((img, index) => (
                            <img
                                key={index}
                                src={img || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop'}
                                alt={`View ${index}`}
                                className={`w-16 h-16 object-contain border rounded cursor-pointer hover:border-primary ${mainImage === img ? 'border-primary' : 'border-gray-200'}`}
                                onMouseEnter={() => setMainImage(img)}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop';
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex-1 flex justify-center items-center border border-gray-100 rounded-lg p-4 relative">
                        <img
                            src={mainImage || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop'}
                            alt={product.name}
                            className="max-h-96 object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop';
                            }}
                        />
                        <button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow hover:text-red-500 text-gray-400">
                            <FaHeart size={20} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <nav className="text-sm text-gray-500 mb-4">
                        <Link to="/">Home</Link> / <Link to="/products">{product.category}</Link> / <span className="text-gray-900">{product.name}</span>
                    </nav>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                            {product.rating} <FaStar className="ml-1" size={10} />
                        </div>
                        <span className="text-gray-500 text-sm">{product.numReviews || 0} Ratings &amp; Reviews</span>
                    </div>

                    <div className="border-t border-b border-gray-100 py-4 mb-4">
                        <div className="flex items-end mb-2">
                            <span className="text-3xl font-bold text-gray-900">₹{product.discountPrice || product.price}</span>
                            {product.price > product.discountPrice && product.discountPrice > 0 && (
                                <>
                                    <span className="ml-3 text-gray-400 line-through text-lg">₹{product.price}</span>
                                    <span className="ml-3 text-pink-600 font-bold">{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF</span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-green-600 font-medium">Inclusive of all taxes</p>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <div className="flex items-center border border-gray-300 rounded">
                            <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                            <span className="px-4 py-1 font-medium">{qty}</span>
                            <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200" onClick={() => setQty(Math.min(product.countInStock || 10, qty + 1))}>+</button>
                        </div>
                        <button
                            onClick={addToCartHandler}
                            className="flex-1 bg-primary text-white font-bold py-3 rounded hover:bg-secondary transition-colors uppercase tracking-wider"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center"><FaTruck className="mr-2 text-primary" /> Free delivery for Members</div>
                        <div className="flex items-center"><FaShieldAlt className="mr-2 text-primary" /> 100% Genuine Product</div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed max-h-48 overflow-y-auto no-scrollbar">{product.description}</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Ratings &amp; Reviews</h3>
                <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                            <div key={review._id} className="bg-white p-4 rounded shadow-sm">
                                <div className="flex items-center mb-2">
                                    <span className="font-bold mr-2">{review.name}</span>
                                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center">{review.rating} <FaStar size={8} className="ml-0.5" /></span>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No reviews yet for this product.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
