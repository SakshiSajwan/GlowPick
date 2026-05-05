import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../context/Context';
import api from '../services/api';

// Icons
const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

// Password strength
function PasswordStrength({ password }) {
    if (!password) return null;
    const checks = [password.length >= 6, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
    const strength = checks.filter(Boolean).length;
    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return (
        <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= strength ? colors[strength] : '#e5e7eb', transition: 'background 0.3s' }} />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[{label:'6+ chars',ok:checks[0]},{label:'Uppercase',ok:checks[1]},{label:'Number',ok:checks[2]},{label:'Symbol',ok:checks[3]}].map(({label,ok}) => (
                        <span key={label} style={{ fontSize: 10, fontWeight: 600, color: ok ? '#22c55e' : '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 16, height: 16, borderRadius: '50%', background: ok ? '#22c55e' : '#e5e7eb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', flexShrink: 0 }}>{ok ? '✓' : ''}</span>
                            {label}
                        </span>
                    ))}
                </div>
                {strength > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: colors[strength] }}>{labels[strength]}</span>}
            </div>
        </div>
    );
}

// Spinner
function Spinner() {
    return <span style={{ display: 'inline-block', width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'gpSpin 0.7s linear infinite' }} />;
}

// InputField
function InputField({ label, type='text', value, onChange, placeholder, autoComplete, rightSlot, error }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            {label && <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#444', marginBottom: 8 }}>{label}</label>}
            <div style={{ position: 'relative' }}>
                <input
                    type={type} value={value} onChange={onChange}
                    placeholder={placeholder} autoComplete={autoComplete}
                    style={{
                        width: '100%', height: 52, boxSizing: 'border-box',
                        border: `2px solid ${error ? '#ef4444' : focused ? '#FC2779' : '#e5e7eb'}`,
                        borderRadius: 14, padding: rightSlot ? '0 52px 0 16px' : '0 16px',
                        fontSize: 13, fontFamily: 'inherit',
                        background: focused ? '#fff' : '#fafafa', color: '#1a1a1a',
                        outline: 'none', transition: 'all 0.2s',
                        boxShadow: focused ? '0 0 0 4px rgba(252,39,121,0.1)' : 'none',
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {rightSlot && <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>{rightSlot}</div>}
            </div>
            {error && <p style={{ fontSize: 10, color: '#ef4444', marginTop: 5, fontWeight: 600 }}>{error}</p>}
        </div>
    );
}

// OTP Input
function OtpInput({ value, onChange }) {
    const inputs = useRef([]);
    const digits = value.split('');

    const handleKey = (e, i) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            inputs.current[i - 1]?.focus();
        }
    };

    const handleChange = (e, i) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const arr = [...digits];
        arr[i] = val;
        onChange(arr.join(''));
        if (val && i < 5) inputs.current[i + 1]?.focus();
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
                    ref={el => inputs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] || ''}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKey(e, i)}
                    onPaste={handlePaste}
                    style={{
                        width: 52, height: 58, textAlign: 'center',
                        fontSize: 13, fontWeight: 800,
                        border: `2px solid ${digits[i] ? '#FC2779' : '#e5e7eb'}`,
                        borderRadius: 14, outline: 'none',
                        background: digits[i] ? '#FFF0F7' : '#fafafa',
                        color: '#1a1a1a', fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        boxShadow: digits[i] ? '0 0 0 3px rgba(252,39,121,0.15)' : 'none',
                    }}
                />
            ))}
        </div>
    );
}

// Forgot Password Flow
function ForgotPasswordFlow({ onBack }) {
    // step: 'email' | 'otp' | 'reset' | 'done'
    const [step,        setStep]        = useState('email');
    const [email,       setEmail]       = useState('');
    const [otp,         setOtp]         = useState('');
    const [password,    setPassword]    = useState('');
    const [confirm,     setConfirm]     = useState('');
    const [showPwd,     setShowPwd]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [errors,      setErrors]      = useState({});
    const [resetToken,  setResetToken]  = useState('');
    const [countdown,   setCountdown]   = useState(0);
    const timerRef = useRef(null);

    const startCountdown = () => {
        setCountdown(60);
        timerRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) { clearInterval(timerRef.current); return 0; }
                return c - 1;
            });
        }, 1000);
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    // Step 1 — send OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) { setErrors({ email: 'Email is required' }); return; }
        setErrors({});
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('OTP sent to your email 📧');
            setStep('otp');
            startCountdown();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Could not send OTP. Check your email.');
        } finally { setLoading(false); }
    };

    // Step 2 — verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length < 6) { setErrors({ otp: 'Please enter the full 6-digit OTP' }); return; }
        setErrors({});
        setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            setResetToken(data.resetToken);  // ← ADD THIS
            toast.success('OTP verified ✅');
            setStep('reset');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Invalid or expired OTP.');
        } finally { setLoading(false); }
    };

    // Resend OTP
    const handleResend = async () => {
        if (countdown > 0) return;
        setOtp('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('New OTP sent 📧');
            startCountdown();
        } catch (err) {
            toast.error('Could not resend OTP.');
        } finally { setLoading(false); }
    };

    // Step 3 — reset password
    const handleReset = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!password)           errs.password = 'Password is required';
        if (password.length < 6) errs.password = 'Minimum 6 characters';
        if (password !== confirm) errs.confirm  = "Passwords don't match";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        try {
            await api.post('/auth/reset-password-otp', { email, otp, resetToken, password });
            toast.success('Password reset successfully! 🎉');
            setStep('done');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Reset failed. Please try again.');
        } finally { setLoading(false); }
    };

    const eyeBtn = (show, toggle) => (
        <button type="button" onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 0 }}>
            {show ? <EyeClosed /> : <EyeOpen />}
        </button>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Progress dots */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                {['email','otp','reset'].map((s, i) => {
                    const steps = ['email','otp','reset'];
                    const current = steps.indexOf(step);
                    const done = current > i;
                    const active = current === i;
                    return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: active ? 32 : 12, height: 12, borderRadius: 99,
                                background: done ? '#22c55e' : active ? '#FC2779' : '#e5e7eb',
                                transition: 'all 0.3s',
                            }} />
                        </div>
                    );
                })}
            </div>

            {/* Step 1: Email */}
            {step === 'email' && (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ textAlign: 'center', marginBottom: 4 }}>
                        <div style={{ fontSize: 30, marginBottom: 8 }}>🔐</div>
                        <p style={{ fontSize: 10, color: '#6b7280' }}>
                            Enter your registered email and we'll send you a 6-digit OTP.
                        </p>
                    </div>

                    <InputField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setErrors({}); }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        error={errors.email}
                    />

                    <button type="submit" disabled={loading} style={{
                        width: '100%', height: 56, borderRadius: 16,
                        background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #B5006B, #FC2779)',
                        color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        boxShadow: loading ? 'none' : '0 8px 28px rgba(181,0,107,0.38)',
                        transition: 'opacity 0.2s, transform 0.2s',
                    }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-2px)'; }}}
                        onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }}
                    >
                        {loading ? <><Spinner /> Sending OTP…</> : 'Send OTP →'}
                    </button>

                    <button type="button" onClick={onBack} style={{
                        background: 'none', border: 'none', color: '#FC2779',
                        fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                        ← Back to Sign In
                    </button>
                </form>
            )}

            {/* Step 2: OTP */}
            {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ textAlign: 'center', marginBottom: 4 }}>
                        <div style={{ fontSize: 30, marginBottom: 8 }}>📧</div>
                        <p style={{ fontSize: 10, color: '#6b7280' }}>
                            We sent a 6-digit OTP to <strong style={{ color: '#FC2779' }}>{email}</strong>.<br />
                            Enter it below within 10 minutes.
                        </p>
                    </div>

                    <OtpInput value={otp} onChange={setOtp} />
                    {errors.otp && <p style={{ textAlign: 'center', fontSize: 10, color: '#ef4444', fontWeight: 600, marginTop: -8 }}>{errors.otp}</p>}

                    {/* Resend */}
                    <div style={{ textAlign: 'center' }}>
                        {countdown > 0 ? (
                            <span style={{ fontSize: 10, color: '#9ca3af' }}>
                                Resend OTP in <strong style={{ color: '#FC2779' }}>{countdown}s</strong>
                            </span>
                        ) : (
                            <button type="button" onClick={handleResend} disabled={loading} style={{
                                background: 'none', border: 'none', color: '#FC2779',
                                fontSize: 10, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline',
                            }}>
                                Resend OTP
                            </button>
                        )}
                    </div>

                    <button type="submit" disabled={loading || otp.length < 6} style={{
                        width: '100%', height: 56, borderRadius: 16,
                        background: otp.length === 6 && !loading ? 'linear-gradient(135deg, #B5006B, #FC2779)' : '#f9a8d4',
                        color: 'white', border: 'none',
                        cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                        fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        boxShadow: otp.length === 6 ? '0 8px 28px rgba(181,0,107,0.38)' : 'none',
                        transition: 'all 0.2s',
                    }}>
                        {loading ? <><Spinner /> Verifying…</> : 'Verify OTP →'}
                    </button>

                    <button type="button" onClick={() => { setStep('email'); setOtp(''); }} style={{
                        background: 'none', border: 'none', color: '#9ca3af',
                        fontSize: 10, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                        ← Change email
                    </button>
                </form>
            )}

            {/* Step 3: New password */}
            {step === 'reset' && (
                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ textAlign: 'center', marginBottom: 4 }}>
                        <div style={{ fontSize: 30, marginBottom: 8 }}>🔑</div>
                        <p style={{ fontSize: 10, color: '#6b7280' }}>
                            Create a new strong password for your account.
                        </p>
                    </div>

                    <div>
                        <InputField
                            label="New Password"
                            type={showPwd ? 'text' : 'password'}
                            value={password}
                            onChange={e => { setPassword(e.target.value); setErrors({}); }}
                            placeholder="Min. 6 characters"
                            autoComplete="new-password"
                            error={errors.password}
                            rightSlot={eyeBtn(showPwd, () => setShowPwd(v => !v))}
                        />
                        <PasswordStrength password={password} />
                    </div>

                    <div>
                        <InputField
                            label="Confirm Password"
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={e => { setConfirm(e.target.value); setErrors({}); }}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            error={errors.confirm}
                            rightSlot={eyeBtn(showConfirm, () => setShowConfirm(v => !v))}
                        />
                        {confirm && !errors.confirm && confirm === password && password.length >= 6 && (
                            <p style={{ fontSize: 10, color: '#22c55e', marginTop: 6, fontWeight: 700 }}>✓ Passwords match</p>
                        )}
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: '100%', height: 56, borderRadius: 16, marginTop: 4,
                        background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #B5006B, #FC2779)',
                        color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        boxShadow: loading ? 'none' : '0 8px 28px rgba(181,0,107,0.38)',
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-2px)'; }}}
                        onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }}
                    >
                        {loading ? <><Spinner /> Resetting…</> : '🔐 Reset Password'}
                    </button>
                </form>
            )}

            {/* Step 4: Done */}
            {step === 'done' && (
                <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontSize: 44 }}>🎉</div>
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>
                            Password Reset!
                        </h3>
                        <p style={{ fontSize: 10, color: '#6b7280' }}>
                            Your password has been updated successfully. You can now sign in with your new password.
                        </p>
                    </div>
                    <button onClick={onBack} style={{
                        width: '100%', height: 56, borderRadius: 16,
                        background: 'linear-gradient(135deg, #B5006B, #FC2779)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                        boxShadow: '0 8px 28px rgba(181,0,107,0.38)',
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }}
                    >
                        Sign In →
                    </button>
                </div>
            )}
        </div>
    );
}

// Main LoginModal
export default function LoginModal() {
    const { authModal, authTab, setAuthTab, closeAuthModal, dispatch } = useGlobalContext();
    const navigate = useNavigate();

    const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
    const [regForm, setRegForm]         = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPwd, setShowPwd]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading]         = useState(false);
    const [errors, setErrors]           = useState({});

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') closeAuthModal(); };
        if (authModal) document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [authModal, closeAuthModal]);

    useEffect(() => {
        document.body.style.overflow = authModal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [authModal]);

    useEffect(() => { setShowPwd(false); setShowConfirm(false); setErrors({}); }, [authTab]);

    if (!authModal) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!loginForm.email)    errs.email    = 'Email is required';
        if (!loginForm.password) errs.password = 'Password is required';
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', loginForm);
            dispatch({ type: 'USER_LOGIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success(`Welcome back, ${data.name?.split(' ')[0]}! 💖`);
            closeAuthModal();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Invalid email or password');
        } finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, email, password, confirm } = regForm;
        const errs = {};
        if (!name)                errs.name     = 'Full name is required';
        if (!email)               errs.email    = 'Email is required';
        if (!password)            errs.password = 'Password is required';
        if (password.length < 6)  errs.password = 'Password must be at least 6 characters';
        if (password !== confirm)  errs.confirm  = "Passwords don't match";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            dispatch({ type: 'USER_LOGIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success(`Welcome to GlowPick, ${data.name?.split(' ')[0]}! ✨`);
            closeAuthModal();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Registration failed. Try again.');
        } finally { setLoading(false); }
    };

    const eyeBtn = (show, toggle) => (
        <button type="button" onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 0 }}>
            {show ? <EyeClosed /> : <EyeOpen />}
        </button>
    );

    const isForgot = authTab === 'forgot';

    return (
        <>
            <style>{`
                @keyframes gpSpin    { to { transform: rotate(360deg); } }
                @keyframes gpModalIn { from { opacity:0; transform:translateY(30px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
                @keyframes gpBgIn    { from { opacity:0; } to { opacity:1; } }
            `}</style>

            <div onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }} style={{
                position: 'fixed', inset: 0,
                background: 'rgba(10,10,20,0.62)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px 16px',
                animation: 'gpBgIn 0.22s ease',
            }}>
                <div style={{
                    background: 'white', borderRadius: 28,
                    width: '100%', maxWidth: 540,
                    overflow: 'hidden',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                    animation: 'gpModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>

                    {/* Header  */}
                    <div style={{
                        background: 'linear-gradient(135deg, #B5006B 0%, #FC2779 55%, #FF6BAD 100%)',
                        padding: '36px 40px 28px',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', top: -50, right: -20, pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', top: -90, right: -50, pointerEvents: 'none' }} />

                        {/* Close */}
                        <button onClick={closeAuthModal} style={{
                            position: 'absolute', top: 18, right: 18,
                            width: 38, height: 38, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.22)', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 13, transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                        >✕</button>

                        {/* Brand */}
                        <div style={{ position: 'relative', marginBottom: 24 }}>
                            <div style={{ fontWeight: 900, fontSize: 28, color: 'white', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>
                                GLOW<span style={{ fontStyle: 'italic', opacity: 0.85 }}>PICK</span>
                            </div>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                                {authTab === 'login'    ? '✨ Welcome back, gorgeous!'
                               : authTab === 'register' ? '💖 Join the glow community'
                               :                         '🔐 Reset your password'}
                            </p>
                        </div>

                        {/* Tabs */}
                        {!isForgot && (
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['login', 'register'].map(tab => (
                                    <button key={tab} onClick={() => setAuthTab(tab)} style={{
                                        flex: 1, height: 46, borderRadius: 99,
                                        border: 'none', cursor: 'pointer',
                                        fontSize: 10, fontWeight: 700, fontFamily: 'inherit',
                                        transition: 'all 0.25s',
                                        background: authTab === tab ? 'white' : 'rgba(255,255,255,0.18)',
                                        color: authTab === tab ? '#FC2779' : 'rgba(255,255,255,0.92)',
                                        boxShadow: authTab === tab ? '0 6px 20px rgba(0,0,0,0.18)' : 'none',
                                    }}>
                                        {tab === 'login' ? 'Sign In' : 'Create Account'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Body  */}
                    <div style={{ padding: '32px 40px 36px' }}>

                        {/* Forgot password flow */}
                        {isForgot && (
                            <ForgotPasswordFlow onBack={() => setAuthTab('login')} />
                        )}

                        {/* Login form */}
                        {authTab === 'login' && (
                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <InputField label="Email Address" type="email" value={loginForm.email}
                                    onChange={e => { setLoginForm({...loginForm, email: e.target.value}); setErrors({}); }}
                                    placeholder="you@example.com" autoComplete="email" error={errors.email} />

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#444' }}>Password</span>
                                        {/* Forgot password now opens inside modal */}
                                        <button type="button" onClick={() => setAuthTab('forgot')} style={{
                                            fontSize: 10, color: '#FC2779', background: 'none', border: 'none',
                                            cursor: 'pointer', fontWeight: 700, padding: 0, textDecoration: 'underline',
                                        }}>Forgot password?</button>
                                    </div>
                                    <InputField label="" type={showPwd ? 'text' : 'password'} value={loginForm.password}
                                        onChange={e => { setLoginForm({...loginForm, password: e.target.value}); setErrors({}); }}
                                        placeholder="••••••••" autoComplete="current-password" error={errors.password}
                                        rightSlot={eyeBtn(showPwd, () => setShowPwd(v => !v))} />
                                </div>

                                <button type="submit" disabled={loading} style={{
                                    width: '100%', height: 56, borderRadius: 16, marginTop: 4,
                                    background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #B5006B, #FC2779)',
                                    color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: loading ? 'none' : '0 8px 28px rgba(181,0,107,0.38)',
                                    transition: 'opacity 0.2s, transform 0.2s',
                                }}
                                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-2px)'; }}}
                                    onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }}
                                >
                                    {loading ? <><Spinner /> Signing in...</> : 'Sign In →'}
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
                                    <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>New to GlowPick?</span>
                                    <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
                                </div>

                                <button type="button" onClick={() => setAuthTab('register')} style={{
                                    width: '100%', height: 52, borderRadius: 16,
                                    border: '2px solid #FC2779', background: 'white',
                                    color: '#FC2779', fontSize: 10, fontWeight: 700,
                                    fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background='#FFF0F7'; e.currentTarget.style.transform='translateY(-1px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.transform='none'; }}
                                >
                                    Create Account
                                </button>
                            </form>
                        )}

                        {/* Register form */}
                        {authTab === 'register' && (
                            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <InputField label="Full Name" value={regForm.name}
                                    onChange={e => { setRegForm({...regForm, name: e.target.value}); setErrors({}); }}
                                    placeholder="Your full name" autoComplete="name" error={errors.name} />

                                <InputField label="Email Address" type="email" value={regForm.email}
                                    onChange={e => { setRegForm({...regForm, email: e.target.value}); setErrors({}); }}
                                    placeholder="you@example.com" autoComplete="email" error={errors.email} />

                                <div>
                                    <InputField label="Password" type={showPwd ? 'text' : 'password'} value={regForm.password}
                                        onChange={e => { setRegForm({...regForm, password: e.target.value}); setErrors({}); }}
                                        placeholder="Min. 6 characters" autoComplete="new-password" error={errors.password}
                                        rightSlot={eyeBtn(showPwd, () => setShowPwd(v => !v))} />
                                    <PasswordStrength password={regForm.password} />
                                </div>

                                <div>
                                    <InputField label="Confirm Password" type={showConfirm ? 'text' : 'password'} value={regForm.confirm}
                                        onChange={e => { setRegForm({...regForm, confirm: e.target.value}); setErrors({}); }}
                                        placeholder="Repeat your password" autoComplete="new-password" error={errors.confirm}
                                        rightSlot={eyeBtn(showConfirm, () => setShowConfirm(v => !v))} />
                                    {regForm.confirm && !errors.confirm && regForm.confirm === regForm.password && regForm.password.length >= 6 && (
                                        <p style={{ fontSize: 10, color: '#22c55e', marginTop: 6, fontWeight: 700 }}>✓ Passwords match</p>
                                    )}
                                </div>

                                <button type="submit" disabled={loading} style={{
                                    width: '100%', height: 56, borderRadius: 16, marginTop: 4,
                                    background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #B5006B, #FC2779)',
                                    color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: loading ? 'none' : '0 8px 28px rgba(181,0,107,0.38)',
                                    transition: 'opacity 0.2s, transform 0.2s',
                                }}
                                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-2px)'; }}}
                                    onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }}
                                >
                                    {loading ? <><Spinner /> Creating account...</> : '✨ Create My Account'}
                                </button>

                                <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>
                                    Already have an account?{' '}
                                    <button type="button" onClick={() => setAuthTab('login')} style={{
                                        color: '#FC2779', fontWeight: 700, background: 'none',
                                        border: 'none', cursor: 'pointer', padding: 0,
                                        fontSize: 13, textDecoration: 'underline',
                                    }}>Sign in</button>
                                </p>
                            </form>
                        )}

                        {/* Trust badges */}
                        {!isForgot && (
                            <div style={{
                                display: 'flex', justifyContent: 'center', gap: 28,
                                marginTop: 24, paddingTop: 20,
                                borderTop: '1.5px solid #f3f4f6',
                            }}>
                                {['🔒 Secure', '🌸 100% Free', '✨ No spam'].map(badge => (
                                    <span key={badge} style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{badge}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
