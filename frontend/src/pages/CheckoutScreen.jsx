import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import OrderSuccessModal from '../components/OrderSuccessModal';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    paddingTop: '8rem',
    paddingBottom: '4rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: 'border-box',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    border: '1.5px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#fce7f3',
    color: '#db2777',
    width: '2.2rem',
    height: '2.2rem',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '700',
    flexShrink: 0,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  inputFull: {
    gridColumn: '1 / -1',
    padding: '1rem 1.25rem',
    borderRadius: '0.6rem',
    border: '1.5px solid #d1d5db',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#fafafa',
  },
  inputHalf: {
    padding: '1rem 1.25rem',
    borderRadius: '0.6rem',
    border: '1.5px solid #d1d5db',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#fafafa',
  },
  cartItem: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
    borderBottom: '1.5px solid #f0f0f0',
    paddingBottom: '1.25rem',
    marginBottom: '1rem',
  },
  itemImg: {
    width: '5rem',
    height: '5rem',
    objectFit: 'contain',
    backgroundColor: '#f9fafb',
    borderRadius: '0.6rem',
    flexShrink: 0,
    border: '1px solid #e5e7eb',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
  },
  itemQty: {
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  itemPrice: {
    fontWeight: '700',
    color: '#111827',
    fontSize: '0.9rem',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(236,72,153,0.15)',
    border: '1.5px solid #f9a8d4',
    position: 'sticky',
    top: '8rem',
  },
  summaryTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#1f2937',
    borderBottom: '2px solid #fce7f3',
    paddingBottom: '0.75rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  summaryRowGreen: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#16a34a',
    marginBottom: '1rem',
  },
  summaryRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    fontWeight: '900',
    color: '#111827',
    marginTop: '0.5rem',
  },
  divider: {
    border: 'none',
    borderTop: '2px solid #f3f4f6',
    margin: '1rem 0',
  },
  payBtn: {
    width: '100%',
    marginTop: '2rem',
    padding: '1.1rem',
    background: 'linear-gradient(to right, #ec4899, #e11d48)',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.9rem',
    letterSpacing: '0.06em',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(236,72,153,0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  disclaimer: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: '1rem',
    lineHeight: '1.5',
  },
};

const errStyle = {
  color: '#ef4444',
  fontSize: '0.8rem',
  marginTop: '0.35rem',
  marginLeft: '0.25rem',
  fontWeight: '500',
};

export default function CheckoutScreen() {
  const { state, dispatch } = useGlobalContext();
  const { cartItems } = state;
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    street: '',
    city: '',
    state: 'Delhi',
  });

  const [errors, setErrors] = useState({});
  const [btnHover, setBtnHover] = useState(false);
  const [codHover, setCodHover] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cod'
  const [loading, setLoading] = useState(false);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 299 ? 0 : 50;
  const discountAmount = Math.round(itemsPrice * 0.1);
  const totalPrice = itemsPrice - discountAmount + shippingPrice;
  const freeShipping = shippingPrice === 0;

  // Validation
  const validate = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(address.phone)) e.phone = 'Enter valid 10-digit mobile number';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state.trim()) e.state = 'State is required';
    if (!address.street.trim()) e.street = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Razorpay Payment
  const API = "https://glowpick-1a6y.onrender.com";

    const handleRazorpay = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
        // 🔥 Wake up Render backend (VERY IMPORTANT)
        await fetch(`${API}/`);

        const res = await fetch(`${API}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
        });

        const { order } = await res.json();

        const options = {
        key: 'rzp_test_SkbGx5tt5k6tpd',
        amount: order.amount,
        currency: 'INR',
        name: 'GlowPick',
        description: 'Skincare & Beauty Order',
        order_id: order.id,

        handler: async function (response) {
            const verifyRes = await fetch(`${API}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
            dispatch({ type: 'CLEAR_CART' });
            setPlacedOrderId(response.razorpay_order_id);
            setModalOpen(true);
            } else {
            alert('Payment verification failed.');
            }
        },

        prefill: {
            name: address.fullName,
            contact: address.phone,
        },

        theme: { color: '#ec4899' },

        modal: {
            ondismiss: () => setLoading(false),
        },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (err) {
        console.error(err);
        alert('Payment failed. Try again.');
    } finally {
        setLoading(false);
    }
    };

  // Cash on Delivery
  const handleCOD = () => {
        if (!validate()) return;
        const codOrderId = 'COD-' + Date.now().toString().slice(-6);
        dispatch({ type: 'CLEAR_CART' });
        setPlacedOrderId(codOrderId);
        setModalOpen(true);
    };

    const handlePlaceOrder = () => {
    if (paymentMethod === 'razorpay') handleRazorpay();
    else handleCOD();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* LEFT: Shipping + Review */}
        <div style={styles.leftCol}>

          {/* Shipping Address */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.badge}>1</span>
              Shipping Address
            </h2>
            <div style={styles.formGrid}>

              {/* Full Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={address.fullName}
                  style={{ ...styles.inputFull, borderColor: errors.fullName ? '#ef4444' : '#d1d5db' }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setAddress({ ...address, fullName: val });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  onFocus={(e) => (e.target.style.borderColor = errors.fullName ? '#ef4444' : '#ec4899')}
                  onBlur={(e) => (e.target.style.borderColor = errors.fullName ? '#ef4444' : '#d1d5db')}
                />
                {errors.fullName && <p style={errStyle}>{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  placeholder="Mobile Number (10 digits)"
                  value={address.phone}
                  maxLength={10}
                  style={{ ...styles.inputHalf, borderColor: errors.phone ? '#ef4444' : '#d1d5db' }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setAddress({ ...address, phone: val });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  onFocus={(e) => (e.target.style.borderColor = errors.phone ? '#ef4444' : '#ec4899')}
                  onBlur={(e) => (e.target.style.borderColor = errors.phone ? '#ef4444' : '#d1d5db')}
                />
                {errors.phone && <p style={errStyle}>{errors.phone}</p>}
              </div>

              {/* Pincode */}
              <div>
                <input
                  type="text"
                  placeholder="Pincode (6 digits)"
                  value={address.pincode}
                  maxLength={6}
                  style={{ ...styles.inputHalf, borderColor: errors.pincode ? '#ef4444' : '#d1d5db' }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setAddress({ ...address, pincode: val });
                    if (errors.pincode) setErrors({ ...errors, pincode: '' });
                  }}
                  onFocus={(e) => (e.target.style.borderColor = errors.pincode ? '#ef4444' : '#ec4899')}
                  onBlur={(e) => (e.target.style.borderColor = errors.pincode ? '#ef4444' : '#d1d5db')}
                />
                {errors.pincode && <p style={errStyle}>{errors.pincode}</p>}
              </div>

              {/* City */}
              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  style={{ ...styles.inputHalf, borderColor: errors.city ? '#ef4444' : '#d1d5db' }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setAddress({ ...address, city: val });
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                  onFocus={(e) => (e.target.style.borderColor = errors.city ? '#ef4444' : '#ec4899')}
                  onBlur={(e) => (e.target.style.borderColor = errors.city ? '#ef4444' : '#d1d5db')}
                />
                {errors.city && <p style={errStyle}>{errors.city}</p>}
              </div>

              {/* State */}
              <div>
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  style={{ ...styles.inputHalf, borderColor: errors.state ? '#ef4444' : '#d1d5db' }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setAddress({ ...address, state: val });
                    if (errors.state) setErrors({ ...errors, state: '' });
                  }}
                  onFocus={(e) => (e.target.style.borderColor = errors.state ? '#ef4444' : '#ec4899')}
                  onBlur={(e) => (e.target.style.borderColor = errors.state ? '#ef4444' : '#d1d5db')}
                />
                {errors.state && <p style={errStyle}>{errors.state}</p>}
              </div>

              {/* Street */}
              <div style={{ gridColumn: '1 / -1' }}>
                <input
                  type="text"
                  placeholder="Flat, House no., Building, Street"
                  value={address.street}
                  style={{ ...styles.inputFull, borderColor: errors.street ? '#ef4444' : '#d1d5db' }}
                  onChange={(e) => {
                    setAddress({ ...address, street: e.target.value });
                    if (errors.street) setErrors({ ...errors, street: '' });
                  }}
                  onFocus={(e) => (e.target.style.borderColor = errors.street ? '#ef4444' : '#ec4899')}
                  onBlur={(e) => (e.target.style.borderColor = errors.street ? '#ef4444' : '#d1d5db')}
                />
                {errors.street && <p style={errStyle}>{errors.street}</p>}
              </div>

            </div>
          </div>

          {/* Review Items */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.badge}>2</span>
              Review Items
            </h2>
            <div>
              {cartItems.map((item) => (
                <div key={item._id} style={styles.cartItem}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.itemImg}
                  />
                  <div style={styles.itemInfo}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemQty}>Qty: {item.qty}</p>
                  </div>
                  <p style={styles.itemPrice}>₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>

            <div style={styles.summaryRow}>
              <span>Total MRP</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div style={styles.summaryRowGreen}>
              <span>Bag Discount (10%)</span>
              <span>-₹{discountAmount}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping Fee</span>
              <span style={freeShipping ? { color: '#16a34a', fontWeight: '700' } : {}}>
                {freeShipping ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>

            <hr style={styles.divider} />

            <div style={styles.summaryRowTotal}>
              <span>Total Amount</span>
              <span>₹{totalPrice}</span>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                Choose Payment Method
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.6rem',
                    border: paymentMethod === 'razorpay' ? '2px solid #ec4899' : '2px solid #e5e7eb',
                    backgroundColor: paymentMethod === 'razorpay' ? '#fdf2f8' : '#fafafa',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '1.1rem' }}>💳</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: paymentMethod === 'razorpay' ? '#db2777' : '#6b7280', marginTop: '0.25rem' }}>
                    Razorpay
                  </div>
                </div>
                <div
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.6rem',
                    border: paymentMethod === 'cod' ? '2px solid #ec4899' : '2px solid #e5e7eb',
                    backgroundColor: paymentMethod === 'cod' ? '#fdf2f8' : '#fafafa',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '1.1rem' }}>💵</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: paymentMethod === 'cod' ? '#db2777' : '#6b7280', marginTop: '0.25rem' }}>
                    Cash on Delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{
                ...styles.payBtn,
                marginTop: '1.25rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                background: paymentMethod === 'cod'
                  ? 'linear-gradient(to right, #f59e0b, #d97706)'
                  : 'linear-gradient(to right, #ec4899, #e11d48)',
                boxShadow: paymentMethod === 'cod'
                  ? '0 4px 14px rgba(245,158,11,0.35)'
                  : btnHover ? '0 6px 20px rgba(236,72,153,0.45)' : '0 4px 14px rgba(236,72,153,0.35)',
                transform: btnHover && !loading ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'razorpay'
                ? '💳 PAY VIA RAZORPAY'
                : '💵 PLACE COD ORDER'}
            </button>

            <p style={styles.disclaimer}>
              By placing your order, you agree to GlowPick's privacy notice and
              conditions of use.
            </p>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        orderId={placedOrderId}
      />
    </div>
  );
}

