import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SKIN_CONCERNS = [
  {
    name: "Acne",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4" fill="white" opacity=".5"/>
      <circle cx="12" cy="12" r="2" fill="#FC2779"/>
    </svg>
  },
  {
    name: "Dark Spots",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="9" cy="9" r="3" fill="white" opacity=".35"/>
      <circle cx="15" cy="13" r="2" fill="white" opacity=".35"/>
      <circle cx="10" cy="15" r="1.5" fill="white" opacity=".35"/>
    </svg>
  },
  {
    name: "Pigmentation",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M8 8h3v8H8zm5 0h3v8h-3z" fill="white" opacity=".6"/>
    </svg>
  },
  {
    name: "Dryness",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <path d="M12 2C8 8 5 11 5 15a7 7 0 0014 0c0-4-3-7-7-13z"/>
      <path d="M12 8c-1.5 2.5-2.5 4-2.5 6a2.5 2.5 0 005 0c0-2-1-3.5-2.5-6z" fill="white" opacity=".5"/>
    </svg>
  },
  {
    name: "Oiliness",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <path d="M12 2C8 8 5 11 5 15a7 7 0 0014 0c0-4-3-7-7-13z"/>
      <path d="M9 13c0 1.66 1.34 3 3 3s3-1.34 3-3" fill="none" stroke="white" strokeWidth="1.5" opacity=".7"/>
      <circle cx="12" cy="9" r="1.5" fill="white" opacity=".6"/>
    </svg>
  },
  {
    name: "Sensitive Skin",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      <path d="M12 18l-1-1c-3.5-3.2-6-5.5-6-8a3.5 3.5 0 017 0 3.5 3.5 0 017 0c0 2.5-2.5 4.8-6 8l-1 1z" fill="white" opacity=".35"/>
    </svg>
  },
  {
    name: "Dull Skin",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FC2779" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  },
  {
    name: "Fine Lines",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#FC2779" strokeWidth="2.5" width="24" height="24">
      <path d="M4 8c2 0 2 4 4 4s2-4 4-4 2 4 4 4 2-4 4-4" strokeLinecap="round"/>
      <path d="M4 13c2 0 2 3 4 3s2-3 4-3 2 3 4 3 2-3 4-3" strokeLinecap="round" opacity=".5"/>
    </svg>
  },
  {
    name: "Uneven Texture",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <rect x="3" y="3" width="4" height="4" rx="1"/>
      <rect x="10" y="3" width="4" height="4" rx="1" opacity=".7"/>
      <rect x="17" y="3" width="4" height="4" rx="1"/>
      <rect x="3" y="10" width="4" height="4" rx="1" opacity=".5"/>
      <rect x="10" y="10" width="4" height="4" rx="1"/>
      <rect x="17" y="10" width="4" height="4" rx="1" opacity=".6"/>
      <rect x="3" y="17" width="4" height="4" rx="1" opacity=".8"/>
      <rect x="10" y="17" width="4" height="4" rx="1" opacity=".4"/>
      <rect x="17" y="17" width="4" height="4" rx="1"/>
    </svg>
  },
  {
    name: "Other",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="24" height="24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="18" r="1" fill="white"/>
    </svg>
  },
];

const ALLERGIES = [
  {
    name: "Fragrance",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="22" height="22">
      <path d="M9 3h6v2l2 2v2H7V7l2-2V3z"/>
      <path d="M7 9h10v2c0 4-2 7-5 8-3-1-5-4-5-8V9z"/>
      <path d="M10 13c.5 1 1 1.5 2 2 1-.5 1.5-1 2-2" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  },
  {
    name: "Alcohol",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="22" height="22">
      <path d="M8 3h8l1 6H7L8 3z"/>
      <path d="M7 9h10v9a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"/>
      <path d="M10 13h4M10 16h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  },
  {
    name: "Parabens",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="22" height="22">
      <path d="M9 2h6a1 1 0 011 1v2H8V3a1 1 0 011-1z"/>
      <rect x="6" y="5" width="12" height="16" rx="2"/>
      <path d="M9 10h6M9 13h4M9 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  },
  {
    name: "Sulfates",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="22" height="22">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="2" fill="white" opacity=".7"/>
    </svg>
  },
  {
    name: "Essential Oils",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="22" height="22">
      <path d="M12 2c-2 3-5 6-5 10a5 5 0 0010 0c0-4-3-7-5-10z"/>
      <path d="M9.5 14c.5 1.5 1.2 2 2.5 2s2-.5 2.5-2" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6c-1 2-2 3.5-2 6" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".6"/>
    </svg>
  },
  {
    name: "Other",
    icon: <svg viewBox="0 0 24 24" fill="#FC2779" width="22" height="22">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="8" cy="12" r="1.5" fill="white"/>
      <circle cx="12" cy="12" r="1.5" fill="white"/>
      <circle cx="16" cy="12" r="1.5" fill="white"/>
    </svg>
  },
];

function StepBadge({ number, label, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
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
      width: 70, height: 3, borderRadius: 99,
      background: active ? "linear-gradient(to right,#FC2779,#E5E7EB)" : "#E5E7EB",
      transition: "background .3s",
    }} />
  );
}

export default function SkinProfile() {
  const navigate = useNavigate();
  const [concerns, setConcerns] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [customConcern, setCustomConcern] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");
  const [hovConcern, setHovConcern] = useState(null);
  const [hovAllergy, setHovAllergy] = useState(null);

  const toggle = (item, list, setList) =>
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  const canProceed = concerns.length > 0 &&
    (!concerns.includes("Other") || customConcern.trim());

  const handleNext = () => {
    const fc = concerns.includes("Other")
      ? [...concerns.filter(c => c !== "Other"), customConcern] : concerns;
    const fa = allergies.includes("Other")
      ? [...allergies.filter(a => a !== "Other"), customAllergy] : allergies;
    localStorage.setItem("skinProfile", JSON.stringify({
      skin_concerns: fc.map(c => c.toLowerCase()),
      allergies: fa.map(a => a.toLowerCase()),
    }));
    navigate("/upload-selfie");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#FFF0F7 0%,#FFFBF8 45%,#F5F0FF 100%)",
      fontFamily: "inherit",
      display: "flex", flexDirection: "column",
    }}>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.85); opacity: 0; }
          70%  { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .concern-card { animation: fadeSlideIn .35s ease both; }
        .concern-card:nth-child(1)  { animation-delay: .04s; }
        .concern-card:nth-child(2)  { animation-delay: .08s; }
        .concern-card:nth-child(3)  { animation-delay: .12s; }
        .concern-card:nth-child(4)  { animation-delay: .16s; }
        .concern-card:nth-child(5)  { animation-delay: .20s; }
        .concern-card:nth-child(6)  { animation-delay: .24s; }
        .concern-card:nth-child(7)  { animation-delay: .28s; }
        .concern-card:nth-child(8)  { animation-delay: .32s; }
        .concern-card:nth-child(9)  { animation-delay: .36s; }
        .concern-card:nth-child(10) { animation-delay: .40s; }
        .allergy-row { animation: fadeSlideIn .35s ease both; }
        .allergy-row:nth-child(1) { animation-delay: .06s; }
        .allergy-row:nth-child(2) { animation-delay: .12s; }
        .allergy-row:nth-child(3) { animation-delay: .18s; }
        .allergy-row:nth-child(4) { animation-delay: .24s; }
        .allergy-row:nth-child(5) { animation-delay: .30s; }
        .allergy-row:nth-child(6) { animation-delay: .36s; }
        .selected-pop { animation: popIn .25s ease both; }
        .continue-btn-active {
          background-size: 200% auto;
          background-image: linear-gradient(135deg, #FC2779 0%, #F43F5E 50%, #FC2779 100%);
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        textAlign: "center", padding: "30px 24px 20px",
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1.5px solid #FCE7F3",
        flexShrink: 0,
      }}>
        <div style={{
          display: "inline-block", marginBottom: 10,
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

        <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 20 }}>
          Your personalised skincare recommendation system
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <StepBadge number="1" label="Skin Profile" active />
          <StepLine active />
          <StepBadge number="2" label="Selfie" />
          <StepLine />
          <StepBadge number="3" label="Results" />
        </div>

        <div style={{ maxWidth: 360, margin: "0 auto" }}>
          <div style={{ height: 6, background: "#FCE7F3", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: "33%",
              background: "linear-gradient(to right,#FC2779,#F43F5E)",
              borderRadius: 99, transition: "width .5s ease",
            }} />
          </div>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>Step 1 of 3</p>
        </div>
      </div>

      {/* TWO COLUMN BODY */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr" }}>

        {/* LEFT — Concerns */}
        <div style={{
          padding: "32px 40px 32px",
          borderRight: "1.5px solid #FCE7F3",
          background: "rgba(255,255,255,.65)",
          backdropFilter: "blur(8px)",
        }}>
          <h2 style={{
            fontSize: 26, fontWeight: 900, color: "#1F2937",
            marginBottom: 4, letterSpacing: "-.02em",
          }}>Tell us about your skin 💖</h2>
          <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 28 }}>
            Select all that apply — we'll craft recommendations just for you.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 5, height: 28, borderRadius: 99, display: "inline-block",
                background: "linear-gradient(to bottom,#FC2779,#F43F5E)",
              }} />
              <span style={{ fontSize: 18, fontWeight: 900, color: "#1F2937" }}>Skin Concerns</span>
              <span style={{ color: "#F87171", fontSize: 18 }}>*</span>
            </div>
            {concerns.length > 0 && (
              <span className="selected-pop" style={{
                fontSize: 12, fontWeight: 800, color: "#FC2779",
                background: "#FFF0F7", padding: "6px 18px", borderRadius: 99,
                border: "1.5px solid #FCE7F3",
                boxShadow: "0 2px 10px rgba(252,39,121,.1)",
              }}>{concerns.length} selected ✓</span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SKIN_CONCERNS.map((item, idx) => {
              const sel = concerns.includes(item.name);
              const hov = hovConcern === item.name;
              return (
                <button
                  key={item.name}
                  className="concern-card"
                  onClick={() => toggle(item.name, concerns, setConcerns)}
                  onMouseEnter={() => setHovConcern(item.name)}
                  onMouseLeave={() => setHovConcern(null)}
                  style={{
                    position: "relative",
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "18px 20px",
                    borderRadius: 18, cursor: "pointer",
                    transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
                    transform: sel ? "scale(1.02)" : hov ? "translateY(-3px) scale(1.01)" : "none",
                    background: sel
                      ? "linear-gradient(135deg,#FFF0F7,#FFD6EA)"
                      : hov ? "#FFF5FA" : "#fff",
                    border: sel
                      ? "2px solid #FC2779"
                      : `2px solid ${hov ? "#F9A8D4" : "#F0E0EA"}`,
                    boxShadow: sel
                      ? "0 8px 24px rgba(252,39,121,.22)"
                      : hov ? "0 6px 18px rgba(252,39,121,.12)"
                      : "0 2px 12px rgba(252,39,121,.06)",
                    textAlign: "left",
                  }}
                >
                  {sel && (
                    <div style={{
                      position: "absolute", top: 9, right: 9,
                      width: 22, height: 22, borderRadius: "50%",
                      background: "#FC2779", color: "#fff",
                      fontSize: 11, fontWeight: 900,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(252,39,121,.4)",
                    }}>✓</div>
                  )}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: sel
                      ? "rgba(252,39,121,.12)"
                      : hov ? "#FFF0F7" : "#FFF5FA",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: sel ? "1.5px solid #FC2779" : "1.5px solid #FFD6EA",
                    transition: "all .2s",
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: 15, fontWeight: 700,
                    color: sel ? "#BE185D" : "#1F2937",
                    lineHeight: 1.3,
                  }}>{item.name}</span>
                </button>
              );
            })}
          </div>

          {concerns.includes("Other") && (
            <input
              style={{
                width: "100%", marginTop: 14, boxSizing: "border-box",
                borderRadius: 16, border: "2px solid #F9A8D4",
                background: "#fff", padding: "16px 20px",
                fontSize: 15, fontFamily: "inherit", outline: "none",
                boxShadow: "0 2px 12px rgba(252,39,121,.08)",
                transition: "border-color .2s",
              }}
              placeholder="Describe your specific concern..."
              value={customConcern}
              onChange={e => setCustomConcern(e.target.value)}
            />
          )}
        </div>

        {/* RIGHT — Allergies only */}
        <div style={{
          padding: "32px 40px 32px",
          background: "rgba(255,255,255,.5)",
          backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column",
        }}>

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, opacity: 0, userSelect: "none", marginBottom: 4 }}>·</h2>
            <p style={{ fontSize: 15, opacity: 0, userSelect: "none" }}>·</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 5, height: 28, borderRadius: 99, display: "inline-block",
                background: "linear-gradient(to bottom,#C084FC,#FC2779)",
              }} />
              <span style={{ fontSize: 18, fontWeight: 900, color: "#1F2937" }}>Allergies & Sensitivities</span>
              <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>(optional)</span>
            </div>
            {allergies.length > 0 && (
              <span className="selected-pop" style={{
                fontSize: 12, fontWeight: 800, color: "#A855F7",
                background: "#FAF5FF", padding: "6px 18px", borderRadius: 99,
                border: "1.5px solid #E9D5FF",
                boxShadow: "0 2px 10px rgba(168,85,247,.1)",
              }}>{allergies.length} selected ✓</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ALLERGIES.map(item => {
              const sel = allergies.includes(item.name);
              const hov = hovAllergy === item.name;
              return (
                <button
                  key={item.name}
                  className="allergy-row"
                  onClick={() => toggle(item.name, allergies, setAllergies)}
                  onMouseEnter={() => setHovAllergy(item.name)}
                  onMouseLeave={() => setHovAllergy(null)}
                  style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "17px 22px", borderRadius: 16,
                    cursor: "pointer",
                    transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
                    transform: sel ? "scale(1.01)" : hov ? "translateX(4px)" : "none",
                    background: sel
                      ? "linear-gradient(135deg,#FFF0F7,#F5F0FF)"
                      : hov ? "#FFF8FB" : "#fff",
                    border: sel
                      ? "2px solid #FC2779"
                      : `2px solid ${hov ? "#D8B4FE" : "#EDE0F5"}`,
                    boxShadow: sel
                      ? "0 6px 20px rgba(252,39,121,.18)"
                      : hov ? "0 4px 14px rgba(168,85,247,.1)"
                      : "0 2px 10px rgba(168,85,247,.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                      background: sel ? "rgba(252,39,121,.1)" : "#FFF0F7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: sel ? "1.5px solid #FC2779" : "1.5px solid #FFD6EA",
                      transition: "all .2s",
                    }}>
                      {item.icon}
                    </div>
                    <span style={{
                      fontSize: 15, fontWeight: 700,
                      color: sel ? "#BE185D" : "#1F2937",
                    }}>{item.name}</span>
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    border: sel ? "none" : "2px solid #D8B4FE",
                    background: sel ? "#FC2779" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
                    transform: sel ? "scale(1.1)" : "scale(1)",
                  }}>
                    {sel && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {allergies.includes("Other") && (
            <input
              style={{
                width: "100%", marginTop: 14, boxSizing: "border-box",
                borderRadius: 16, border: "2px solid #D8B4FE",
                background: "#fff", padding: "16px 20px",
                fontSize: 15, fontFamily: "inherit", outline: "none",
                boxShadow: "0 2px 12px rgba(168,85,247,.08)",
              }}
              placeholder="Describe your specific allergy..."
              value={customAllergy}
              onChange={e => setCustomAllergy(e.target.value)}
            />
          )}

          {/* Privacy note */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 14,
            padding: "16px 20px", marginTop: 20,
            background: "linear-gradient(to right,#FFF1F5,#F5F3FF)",
            borderRadius: 16, border: "1.5px solid #FCE7F3",
            boxShadow: "0 2px 10px rgba(252,39,121,.06)",
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#1F2937", marginBottom: 3 }}>
                Your data is safe with us
              </p>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                We use this only to personalize your skincare recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        padding: "20px 40px 24px",
        background: "rgba(255,255,255,.95)",
        borderTop: "1.5px solid #FCE7F3",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
      }}>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          onMouseEnter={e => {
            if (canProceed) {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 20px 50px rgba(252,39,121,.45)";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = canProceed
              ? "0 8px 32px rgba(252,39,121,.32)" : "none";
          }}
          style={{
            width: "100%", padding: "22px 24px",
            borderRadius: 99, border: "none",
            fontSize: 15, fontWeight: 900, letterSpacing: ".05em",
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "all .28s cubic-bezier(.34,1.56,.64,1)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            background: canProceed
              ? "linear-gradient(135deg,#FC2779 0%,#F43F5E 50%,#FC2779 100%)"
              : "#F3F4F6",
            backgroundSize: canProceed ? "200% auto" : "auto",
            color: canProceed ? "#fff" : "#9CA3AF",
            boxShadow: canProceed ? "0 8px 32px rgba(252,39,121,.32)" : "none",
          }}
        >
          {canProceed ? (
            <>
              <span>Continue to Selfie Analysis</span>
              <span style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 900,
              }}>→</span>
            </>
          ) : (
            <span>Select at least one skin concern to continue</span>
          )}
        </button>

        {!canProceed && concerns.length === 0 && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#9CA3AF", marginTop: 10 }}>
            👆 Pick what you'd like to improve on the left
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "14px",
        fontSize: 14, color: "#9CA3AF",
        borderTop: "1px solid #FCE7F3",
        background: "rgba(255,255,255,.6)",
        flexShrink: 0,
      }}>
        Made with 💕 for healthier skin
      </div>
    </div>
  );
}
