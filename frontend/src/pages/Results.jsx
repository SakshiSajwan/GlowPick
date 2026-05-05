import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useGlobalContext } from "../context/Context";
import { toast } from "react-toastify";

/* Step Badge */
function StepBadge({ number, label, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 800, flexShrink: 0,
        background: active ? "linear-gradient(135deg,#FC2779,#F43F5E)" : "#fff",
        color: active ? "#fff" : "#9CA3AF",
        border: active ? "none" : "2px solid #E5E7EB",
        boxShadow: active ? "0 4px 14px rgba(252,39,121,.35)" : "none",
        transition: "all .3s",
      }}>{number}</div>
      <span style={{ fontSize: 14, fontWeight: 700, color: active ? "#FC2779" : "#9CA3AF" }}>
        {label}
      </span>
    </div>
  );
}
function StepLine({ active }) {
  return (
    <div style={{
      width: 80, height: 3, borderRadius: 99,
      background: active ? "linear-gradient(to right,#FC2779,#F9A8D4)" : "#E5E7EB",
      transition: "background .3s",
    }} />
  );
}

/* Routine Step Row */
function RoutineStep({ number, label, name, sub, color = "#FC2779" }) {
  return (
    <div style={{ display: "flex", gap: 18, padding: "18px 0", borderBottom: "1px solid #F9FAFB" }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color === "#7C3AED" ? "#EDE9FE" : "#FEE2E2",
        color: color, fontSize: 14, fontWeight: 900,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{number}</div>
      <div>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#374151" }}>
          <span style={{ color: "#9CA3AF", fontWeight: 500 }}>{label}: </span>{name}
        </p>
        {sub && <p style={{ margin: "5px 0 0", fontSize: 13, color: "#9CA3AF" }}>{sub}</p>}
      </div>
    </div>
  );
}

/* Product Card */
function ProductCard({ product, onAddToCart, added }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1.5px solid #F0E0EA",
      padding: "20px 18px",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      width: 240,
      transition: "transform .22s, box-shadow .22s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 36px rgba(252,39,121,.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Image */}
      <div style={{
        height: 180, borderRadius: 14, overflow: "hidden",
        background: "#FFF5FA", marginBottom: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }}
            onError={e => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div style={{
          display: product.image ? "none" : "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 36, width: "100%", height: "100%",
        }}>✨</div>
      </div>

      {/* Info */}
      <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: "#1F2937", lineHeight: 1.35 }}>
        {product.name}
      </p>
      {product.brand && (
        <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#FC2779", textTransform: "uppercase", letterSpacing: ".06em" }}>
          {product.brand}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: "auto" }}>
        <span style={{ fontWeight: 900, fontSize: 16, color: "#1C1C1E" }}>₹{product.price}</span>
        {product.rating && (
          <span style={{
            fontSize: 12, color: "#15803D", fontWeight: 800,
            background: "#F0FDF4", padding: "4px 10px", borderRadius: 8,
          }}>⭐ {product.rating}</span>
        )}
      </div>

      {/* Reasons */}
      {product.reasons && product.reasons.length > 0 && (
        <div style={{
          background: "#FFF0F7", borderRadius: 12,
          padding: "10px 14px", marginBottom: 14,
          fontSize: 12, color: "#6B7280", lineHeight: 1.6,
        }}>
          {product.reasons.slice(0, 2).map((r, i) => r.trim() && (
            <p key={i} style={{ margin: 0 }}>• {r.trim()}</p>
          ))}
        </div>
      )}

      <button
        onClick={() => onAddToCart(product)}
        style={{
          width: "100%", height: 46, borderRadius: 12, border: "none",
          background: added ? "linear-gradient(135deg,#10B981,#059669)" : "#FC2779",
          color: "#fff", fontSize: 13, fontWeight: 800,
          cursor: "pointer", transition: "all .3s",
          boxShadow: added ? "0 4px 14px rgba(16,185,129,.3)" : "0 4px 14px rgba(252,39,121,.25)",
        }}
      >
        {added ? "✓ Added!" : "🛒 Add to Cart"}
      </button>
    </div>
  );
}

/* MAIN */
export default function Results() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { dispatch } = useGlobalContext();
  const data = location.state || {};

  const [addedMap,  setAddedMap]  = useState({});
  const [showAll,   setShowAll]   = useState(false);

  const skinType = data.skinType || "Combination";
  const concerns = Array.isArray(data.concerns) ? data.concerns : ["Dryness", "Fine Lines"];

  const allProducts = data.products && data.products.length > 0
    ? data.products
    : [
        { _id: "r1", name: "Hydrating Essence Toner",  price: "899",  rating: "4.6", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", brand: "Minimalist", reasons: ["Balances skin pH", "Boosts absorption"] },
        { _id: "r2", name: "SPF 50 Protective Face Milk", price: "750", rating: "4.8", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80", brand: "Lakme", reasons: ["Broad spectrum UVA/UVB", "Lightweight formula"] },
        { _id: "r3", name: "Niacinamide 10% Serum",    price: "590",  rating: "4.7", image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=400&q=80", brand: "The Ordinary", reasons: ["Reduces pore size", "Evens skin tone"] },
        { _id: "r4", name: "Ceramide Night Cream",     price: "1450", rating: "4.9", image: "https://images.unsplash.com/photo-1556228578-dd6d6c7e0d63?w=400&q=80", brand: "CeraVe", reasons: ["Repairs skin barrier", "Deep overnight hydration"] },
        { _id: "r5", name: "Gentle Foam Cleanser",     price: "449",  rating: "4.5", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80", brand: "Cetaphil", reasons: ["Removes impurities gently", "pH balanced"] },
        { _id: "r6", name: "Vitamin C Brightening Serum", price: "1299", rating: "4.8", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", brand: "Minimalist", reasons: ["Fades dark spots", "Antioxidant protection"] },
      ];

  const visibleProducts = showAll ? allProducts : allProducts;

  const handleAddToCart = (product) => {
    const id = product._id || `rec-${product.name}`;
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        _id:          id,
        name:         product.name,
        brand:        product.brand || "",
        price:        parseFloat(String(product.price).replace(/[^\d.]/g, "")) || 0,
        discountPrice: parseFloat(String(product.price).replace(/[^\d.]/g, "")) || 0,
        image:        product.image || "",
        qty:          1,
      },
    });
    setAddedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [id]: false })), 2200);
    toast.success(`${product.name.slice(0, 28)}… added to bag! 🛍️`);
  };

  const whyPoints = [
    `Your <strong>${skinType}</strong> skin needs a balanced approach — lightweight, non-comedogenic formulas that hydrate without clogging pores.`,
    concerns.some(c => ["acne", "dark spots", "pigmentation"].includes(c.toLowerCase()))
      ? "Niacinamide and salicylic acid in the selected products actively reduce acne, minimise pores, and even out skin tone over time."
      : "Gentle fragrance-free actives were chosen to strengthen your skin barrier without triggering sensitivity.",
    "The morning routine focuses on protection — cleansing + antioxidants + SPF to guard against UV and pollution throughout the day.",
    "Your night routine targets repair — ceramide cream rebuilds your skin barrier while you sleep.",
    "All products are dermatologist-tested and suitable for Indian climate — fast-absorbing, non-greasy formulas.",
  ];

  const cardStyle = {
    background: "#fff", borderRadius: 22,
    border: "1.5px solid #F0E0EA", padding: 32,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FDFCFD", paddingBottom: 80, fontFamily: "inherit" }}>

      {/* HEADER */}
      <div style={{
        textAlign: "center", padding: "30px 24px 22px",
        background: "rgba(255,255,255,.97)",
        backdropFilter: "blur(14px)",
        borderBottom: "1.5px solid #FCE7F3",
      }}>
        <div style={{
          display: "inline-block", marginBottom: 12,
          padding: "6px 22px", borderRadius: 99,
          background: "#FFF0F7", border: "1.5px solid #FCE7F3",
          boxShadow: "0 2px 12px rgba(252,39,121,.08)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#FC2779", letterSpacing: ".06em" }}>
            ✨ AI-Powered Skincare
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, marginBottom: 6,
          background: "linear-gradient(135deg,#FC2779,#F43F5E,#A855F7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-.03em", lineHeight: 1.1,
        }}>GlowBot</h1>

        <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 22 }}>
          Your personalised skincare recommendation system
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <StepBadge number="1" label="Skin Profile" active />
          <StepLine active />
          <StepBadge number="2" label="Selfie" active />
          <StepLine active />
          <StepBadge number="3" label="Results" active />
        </div>

        <div style={{ maxWidth: 380, margin: "0 auto" }}>
          <div style={{ height: 7, background: "#FCE7F3", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: "100%",
              background: "linear-gradient(to right,#FC2779,#F43F5E)",
              borderRadius: 99,
            }} />
          </div>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>Step 3 of 3</p>
        </div>
      </div>

      {/* PAGE BODY */}
      <div style={{ maxWidth: "96%", margin: "0 auto", paddingTop: 36 }}>

        {/* SKIN ANALYSIS BANNER */}
        <div style={{ ...cardStyle, display: "flex", gap: 40, alignItems: "center", marginBottom: 30, overflow: "hidden" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 22, color: "#111827", letterSpacing: "-.02em" }}>
              Your Skin Analysis
            </h2>
            <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
              <span style={{
                background: "linear-gradient(135deg,#FEE2E2,#FFF0F7)",
                color: "#FC2779", padding: "10px 24px",
                borderRadius: 99, fontSize: 16, fontWeight: 800,
                border: "1.5px solid #FCE7F3",
                boxShadow: "0 2px 12px rgba(252,39,121,.12)",
              }}>
                🧠 Skin Type: {skinType}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Detected Concerns:</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {concerns.map(c => (
                  <span key={c} style={{
                    color: "#fff", fontWeight: 700, fontSize: 13,
                    background: "linear-gradient(135deg,#FC2779,#F43F5E)",
                    padding: "5px 16px", borderRadius: 99,
                    boxShadow: "0 2px 8px rgba(252,39,121,.22)",
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Better banner image */}
          <div style={{ width: "36%", height: 200, borderRadius: 20, overflow: "hidden", flexShrink: 0, position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=85&fit=crop"
              alt="Skincare"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(252,39,121,.12),rgba(168,85,247,.08))" }} />
            <div style={{
              position: "absolute", bottom: 16, left: 16,
              background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)",
              borderRadius: 12, padding: "8px 16px",
            }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#FC2779" }}>✦ AI Analysis Complete</p>
              <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{allProducts.length} products matched</p>
            </div>
          </div>
        </div>

        {/* 2-COLUMN: ROUTINES + WHY/PRODUCTS */}
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 2fr", gap: 28 }}>

          {/* LEFT: Routines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: "#374151", margin: 0 }}>Your Routine</h3>

            <div style={cardStyle}>
              <h4 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 900, color: "#FC2779" }}>
                Morning Routine ☀️
              </h4>
              <RoutineStep number="1" label="Cleanser"    name="Gentle Foam Cleanser"       sub="Removes impurities without dryness" />
              <RoutineStep number="2" label="Toner"       name="Hydrating Essence Toner"    sub="Preps skin for better absorption"  />
              <RoutineStep number="3" label="Moisturizer" name="SPF 50 Protective Face Milk" sub="All-day hydration + sun protection" />
            </div>

            <div style={cardStyle}>
              <h4 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 900, color: "#7C3AED" }}>
                Night Routine 🌙
              </h4>
              <RoutineStep number="1" label="Double Cleanse" name="Cleansing Oil + Gentle Foam"  sub="Deeply cleanses pores"                color="#7C3AED" />
              <RoutineStep number="2" label="Treatment"      name="Advanced Recovery Spot Gel"    sub="Targets active concerns overnight"   color="#7C3AED" />
              <RoutineStep number="3" label="Moisturizer"    name="Ceramide Deep Night Cream"     sub="Repairs skin barrier while you sleep" color="#7C3AED" />
            </div>
          </div>

          {/* RIGHT: Why + Products */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* WHY card */}
            <div style={{ ...cardStyle, border: "2px solid #FCE7F3", background: "#FFFBFD" }}>
              <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
                <span style={{ fontSize: 36, flexShrink: 0 }}>🤖</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 18px", fontSize: 18, fontWeight: 900, color: "#111827" }}>
                    Why we recommended this routine for you
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                    {whyPoints.map((point, i) => (
                      <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <span style={{
                          width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                          background: "linear-gradient(135deg,#FC2779,#F43F5E)",
                          color: "#fff", fontSize: 12, fontWeight: 900,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>{i + 1}</span>
                        <p style={{ margin: 0, fontSize: 15, color: "#4B5563", lineHeight: 1.75 }}
                          dangerouslySetInnerHTML={{ __html: point }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Products heading + count */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#374151", margin: 0 }}>
                Recommended Products
                <span style={{
                  marginLeft: 12, fontSize: 13, fontWeight: 700,
                  color: "#FC2779", background: "#FFF0F7",
                  padding: "4px 14px", borderRadius: 99,
                  border: "1.5px solid #FCE7F3",
                }}>
                  {allProducts.length} matched
                </span>
              </h3>
              <Link to="/cart" style={{
                fontSize: 13, fontWeight: 800, color: "#FC2779",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
                background: "#FFF0F7", padding: "9px 20px", borderRadius: 99,
                border: "1.5px solid #FCE7F3",
                transition: "all .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FC2779"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FFF0F7"; e.currentTarget.style.color = "#FC2779"; }}
              >
                🛒 View Cart
              </Link>
            </div>

            {/* HORIZONTAL SCROLLING PRODUCT ROW */}
            <div style={{ position: "relative" }}>
              <div style={{
                display: "flex",
                gap: 18,
                overflowX: "auto",
                paddingBottom: 12,
                paddingRight: 8,
                scrollbarWidth: "thin",
                scrollbarColor: "#FC2779 #FFF0F7",
              }}>
                {visibleProducts.map((p, i) => {
                  const id = p._id || `rec-${p.name}`;
                  return (
                    <ProductCard
                      key={id || i}
                      product={p}
                      onAddToCart={handleAddToCart}
                      added={!!addedMap[id]}
                    />
                  );
                })}
              </div>
              {/* Fade edge hint */}
              <div style={{
                position: "absolute", right: 0, top: 0, bottom: 12,
                width: 50,
                background: "linear-gradient(to right, transparent, #FDFCFD)",
                pointerEvents: "none",
              }} />
            </div>

            <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
              ← Scroll to see all {allProducts.length} recommended products →
            </p>
          </div>
        </div>

        {/* CTA ROW */}
        <div style={{
          display: "flex", gap: 16, justifyContent: "center",
          marginTop: 40, flexWrap: "wrap",
        }}>
          <Link to="/cart" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg,#FC2779,#F43F5E)",
            color: "#fff", fontWeight: 900, fontSize: 15,
            padding: "16px 40px", borderRadius: 99,
            textDecoration: "none",
            boxShadow: "0 8px 28px rgba(252,39,121,.35)",
            transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(252,39,121,.48)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(252,39,121,.35)"; }}
          >
            🛒 Go to Cart & Checkout
          </Link>

          <button
            onClick={() => { localStorage.removeItem("skinProfile"); navigate("/recommend"); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#fff", color: "#6B7280", fontWeight: 700, fontSize: 14,
              padding: "16px 36px", borderRadius: 99,
              border: "1.5px solid #E5E7EB", cursor: "pointer",
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FC2779"; e.currentTarget.style.color = "#FC2779"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}
          >
            ↩ Redo Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
