import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { state, dispatch } = useGlobalContext();
    const { userInfo } = state;
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirect = new URLSearchParams(search).get('redirect') || '/';

    useEffect(() => { if (userInfo) navigate(redirect); }, [userInfo, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) { toast.error('Please fill in all fields'); return; }
        if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

        setLoading(true);
        try {
            const { data } = await axios.post('http://127.0.0.1:5000/api/auth/register', { name, email, password });
            dispatch({ type: 'USER_LOGIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Welcome to GlowPick! 🎉');
            navigate(redirect);
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            if (err.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please make sure the backend is running on port 5000.');
            } else {
                toast.error(msg || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 px-8 py-8 text-center">
                        <Link to="/">
                            <h1 className="text-3xl font-black text-white tracking-tighter">
                                GLOW<span className="text-pink-200">PICK</span>
                            </h1>
                        </Link>
                        <p className="text-pink-100 text-sm mt-2">Create your account to get started</p>
                    </div>

                    <form onSubmit={submitHandler} className="px-8 py-8 space-y-5">
                        {[
                            { label: 'Full Name', type: 'text', val: name, set: setName, placeholder: 'Your full name' },
                            { label: 'Email Address', type: 'email', val: email, set: setEmail, placeholder: 'you@example.com' },
                            { label: 'Password', type: 'password', val: password, set: setPassword, placeholder: 'Min. 6 characters' },
                            { label: 'Confirm Password', type: 'password', val: confirmPassword, set: setConfirmPassword, placeholder: 'Re-enter password' },
                        ].map(({ label, type, val, set, placeholder }) => (
                            <div key={label}>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all bg-gray-50 focus:bg-white"
                                    value={val}
                                    onChange={(e) => set(e.target.value)}
                                    required
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3.5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-wide mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'} className="text-pink-600 font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                    By creating an account, you agree to GlowPick's Terms of Service.
                </p>
            </div>
        </div>
    );
};

export default Register;