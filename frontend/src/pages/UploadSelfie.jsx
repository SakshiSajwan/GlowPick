import Webcam from "react-webcam";
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import AnalyzingLoader from "../components/AnalyzingLoader";
import { getRecommendations } from "../services/api";

const TIPS = [
  { icon: "☀️", title: "Good lighting", desc: "Use natural daylight. Avoid harsh shadows or backlighting for precise skin texture mapping." },
  { icon: "🚫", title: "No filters", desc: "Remove makeup if possible and avoid social media filters for an accurate analysis." },
  { icon: "🧍", title: "Face clearly visible", desc: "Neutral expression, entire face in frame, looking directly at the camera." },
  { icon: "🤳", title: "Only selfies accepted", desc: "Our AI requires a clear human face. Product photos, landscapes, or animals will be rejected." },
];

/* ─── SAME StepBadge & StepLine as SkinProfile ─── */
function StepBadge({ number, label, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, fontWeight: 800, flexShrink: 0,
        background: active ? "linear-gradient(135deg,#FC2779,#F43F5E)" : "#fff",
        color: active ? "#fff" : "#9CA3AF",
        border: active ? "none" : "2px solid #E5E7EB",
        boxShadow: active ? "0 4px 14px rgba(252,39,121,.35)" : "none",
        transition: "all .3s",
      }}>{number}</div>
      <span style={{ fontSize: 18, fontWeight: 700, color: active ? "#FC2779" : "#9CA3AF" }}>
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

export default function UploadSelfie() {
  const navigate     = useNavigate();
  const webcamRef    = useRef(null);
  const canvasRef    = useRef(null);
  const fileInputRef = useRef(null);
  const intervalRef  = useRef(null);
  const modelsLoaded = useRef(false);

  const [preview,       setPreview]       = useState(null);
  const [imageFile,     setImageFile]     = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [validating,    setValidating]    = useState(false);
  const [cameraOn,      setCameraOn]      = useState(false);
  const [modelsReady,   setModelsReady]   = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [rejectMsg,     setRejectMsg]     = useState("");
  const [faceDetected,  setFaceDetected]  = useState(false);
  const [faceScore,     setFaceScore]     = useState(0);
  const [dragOver,      setDragOver]      = useState(false);
  const [capturing,     setCapturing]     = useState(false);

  useEffect(() => {
    const load = async () => {
      setModelsLoading(true);
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        modelsLoaded.current = true;
        setModelsReady(true);
      } catch (err) {
        console.warn("face-api models failed:", err);
      } finally {
        setModelsLoading(false);
      }
    };
    load();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const detectRealtime = useCallback(async () => {
    if (!webcamRef.current || !canvasRef.current || !modelsLoaded.current) return;
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    try {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.35 });
      const det = await faceapi.detectSingleFace(video, options).withFaceLandmarks();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (det) {
        const score = Math.round(det.detection.score * 100);
        setFaceDetected(true);
        setFaceScore(score);
        const { x, y, width, height } = det.detection.box;
        const color = score > 70 ? "#22C55E" : score > 45 ? "#F59E0B" : "#EF4444";
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.shadowColor = color; ctx.shadowBlur = 16;
        roundRect(ctx, x, y, width, height, 16); ctx.stroke();
        drawCorners(ctx, x, y, width, height, color);
        ctx.shadowBlur = 0; ctx.fillStyle = color + "CC";
        ctx.fillRect(x, y - 34, 120, 28);
        ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`Face ${score}%`, x + 8, y - 14);
        const lm = det.landmarks.positions;
        ctx.fillStyle = color + "99";
        lm.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2); ctx.fill(); });
      } else {
        setFaceDetected(false); setFaceScore(0);
        ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; ctx.setLineDash([10, 6]);
        ctx.beginPath(); ctx.ellipse(canvas.width / 2, canvas.height / 2, 110, 145, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
    } catch { }
  }, []);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  function drawCorners(ctx, x, y, w, h, color) {
    const len = 22;
    ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.shadowColor = color; ctx.shadowBlur = 12;
    const pts = [
      [x, y + len, x, y, x + len, y], [x + w - len, y, x + w, y, x + w, y + len],
      [x, y + h - len, x, y + h, x + len, y + h], [x + w - len, y + h, x + w, y + h, x + w, y + h - len],
    ];
    pts.forEach(([x1, y1, cx, cy, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(cx, cy); ctx.lineTo(x2, y2); ctx.stroke();
    });
    ctx.shadowBlur = 0;
  }

  useEffect(() => {
    if (cameraOn) {
      intervalRef.current = setInterval(detectRealtime, 120);
    } else {
      clearInterval(intervalRef.current);
      setFaceDetected(false); setFaceScore(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [cameraOn, detectRealtime]);

  const validateAndSetImage = async (file) => {
    setRejectMsg("");
    if (!file) return;
    if (!file.type.startsWith("image/")) { setRejectMsg("❌ Only image files are accepted (JPG, PNG)."); return; }
    if (file.size > 10 * 1024 * 1024) { setRejectMsg("❌ File too large. Max 10 MB."); return; }
    setValidating(true);
    const url = URL.createObjectURL(file);
    try {
      const img = new Image(); img.src = url;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      if (!modelsReady) {
        setRejectMsg("⚠️ Face detection still loading — please wait a moment and try again.");
        URL.revokeObjectURL(url); setValidating(false); return;
      }
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.4 });
      const det = await faceapi.detectSingleFace(img, options).withFaceLandmarks();
      if (!det || det.detection.score < 0.45) {
        setRejectMsg("❌ No human face detected. Please upload a clear front-facing selfie.");
        URL.revokeObjectURL(url); setValidating(false); return;
      }
      setPreview(url); setImageFile(file); setCameraOn(false);
    } catch {
      setRejectMsg("❌ Could not process image. Try a different photo.");
      URL.revokeObjectURL(url);
    }
    setValidating(false);
  };

  const capturePhoto = async () => {
    if (!faceDetected || faceScore < 45) { setRejectMsg("⚠️ Please position your face clearly in the frame first."); return; }
    setCapturing(true);
    setTimeout(async () => {
      const screenshot = webcamRef.current?.getScreenshot({ width: 1280, height: 720 });
      setCapturing(false);
      if (!screenshot) return;
      const img = new Image(); img.src = screenshot;
      await new Promise(r => { img.onload = r; });
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.4 });
      const det = await faceapi.detectSingleFace(img, options).withFaceLandmarks();
      if (!det || det.detection.score < 0.4) { setRejectMsg("❌ Could not confirm face. Please try again."); return; }
      const blob = await fetch(screenshot).then(r => r.blob());
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      setImageFile(file); setPreview(screenshot); setCameraOn(false); setRejectMsg("");
    }, 300);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetImage(file);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    const stored = localStorage.getItem("skinProfile");
    if (!stored) { alert("Please complete your skin profile first."); navigate("/recommend"); return; }
    setLoading(true);
    try {
      const profile = JSON.parse(stored);
      const result  = await getRecommendations(profile, imageFile);
      navigate("/results", { state: result });
    } catch (err) {
      console.error(err);
      alert("Backend error. Check if server is running.");
      setLoading(false);
    }
  };

  if (loading) return <AnalyzingLoader />;

  const faceColor = faceScore > 70 ? "#22C55E" : faceScore > 45 ? "#F59E0B" : "#EF4444";
  const faceLabel = faceScore > 70
    ? "✅ Great — ready to capture!"
    : faceScore > 45 ? "⚠️ Move closer / better light"
    : faceDetected ? "❌ Face too unclear"
    : "👤 Position your face in the oval";

  return (
    <div style={{
      minHeight: "calc(100vh - 180px)",
      background: "linear-gradient(135deg,#FFF0F7 0%,#FFFBF8 40%,#F5F0FF 100%)",
      position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
    }}>

      {/* Background glows */}
      <div style={{ position:"absolute",top:-120,left:-120,width:400,height:400,background:"radial-gradient(circle,#FC277933,transparent)",filter:"blur(80px)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:-120,right:-120,width:400,height:400,background:"radial-gradient(circle,#A855F733,transparent)",filter:"blur(100px)",pointerEvents:"none" }} />

      <style>{`
        @keyframes pulse-ring { 0% { transform:scale(1); opacity:0.7; } 100% { transform:scale(1.18); opacity:0; } }
        @keyframes capture-flash { 0% { opacity:0; } 20% { opacity:0.7; } 100% { opacity:0; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .tip-row:hover { transform: translateX(8px); }
      `}</style>

      {/* ── HEADER (same as SkinProfile) ── */}
      <div style={{
        textAlign: "center", padding: "30px 24px 20px",
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1.5px solid #FCE7F3",
        flexShrink: 0,
        position: "relative", zIndex: 2,
      }}>
        <div style={{
          display: "inline-block", marginBottom: 10,
          padding: "6px 22px", borderRadius: 99,
          background: "#FFF0F7", border: "1.5px solid #FCE7F3",
          boxShadow: "0 2px 12px rgba(252,39,121,.08)",
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FC2779", letterSpacing: ".06em" }}>
            ✨ AI-Powered Skincare
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(34px,5vw,54px)", fontWeight: 900, marginBottom: 6,
          background: "linear-gradient(135deg,#FC2779,#F43F5E,#A855F7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-.03em", lineHeight: 1.1,
        }}>GlowBot</h1>

        <p style={{ fontSize: 20, color: "#6B7280", marginBottom: 20 }}>
          Your personalised skincare recommendation system
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <StepBadge number="1" label="Skin Profile" active />
          <StepLine active />
          <StepBadge number="2" label="Selfie" active />
          <StepLine />
          <StepBadge number="3" label="Results" />
        </div>

        <div style={{ maxWidth: 360, margin: "0 auto" }}>
          <div style={{ height: 6, background: "#FCE7F3", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: "66%",
              background: "linear-gradient(to right,#FC2779,#F43F5E)",
              borderRadius: 99, transition: "width .5s ease",
            }} />
          </div>
          <p style={{ fontSize: 16, color: "#9CA3AF", marginTop: 6 }}>Step 2 of 3</p>
        </div>
      </div>
      {/* ── HEADER END ── */}

      {/* ── Main two-column grid ── */}
      <div style={{
        display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:28,
        padding:"28px 48px 0", flex:1, position:"relative", zIndex:2,
      }}>

        {/* ═══ LEFT — Camera / Upload ═══ */}
        <div style={{
          background:"rgba(255,255,255,0.88)", backdropFilter:"blur(20px)",
          borderRadius:28, border:"1px solid rgba(255,255,255,0.7)",
          boxShadow:"0 20px 60px rgba(252,39,121,0.13)", padding:32,
          display:"flex", flexDirection:"column", gap:20, animation:"fadeIn 0.4s ease",
        }}>

          <div>
            <h2 style={{
              fontSize:32, fontWeight:900, marginBottom:6,
              background:"linear-gradient(135deg,#FC2779,#F43F5E)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              Capture Your Selfie ✨
            </h2>
            <p style={{ fontSize:18, color:"#6B7280" }}>
              Our AI analyzes your skin deeply for accurate results.
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:12 }}>
            <button
              onClick={() => { setPreview(null); setImageFile(null); setRejectMsg(""); setCameraOn(v => !v); }}
              style={{
                flex:1, height:52, borderRadius:14,
                border:`2px solid ${cameraOn ? "#FC2779" : "#F0E0EA"}`,
                background:cameraOn ? "#FFF0F7" : "#fff",
                color:cameraOn ? "#FC2779" : "#2D2D2D",
                fontSize:18, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s",
              }}
            >
              {cameraOn ? <><span>✖</span> Close Camera</> : <><span>📷</span> Open Camera</>}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={validating}
              style={{
                flex:1, height:52, borderRadius:14, border:"none",
                background:"linear-gradient(135deg,#FC2779,#F43F5E)",
                color:"#fff", fontSize:18, fontWeight:700, cursor:"pointer",
                boxShadow:"0 6px 18px rgba(252,39,121,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                transition:"all 0.2s", opacity:validating ? 0.7 : 1,
              }}
            >
              {validating
                ? <><span style={{ width:18,height:18,border:"2px solid #fff",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block" }}/> Validating…</>
                : <><span>⬆️</span> Upload Photo</>
              }
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }}
              onChange={e => validateAndSetImage(e.target.files?.[0])} />
          </div>

          {/* Model loading */}
          {modelsLoading && (
            <div style={{ display:"flex", alignItems:"center", gap:10, color:"#9CA3AF", fontSize:18 }}>
              <span style={{ width:16,height:16,border:"2px solid #E5E7EB",borderTopColor:"#FC2779",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block" }} />
              Loading face detection models…
            </div>
          )}

          {/* Webcam */}
          {cameraOn && (
            <div style={{ flex:1, position:"relative", borderRadius:20, overflow:"hidden", background:"#0D0D0D", minHeight:340 }}>
              {capturing && (
                <div style={{ position:"absolute",inset:0,background:"white",zIndex:20,animation:"capture-flash 0.4s ease forwards",borderRadius:20 }} />
              )}
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode:"user", width:1280, height:720 }}
                style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:20, display:"block" }}
                mirrored
              />
              <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }} />

              <div style={{
                position:"absolute",bottom:0,left:0,right:0,padding:"12px 18px",
                background:"linear-gradient(transparent,rgba(0,0,0,0.7))",
                borderBottomLeftRadius:20, borderBottomRightRadius:20,
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
                <span style={{ color:"#fff",fontSize:18,fontWeight:600 }}>{faceLabel}</span>
                {faceDetected && (
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:100,height:6,borderRadius:99,background:"rgba(255,255,255,0.2)" }}>
                      <div style={{ width:`${faceScore}%`,height:"100%",borderRadius:99,background:faceColor,transition:"width 0.3s" }} />
                    </div>
                    <span style={{ color:faceColor,fontSize:16,fontWeight:700 }}>{faceScore}%</span>
                  </div>
                )}
              </div>

              {faceDetected && faceScore > 70 && (
                <div style={{
                  position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                  width:200,height:200,borderRadius:"50%",border:"3px solid #22C55E",
                  animation:"pulse-ring 1.4s ease-out infinite",pointerEvents:"none",
                }} />
              )}
            </div>
          )}

          {/* Preview */}
          {preview && !cameraOn && (
            <div style={{ position:"relative",borderRadius:20,overflow:"hidden",flex:1,minHeight:260,animation:"fadeIn 0.3s ease" }}>
              <img src={preview} alt="Your selfie" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
              <div style={{
                position:"absolute",bottom:0,left:0,right:0,padding:"14px 18px",
                background:"linear-gradient(transparent,rgba(0,0,0,0.65))",
                display:"flex",alignItems:"center",gap:10,
              }}>
                <span style={{ fontSize:28 }}>✅</span>
                <span style={{ color:"#fff",fontWeight:700,fontSize:20 }}>Face validated — ready to analyze!</span>
                <button
                  onClick={() => { setPreview(null); setImageFile(null); setRejectMsg(""); }}
                  style={{ marginLeft:"auto",background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:99,padding:"6px 14px",fontSize:13,fontWeight:600,cursor:"pointer" }}
                >
                  Retake
                </button>
              </div>
            </div>
          )}

          {/* Drop zone */}
          {!cameraOn && !preview && (
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex:1, border:`2px dashed ${dragOver ? "#FC2779" : "#F9A8D4"}`,
                borderRadius:20, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", gap:12,
                background:dragOver ? "#FFF0F7" : "#FFFBFD",
                cursor:"pointer", transition:"all 0.2s", minHeight:200, padding:32,
              }}
            >
              <span style={{ fontSize:54 }}>🤳</span>
              <p style={{ fontSize:24,fontWeight:700,color:"#D91A66" }}>Drag & drop your selfie here</p>
              <p style={{ fontSize:20,color:"#9CA3AF" }}>or click to browse · JPG, PNG · max 10MB</p>
            </div>
          )}

          {/* Capture button */}
          {cameraOn && (
            <button
              onClick={capturePhoto}
              disabled={!faceDetected || faceScore < 45}
              style={{
                height:56, borderRadius:14, border:"none",
                background: faceDetected && faceScore >= 45 ? "linear-gradient(135deg,#22C55E,#16A34A)" : "rgba(156,163,175,0.4)",
                color:"#fff", fontSize:20, fontWeight:800,
                cursor: faceDetected && faceScore >= 45 ? "pointer" : "not-allowed",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                transition:"all 0.3s",
                boxShadow: faceDetected && faceScore >= 45 ? "0 6px 20px rgba(34,197,94,0.4)" : "none",
              }}
            >
              {faceDetected && faceScore >= 45 ? "📸  Capture Selfie" : "Position your face to enable capture"}
            </button>
          )}

          {/* Error */}
          {rejectMsg && (
            <div style={{
              background:"#FFF5F5", border:"1.5px solid #FCA5A5", borderRadius:12,
              padding:"14px 18px", color:"#DC2626", fontSize:18, fontWeight:500,
              lineHeight:1.5, animation:"fadeIn 0.3s ease",
            }}>
              {rejectMsg}
            </div>
          )}
        </div>
        {/* ═══ LEFT END ═══ */}

        {/* ═══ RIGHT — Tips ═══ */}
        <div style={{
          background:"rgba(255,255,255,0.88)", backdropFilter:"blur(20px)",
          borderRadius:28, border:"1px solid rgba(255,255,255,0.7)",
          boxShadow:"0 20px 60px rgba(252,39,121,0.13)", padding:36,
          display:"flex", flexDirection:"column", gap:8, animation:"fadeIn 0.4s ease 0.1s both",
        }}>
          <h2 style={{ fontSize:30,fontWeight:900,marginBottom:16,color:"#1a1a1a" }}>
            Tips for best results
          </h2>

          {TIPS.map((tip, i) => (
            <div key={i} className="tip-row" style={{
              display:"flex", gap:18, alignItems:"flex-start",
              padding:"18px 16px", borderRadius:16,
              background: i % 2 === 0 ? "#FFF8FC" : "transparent",
              border:"1px solid #F5E0EC", transition:"transform 0.2s", flex:1,
            }}>
              <div style={{
                width:54, height:54, borderRadius:"50%", flexShrink:0,
                background:"linear-gradient(135deg,#FFF0F7,#FFE0EF)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:26, border:"1.5px solid #F9A8D4",
              }}>
                {tip.icon}
              </div>
              <div>
                <p style={{ fontSize:24,fontWeight:800,color:"#1a1a1a",marginBottom:5 }}>{tip.title}</p>
                <p style={{ fontSize:22,color:"#6B7280",lineHeight:1.6 }}>{tip.desc}</p>
              </div>
            </div>
          ))}

          <div style={{
            marginTop:"auto", padding:"16px 18px",
            background:"linear-gradient(135deg,#FFF0F7,#F5F0FF)",
            borderRadius:16, border:"1px solid #F9A8D4",
          }}>
            <p style={{ fontSize:16,fontWeight:800,color:"#9CA3AF",letterSpacing:"0.08em",marginBottom:10,textTransform:"uppercase" }}>
              Face Detection Guide
            </p>
            {[
              { color:"#22C55E", label:"70–100%", desc:"Ready to capture"            },
              { color:"#F59E0B", label:"45–69%",  desc:"Move closer or improve light" },
              { color:"#EF4444", label:"0–44%",   desc:"Face not clear enough"        },
            ].map(item => (
              <div key={item.label} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:7 }}>
                <div style={{ width:12,height:12,borderRadius:"50%",background:item.color,flexShrink:0 }} />
                <span style={{ fontSize:15,fontWeight:700,color:"#374151",minWidth:60 }}>{item.label}</span>
                <span style={{ fontSize:15,color:"#6B7280" }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
        {/* ═══ RIGHT END ═══ */}

      </div>
      {/* ── Main grid END ── */}

      {/* ── Analyze CTA ── */}
      <div style={{ padding:"24px 48px 40px",position:"relative",zIndex:2 }}>
        <button
          onClick={handleAnalyze}
          disabled={!imageFile}
          style={{
            width:"100%", height:68, borderRadius:999,
            fontSize:22, fontWeight:900, border:"none",
            background: imageFile ? "linear-gradient(135deg,#FC2779,#F43F5E)" : "rgba(156,163,175,0.35)",
            color: imageFile ? "#fff" : "#9CA3AF",
            cursor: imageFile ? "pointer" : "not-allowed",
            transition:"all 0.3s",
            boxShadow: imageFile ? "0 12px 40px rgba(252,39,121,0.4)" : "none",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          }}
          onMouseEnter={e => { if (imageFile) e.currentTarget.style.transform="translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; }}
        >
          {imageFile ? "✨  Analyze My Skin" : "📸  Capture or upload a selfie first"}
        </button>
      </div>

    </div>
  );
}