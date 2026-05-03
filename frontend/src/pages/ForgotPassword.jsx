import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../context/Context';
import api from '../services/api';

function Spinner() {
    return (
        <span style={{
            display: 'inline-block', width: 20, height: 20,
            border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
            borderRadius: '50%', animation: 'gpSpin 0.7s linear infinite',
        }} />
    );
}

function OtpInput({ value, onChange }) {
    const inputs = [];
    const digits = value.split('');

    const handleChange = (e, i) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const arr = [...digits];
        arr[i] = val;
        onChange(arr.join(''));
        if (val && i < 5) inputs[i + 1]?.focus();
    };

    const handleKey = (e, i) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) inputs[i - 1]?.focus();
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(paste.padEnd(6, '').slice(0, 6));
        e.preventDefault();
    };

    return (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[0,1,2,3,4,5].map(i => (
                <input
                    key={i}
                    ref={el => inputs[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digits[i] || ''}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKey(e, i)}
                    onPaste={handlePaste}
                    style={{
                        width: 52, height: 58, textAlign: 'center',
                        fontSize: 24, fontWeight: 800, borderRadius: 14, outline: 'none',
                        border: `2px solid ${digits[i] ? '#FC2779' : '#e5e7eb'}`,
                        background: digits[i] ? '#FFF0F7' : '#fafafa',
                        color: '#1a1a1a', fontFamily: 'inherit', transition: 'all 0.2s',
                        boxShadow: digits[i] ? '0 0 0 3px rgba(252,39,121,0.15)' : 'none',
                    }}
                />
            ))}
        </div>
    );
}

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { openLogin } = useGlobalContext();

    const [step,        setStep]        = useState('email');
    const [email,       setEmail]       = useState('');
    const [otp,         setOtp]         = useState('');
    const [password,    setPassword]    = useState('');
    const [confirm,     setConfirm]     = useState('');
    const [loading,     setLoading]     = useState(false);
    const [countdown,   setCountdown]   = useState(0);

    const startCountdown = () => {
        setCountdown(60);
        const t = setInterval(() => {
            setCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
        }, 1000);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) { toast.error('Please enter your email'); return; }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('OTP sent to your email 📧');
            setStep('otp'); startCountdown();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Could not send OTP.');
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length < 6) { toast.error('Enter the full 6-digit OTP'); return; }
        setLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            toast.success('OTP verified ✅'); setStep('reset');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Invalid or expired OTP.');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setOtp(''); setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('New OTP sent 📧'); startCountdown();
        } catch { toast.error('Could not resend OTP.'); }
        finally { setLoading(false); }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        if (password !== confirm) { toast.error("Passwords don't match"); return; }
        setLoading(true);
        try {
            await api.post('/auth/reset-password-otp', { email, otp, password });
            toast.success('Password reset successfully! 🎉');
            setStep('done');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Reset failed.');
        } finally { setLoading(false); }
    };

    const btnStyle = (disabled) => ({
        width: '100%', height: 56, borderRadius: 16, marginTop: 8,
        background: disabled ? '#f9a8d4' : 'linear-gradient(135deg,#B5006B,#FC2779)',
        color: 'white', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 18, fontWeight: 800, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        boxShadow: disabled ? 'none' : '0 8px 28px rgba(181,0,107,0.38)',
        transition: 'all 0.2s',
    });

    const inputStyle = {
        width: '100%', height: 52, boxSizing: 'border-box',
        border: '2px solid #e5e7eb', borderRadius: 14,
        padding: '0 16px', fontSize: 17, fontFamily: 'inherit',
        background: '#fafafa', color: '#1a1a1a', outline: 'none',
        transition: 'all 0.2s',
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '24px 16px',
            background: 'linear-gradient(135deg,#FFF0F7 0%,#FFFBF8 40%,#F5F0FF 100%)',
        }}>
            <style>{`@keyframes gpSpin { to { transform: rotate(360deg); } }`}</style>

            <div style={{
                width: '100%', maxWidth: 480, background: 'white',
                borderRadius: 28, overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg,#B5006B 0%,#FC2779 55%,#FF6BAD 100%)',
                    padding: '36px 40px 28px', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position:'absolute',width:180,height:180,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.15)',top:-50,right:-20,pointerEvents:'none' }}/>
                    <div style={{ fontWeight:900,fontSize:36,color:'white',letterSpacing:'-0.02em',lineHeight:1,marginBottom:8 }}>
                        GLOW<span style={{ fontStyle:'italic',opacity:0.85 }}>PICK</span>
                    </div>
                    <p style={{ fontSize:20,color:'rgba(255,255,255,0.9)',fontWeight:400 }}>🔐 Reset your password</p>

                    {/* Progress dots */}
                    <div style={{ display:'flex',gap:8,marginTop:20 }}>
                        {['email','otp','reset'].map((s,i) => {
                            const steps = ['email','otp','reset'];
                            const cur = steps.indexOf(step === 'done' ? 'reset' : step);
                            const done = cur > i; const active = cur === i;
                            return (
                                <div key={s} style={{
                                    height:8, borderRadius:99,
                                    width: active ? 32 : 12,
                                    background: done ? '#22c55e' : active ? 'white' : 'rgba(255,255,255,0.3)',
                                    transition:'all 0.3s',
                                }}/>
                            );
                        })}
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding:'36px 40px 40px', display:'flex', flexDirection:'column', gap:20 }}>

                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOtp} style={{ display:'flex',flexDirection:'column',gap:16 }}>
                            <div style={{ textAlign:'center' }}>
                                <div style={{ fontSize:48,marginBottom:8 }}>🔐</div>
                                <p style={{ fontSize:15,color:'#6b7280' }}>Enter your registered email and we'll send a 6-digit OTP.</p>
                            </div>
                            <div>
                                <label style={{ display:'block',fontSize:16,fontWeight:700,color:'#444',marginBottom:8 }}>Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com" required style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor='#FC2779'; e.target.style.boxShadow='0 0 0 4px rgba(252,39,121,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }}
                                />
                            </div>
                            <button type="submit" disabled={loading} style={btnStyle(loading)}>
                                {loading ? <><Spinner/> Sending OTP…</> : 'Send OTP →'}
                            </button>
                            <div style={{ textAlign:'center' }}>
                                <Link to="/" onClick={openLogin} style={{ color:'#FC2779',fontSize:15,fontWeight:700,textDecoration:'none' }}>
                                    ← Back to Sign In
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOtp} style={{ display:'flex',flexDirection:'column',gap:20 }}>
                            <div style={{ textAlign:'center' }}>
                                <div style={{ fontSize:48,marginBottom:8 }}>📧</div>
                                <p style={{ fontSize:15,color:'#6b7280' }}>
                                    We sent a 6-digit OTP to <strong style={{ color:'#FC2779' }}>{email}</strong>.<br/>Enter it below within 10 minutes.
                                </p>
                            </div>
                            <OtpInput value={otp} onChange={setOtp} />
                            <div style={{ textAlign:'center' }}>
                                {countdown > 0
                                    ? <span style={{ fontSize:14,color:'#9ca3af' }}>Resend in <strong style={{ color:'#FC2779' }}>{countdown}s</strong></span>
                                    : <button type="button" onClick={handleResend} disabled={loading}
                                        style={{ background:'none',border:'none',color:'#FC2779',fontSize:15,fontWeight:700,cursor:'pointer',textDecoration:'underline' }}>
                                        Resend OTP
                                    </button>
                                }
                            </div>
                            <button type="submit" disabled={loading || otp.length < 6} style={btnStyle(loading || otp.length < 6)}>
                                {loading ? <><Spinner/> Verifying…</> : 'Verify OTP →'}
                            </button>
                            <button type="button" onClick={() => { setStep('email'); setOtp(''); }} style={{
                                background:'none',border:'none',color:'#9ca3af',fontSize:14,fontWeight:600,cursor:'pointer',
                            }}>← Change email</button>
                        </form>
                    )}

                    {/* Step 3: New password */}
                    {step === 'reset' && (
                        <form onSubmit={handleReset} style={{ display:'flex',flexDirection:'column',gap:16 }}>
                            <div style={{ textAlign:'center' }}>
                                <div style={{ fontSize:48,marginBottom:8 }}>🔑</div>
                                <p style={{ fontSize:15,color:'#6b7280' }}>Create a new strong password for your account.</p>
                            </div>
                            <div>
                                <label style={{ display:'block',fontSize:16,fontWeight:700,color:'#444',marginBottom:8 }}>New Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters" style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor='#FC2779'; e.target.style.boxShadow='0 0 0 4px rgba(252,39,121,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }}
                                />
                            </div>
                            <div>
                                <label style={{ display:'block',fontSize:16,fontWeight:700,color:'#444',marginBottom:8 }}>Confirm Password</label>
                                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                                    placeholder="Repeat your password" style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor='#FC2779'; e.target.style.boxShadow='0 0 0 4px rgba(252,39,121,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; }}
                                />
                                {confirm && confirm === password && password.length >= 6 && (
                                    <p style={{ fontSize:14,color:'#22c55e',marginTop:6,fontWeight:700 }}>✓ Passwords match</p>
                                )}
                            </div>
                            <button type="submit" disabled={loading} style={btnStyle(loading)}>
                                {loading ? <><Spinner/> Resetting…</> : '🔐 Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Done */}
                    {step === 'done' && (
                        <div style={{ textAlign:'center',padding:'16px 0',display:'flex',flexDirection:'column',gap:20 }}>
                            <div style={{ fontSize:64 }}>🎉</div>
                            <div>
                                <h3 style={{ fontSize:22,fontWeight:800,color:'#1a1a1a',marginBottom:8 }}>Password Reset!</h3>
                                <p style={{ fontSize:15,color:'#6b7280' }}>Your password has been updated. You can now sign in.</p>
                            </div>
                            <Link to="/" onClick={openLogin} style={{
                                display:'flex',alignItems:'center',justifyContent:'center',
                                height:56,borderRadius:16,textDecoration:'none',
                                background:'linear-gradient(135deg,#B5006B,#FC2779)',
                                color:'white',fontSize:18,fontWeight:800,
                                boxShadow:'0 8px 28px rgba(181,0,107,0.38)',
                            }}>
                                Sign In →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}