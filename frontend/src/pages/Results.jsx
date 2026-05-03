import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

/* ─── Step Badge ─── */
function StepBadge({ number, label, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 800, flexShrink: 0,
        background: active ? "linear-gradient(135deg,#FC2779,#F43F5E)" : "#fff",
        color: active ? "#fff" : "#9CA3AF",
        border: active ? "none" : "2px solid #E5E7EB",
        boxShadow: active ? "0 4px 14px rgba(252,39,121,.35)" : "none",
      }}>{number}</div>
      <span style={{ fontSize: 16, fontWeight: 700, color: active ? "#FC2779" : "#9CA3AF" }}>
        {label}
      </span>
    </div>
  );
}

function StepLine({ active }) {
  return (
    <div style={{
      width: 70, height: 3, borderRadius: 99,
      background: active ? "linear-gradient(to right,#FC2779,#E5E7EB)" : "#E5E7EB",
    }} />
  );
}

/* ─── Routine Step Row ─── */
function RoutineStep({ number, label, name, sub }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 18px", borderRadius: 14,
      background: "#FAFAFA", border: "1px solid #F0F0F0",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg,#FC2779,#F43F5E)",
        color: "#fff", fontSize: 14, fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{number}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</p>
        <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 800, color: "#1F2937" }}>{name}</p>
        {sub && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Product Card ─── */
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  return (
    <div style={{
      background: "#fff", borderRadius: 18,
      border: "1.5px solid #F0F0F0",
      boxShadow: "0 3px 14px rgba(0,0,0,.07)",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "transform .2s, box-shadow .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(252,39,121,.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 3px 14px rgba(0,0,0,.07)"; }}
    >
      <div style={{ height: 200, background: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <img src={product.image} alt={product.name}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          onError={e => { e.target.style.display = "none"; }} />
      </div>
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1F2937", lineHeight: 1.35 }}>{product.name}</p>
        {product.brand && <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>{product.brand}</p>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#1F2937" }}>₹{product.price}</span>
          <span style={{ fontSize: 13, color: "#F59E0B", fontWeight: 700 }}>{product.rating || "4.6"} ⭐</span>
        </div>
        <button
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
          style={{
            marginTop: 4, width: "100%", padding: "12px 0", borderRadius: 11, border: "none",
            background: added ? "linear-gradient(135deg,#10B981,#059669)" : "linear-gradient(135deg,#FC2779,#F43F5E)",
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            transition: "background .3s",
            boxShadow: added ? "0 4px 14px rgba(16,185,129,.3)" : "0 4px 16px rgba(252,39,121,.3)",
          }}
        >{added ? "✓ Added to Cart!" : "🛒 Add to Cart"}</button>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN ═══════════════════ */
export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF0F7" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, color: "#EC4899", fontWeight: 600, marginBottom: 16 }}>No results found 😢</p>
          <button onClick={() => navigate("/")} style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#FC2779,#F43F5E)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Go Back</button>
        </div>
      </div>
    );
  }

  const products   = data.products   || [];
  const concerns   = data.concerns   || [];

  const morningRoutine = data.morningRoutine || [
    { step: 1, label: "Cleanser",    name: "Gentle Foam Cleanser",                   sub: "Refreshes without stripping" },
    { step: 2, label: "Toner",       name: "Hydrating Essence" },
    { step: 3, label: "Moisturizer", name: "SPF 50 Face Milk" },
  ];
  const nightRoutine = data.nightRoutine || [
    { step: 1, label: "Double Cleanse", name: "Oil Cleanser followed by Gentle Cleanser" },
    { step: 2, label: "Treatment",      name: "Spot Treatment Gel",  sub: "Targeted acne care" },
    { step: 3, label: "Moisturizer",    name: "Ceramide Night Cream" },
  ];
  const whyText = data.whyText ||
    "We selected hydrating ingredients to target dryness and improve skin barrier. Niacinamide helps balance oil and reduce acne appearance.";

  const displayProducts = products.length ? products : [
    { name: "Hydrating Essence Toner",   price: 899, rating: "4.6", image: "", brand: "Skin1004" },
    { name: "SPF 50 Face Milk",          price: 899, rating: "4.6", image: "", brand: "Isntree" },
    { name: "Oil Cleanse Cleanser",      price: 899, rating: "4.6", image: "", brand: "Banila Co" },
    { name: "Spot Treatment Gel",        price: 799, rating: "4.6", image: "", brand: "Some By Mi" },
    { name: "Kakadu Plum Vitamin C",     price: 950, rating: "4.8", image: "", brand: "Juicy Chemistry" },
    { name: "Demelan Cream",             price: 495, rating: "4.6", image: "", brand: "Dermafit" },
  ];

  const card = { background: "#fff", borderRadius: 20, border: "1.5px solid #F0F0F0", boxShadow: "0 3px 18px rgba(0,0,0,.06)" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FFF0F7 0%,#FFFBF8 55%,#F5F0FF 100%)", fontFamily: "'Nunito','Segoe UI',sans-serif" }}>

      {/* ══ GLOWBOT STEPPER HEADER ══ */}
      <div style={{ textAlign: "center", padding: "28px 24px 18px", background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)", borderBottom: "1.5px solid #FCE7F3" }}>
        <div style={{ display: "inline-block", marginBottom: 10, padding: "5px 20px", borderRadius: 99, background: "#FFF0F7", border: "1.5px solid #FCE7F3" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#FC2779", letterSpacing: ".06em" }}>✨ AI-Powered Skincare</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px,5vw,50px)", fontWeight: 900, marginBottom: 4, background: "linear-gradient(135deg,#FC2779,#F43F5E,#A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-.03em", lineHeight: 1.1 }}>GlowBot</h1>
        <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 18 }}>Your personalised skincare recommendation system</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <StepBadge number="1" label="Skin Profile" active />
          <StepLine active />
          <StepBadge number="2" label="Selfie" active />
          <StepLine active />
          <StepBadge number="3" label="Results" active />
        </div>
        <div style={{ maxWidth: 340, margin: "0 auto" }}>
          <div style={{ height: 6, background: "#FCE7F3", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "100%", background: "linear-gradient(to right,#FC2779,#F43F5E)", borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Step 3 of 3</p>
        </div>
      </div>

      {/* ══ PAGE BODY — full width with comfortable padding ══ */}
      <div style={{ padding: "28px 40px 56px" }}>

        {/* ── SKIN ANALYSIS — full width ── */}
        <div style={{ ...card, padding: "30px 40px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 14 }}>Your Skin Analysis</h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F7", border: "1.5px solid #FCE7F3", padding: "7px 18px", borderRadius: 99, marginBottom: 14 }}>
              <span style={{ fontSize: 15 }}>🧠</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#FC2779" }}>Skin Type: <strong>{data.skinType || "Combination"}</strong></span>
            </div>
            <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 600, marginBottom: 10 }}>Detected Concerns:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {(concerns.length ? concerns : ["Dryness", "Acne", "Uneven Tone", "Sensitivity"]).map((c, i) => (
                <span key={i} style={{ padding: "6px 18px", borderRadius: 99, background: "#FFF0F7", border: "1.5px solid #FCE7F3", fontSize: 14, fontWeight: 700, color: "#FC2779" }}>{c}</span>
              ))}
            </div>
          </div>
          {/* Neural decoration */}
          <div style={{ width: 240, height: 155, borderRadius: 20, flexShrink: 0, background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(252,39,121,.65),rgba(168,85,247,.3),transparent 68%)", filter: "blur(14px)" }} />
            {[[-38,-22],[34,-32],[2,34],[-46,27],[42,20],[-18,42],[48,-8]].map(([x, y], i) => (
              <div key={i} style={{ position: "absolute", width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,.8)", left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, boxShadow: "0 0 9px rgba(255,255,255,.55)" }} />
            ))}
            <span style={{ fontSize: 56, position: "relative", zIndex: 1 }}>🔬</span>
          </div>
        </div>

        {/* ══ 2-COL MAIN: left=routines, right=products ══ */}
        {/* Left fixed at 420px so right gets maximum space for product grid */}
        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 28, alignItems: "start" }}>

          {/* ── LEFT: Routine Section ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: ".12em", textTransform: "uppercase" }}>Routine Section</p>

            {/* Morning */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#111827", marginBottom: 14 }}>Morning Routine 🌞</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {morningRoutine.map((s, i) => <RoutineStep key={i} number={s.step || i + 1} label={s.label} name={s.name} sub={s.sub} />)}
              </div>
            </div>

            {/* Night */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#111827", marginBottom: 14 }}>Night Routine 🌙</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {nightRoutine.map((s, i) => <RoutineStep key={i} number={s.step || i + 1} label={s.label} name={s.name} sub={s.sub} />)}
              </div>
            </div>

            {/* Why card */}
            <div style={{ ...card, border: "1.5px solid #FCE7F3", padding: "20px 22px" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: "linear-gradient(135deg,#FFF0F7,#FCE7F3)", border: "1.5px solid #FCE7F3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
                <div>
                  <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 900, color: "#111827" }}>Why this routine works for you</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#6B7280", lineHeight: 1.75 }}>{whyText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Products Section ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: ".12em", textTransform: "uppercase" }}>Products Section</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {displayProducts.map((p, i) => <ProductCard key={i} product={p} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}