import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGlobalContext } from '../context/Context';

const OrderSuccessModal = ({ isOpen, onClose, orderId }) => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalContext();
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cartItems');
  };
  const [visible, setVisible]           = useState(false);
  const [shopHover, setShopHover]       = useState(false);
  const [cancelHover, setCancelHover]   = useState(false);

  const [cancelStage, setCancelStage]   = useState('idle');

  useEffect(() => {
    if (isOpen) {
      setCancelStage('idle');
      setTimeout(() => setVisible(true), 10);

      const duration   = 3000;
      const animEnd    = Date.now() + duration;
      const defaults   = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
      const rand       = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const left = animEnd - Date.now();
        if (left <= 0) return clearInterval(interval);
        const count = 50 * (left / duration);
        confetti({ ...defaults, particleCount: count, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount: count, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleCancelClick = () => {
    if (cancelStage === 'idle') {
      setCancelStage('confirm');
    } else if (cancelStage === 'confirm') {
      setCancelStage('cancelling');
      // Simulate cancellation delay
      setTimeout(() => setCancelStage('cancelled'), 3000);
    }
  };

  if (!isOpen) return null;

  // Cancelled screen
  if (cancelStage === 'cancelled') {
    return (
      <div style={overlay}>
        <div style={{ ...card, transform: visible ? 'scale(1)' : 'scale(0.85)', opacity: visible ? 1 : 0 }}>
          <div style={{ ...iconCircle, backgroundColor: '#fee2e2' }}>❌</div>
          <h2 style={heading}>Order Cancelled</h2>
          <p style={subtext}>
            Your order <span style={pink}>#{orderId}</span> has been cancelled.
            Refund (if any) will be processed within 5–7 business days.
          </p>
          <button
            onClick={() => { clearCart(); onClose(); navigate('/'); }}
            style={{ ...btnPrimary, background: '#111827' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}
          >
            🏠 Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Cancelling (loading) screen
  if (cancelStage === 'cancelling') {
    return (
      <div style={overlay}>
        <div style={{ ...card, transform: 'scale(1)', opacity: 1 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⏳</div>
          <h2 style={heading}>Cancelling Your Order...</h2>
          <p style={subtext}>
            Please wait while we process your cancellation request for order <span style={pink}>#{orderId}</span>.
            This will only take a moment.
          </p>
          <div style={{
            width: '100%', height: '6px', backgroundColor: '#f3f4f6',
            borderRadius: '99px', overflow: 'hidden', marginTop: '1rem',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(to right, #ec4899, #e11d48)',
              borderRadius: '99px',
              animation: 'progress 3s linear forwards',
              width: '0%',
            }} />
          </div>
          <style>{`
            @keyframes progress { from { width: 0% } to { width: 100% } }
            @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
          `}</style>
        </div>
      </div>
    );
  }

  // Confirm cancel screen
  if (cancelStage === 'confirm') {
    return (
      <div style={overlay}>
        <div style={{ ...card, transform: 'scale(1)', opacity: 1 }}>
          <div style={{ ...iconCircle, backgroundColor: '#fef9c3' }}>⚠️</div>
          <h2 style={heading}>Cancel this order?</h2>
          <p style={subtext}>
            Are you sure you want to cancel order <span style={pink}>#{orderId}</span>?
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleCancelClick}
              style={{ ...btnPrimary, background: 'linear-gradient(to right, #ef4444, #dc2626)' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Yes, Cancel Order
            </button>
            <button
              onClick={() => setCancelStage('idle')}
              style={btnOutline}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fdf2f8'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              No, Keep My Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Success screen
  return (
    <div style={overlay}>
      <div style={{ ...card, transform: visible ? 'scale(1)' : 'scale(0.85)', opacity: visible ? 1 : 0, transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease' }}>
        <div style={{ ...iconCircle, backgroundColor: '#dcfce7' }}>🎉</div>
        <h2 style={heading}>Yay! Order Confirmed!</h2>
        <p style={subtext}>
          Your order <span style={pink}>#{orderId || 'GP7892'}</span> is on its way to making you glow ✨
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Continue Shopping */}
          <button
            onClick={() => { onClose(); navigate('/'); }}
            onMouseEnter={() => setShopHover(true)}
            onMouseLeave={() => setShopHover(false)}
            style={{
              ...btnPrimary,
              background: 'linear-gradient(to right, #ec4899, #e11d48)',
              transform: shopHover ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            🛍️ Continue Shopping
          </button>

          {/* Cancel Order */}
          <button
            onClick={handleCancelClick}
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            style={{
              ...btnOutline,
              color: '#ef4444',
              border: '2px solid #fca5a5',
              backgroundColor: cancelHover ? '#fef2f2' : 'transparent',
              transform: cancelHover ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            ✕ Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

// Shared styles
const overlay = {
  position: 'fixed', inset: 0, zIndex: 10000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(4px)',
  padding: '1rem',
  fontFamily: "'Segoe UI', sans-serif",
};
const card = {
  backgroundColor: '#ffffff', borderRadius: '1.5rem',
  padding: '2.5rem 2rem', maxWidth: '400px', width: '100%',
  textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
};
const iconCircle = {
  width: '5rem', height: '5rem', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  margin: '0 auto 1.5rem', fontSize: '3rem',
};
const heading = { fontSize: '2rem', fontWeight: '900', color: '#111827', margin: '0 0 0.5rem' };
const subtext  = { color: '#6b7280', fontSize: '1.25rem', marginBottom: '1.5rem', lineHeight: '1.6' };
const pink     = { fontWeight: '700', color: '#db2777' };
const btnPrimary = {
  width: '100%', padding: '0.9rem',
  color: '#ffffff', fontWeight: '700', fontSize: '1.25rem',
  borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
  transition: 'all 0.2s',
};
const btnOutline = {
  width: '100%', padding: '0.9rem',
  color: '#db2777', fontWeight: '700', fontSize: '1.25rem',
  borderRadius: '0.75rem', border: '2px solid #f9a8d4',
  backgroundColor: 'transparent', cursor: 'pointer',
  transition: 'all 0.2s',
};

export default OrderSuccessModal;