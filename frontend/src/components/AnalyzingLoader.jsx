import { useEffect, useState, useRef } from "react";

const messages = [
  "Scanning your selfie...",
  "Detecting skin texture...",
  "Analyzing skin concerns...",
  "Matching skincare ingredients...",
  "Finding the best products for you...",
];

export default function AnalyzingLoader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [scanY, setScanY] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => prev < messages.length - 1 ? prev + 1 : prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate scan line with requestAnimationFrame
  useEffect(() => {
    let start = null;
    const duration = 1800;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) % (duration * 2);
      const progress = elapsed < duration
        ? elapsed / duration
        : 1 - (elapsed - duration) / duration;
      setScanY(progress * 100);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #FFF0F7 0%, #FFFBF8 50%, #F5F0FF 100%)",
      padding: "24px",
      fontFamily: "inherit",
      position: "relative", overflow: "hidden",
    }}>

      {/* Background blobs */}
      <div style={{
        position: "absolute", top: 60, left: 60,
        width: 260, height: 260, borderRadius: "50%",
        background: "rgba(251,207,232,.35)", filter: "blur(60px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 60, right: 60,
        width: 260, height: 260, borderRadius: "50%",
        background: "rgba(216,180,254,.35)", filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 48, position: "relative" }}>
        <h1 style={{
          fontSize: "clamp(36px,5vw,56px)", fontWeight: 900,
          background: "linear-gradient(135deg, #EC4899, #F43F5E, #A855F7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 8, letterSpacing: "-.02em",
        }}>GlowPick ✨</h1>
        <p style={{ fontSize: 16, color: "#6B7280" }}>
          Our AI is analyzing your skin
        </p>
      </div>

      {/* Face scan circle */}
      <div style={{
        position: "relative",
        width: 256, height: 256,
        borderRadius: "50%",
        overflow: "hidden",
        border: "4px solid #F9A8D4",
        boxShadow: "0 0 0 8px rgba(249,168,212,.15), 0 12px 40px rgba(236,72,153,.2)",
      }}>
        {/* Pulsing pink background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle, #FFF0F7, #FFE4EF)",
          animation: "pulse 2s ease-in-out infinite",
        }} />

        {/* Grid lines for scan effect */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(236,72,153,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        {/* Scan line */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: `${scanY}%`,
          height: 3,
          background: "linear-gradient(to right, transparent, #EC4899, #F43F5E, transparent)",
          boxShadow: "0 0 12px rgba(236,72,153,.8)",
          transition: "top 0.05s linear",
        }} />

        {/* Scan glow below line */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: `${scanY}%`,
          height: 40,
          background: "linear-gradient(to bottom, rgba(236,72,153,.15), transparent)",
        }} />

        {/* Corner markers */}
        {[
          { top: 16, left: 16 },
          { top: 16, right: 16 },
          { bottom: 16, left: 16 },
          { bottom: 16, right: 16 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 20, height: 20,
            borderTop: i < 2 ? "3px solid #EC4899" : "none",
            borderBottom: i >= 2 ? "3px solid #EC4899" : "none",
            borderLeft: i % 2 === 0 ? "3px solid #EC4899" : "none",
            borderRight: i % 2 === 1 ? "3px solid #EC4899" : "none",
          }} />
        ))}

        {/* Center face icon */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 72, opacity: 0.25,
        }}>🫧</div>
      </div>

      {/* Spinning ring */}
      <div style={{
        position: "absolute",
        width: 288, height: 288,
        borderRadius: "50%",
        border: "2px solid transparent",
        borderTop: "2px solid #EC4899",
        borderRight: "2px solid #F9A8D4",
        animation: "spin 1.6s linear infinite",
        pointerEvents: "none",
      }} />

      {/* Dots */}
      <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#EC4899",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      {/* Status message */}
      <p style={{
        marginTop: 24, fontSize: 18, fontWeight: 600,
        color: "#4B5563", textAlign: "center",
        maxWidth: 320, lineHeight: 1.5,
        transition: "opacity .5s",
      }}>
        {messages[messageIndex]}
      </p>

      {/* Progress bar */}
      <div style={{
        marginTop: 24, width: 280, height: 4,
        background: "#FCE7F3", borderRadius: 99, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(to right, #EC4899, #F43F5E)",
          width: `${((messageIndex + 1) / messages.length) * 100}%`,
          transition: "width 2s ease",
        }} />
      </div>

      <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 8 }}>
        Step {messageIndex + 1} of {messages.length}
      </p>

      {/* Keyframe styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}