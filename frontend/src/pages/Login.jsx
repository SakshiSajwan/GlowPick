import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaHeart, FaRegHeart } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useGlobalContext();
    const { userInfo } = state;

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            dispatch({ type: 'USER_LOGIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login successful! Welcome back.');
            navigate(redirect);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
            toast.error(errorMessage);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#FCE4EC] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F06292] rounded-bl-full transform rotate-12 -translate-y-16 translate-x-16 opacity-40"></div>
            <div className="absolute top-0 right-20 w-48 h-48 bg-[#F06292] rounded-bl-full transform rotate-12 -translate-y-20 translate-x-20 opacity-20"></div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 mx-4">
                <div className="p-10 pb-6 text-center">
                    <div className="relative inline-block mb-4">
                        <FaRegHeart className="text-6xl text-[#F06292] opacity-30" />
                        <FaHeart className="text-4xl text-[#F06292] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h1 className="text-4xl font-bold text-[#F06292] mb-2 text-left">Welcome Back!</h1>
                    <p className="text-gray-400 text-left text-sm leading-relaxed max-w-[200px]">
                        GlowPick - Your Beauty, Our Passion.
                    </p>
                </div>

                <div className="bg-[#F06292] p-8 pb-12 mx-0">
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium" htmlFor="email">
                                Email Or User Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaEnvelope />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your Email here"
                                    className="w-full pl-10 pr-10 py-3 rounded-md bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F48FB1]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F06292]">
                                    <FaCheckCircle />
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaLock />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-10 py-3 rounded-md bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F48FB1]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-white text-xs">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="mr-2 rounded border-none focus:ring-0" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" title="Forgot Password?" className="hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 bg-gradient-to-r from-[#FCE4EC] to-[#F06292] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 border border-[#ffffff33] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>

                <div className="p-8 text-center text-sm">
                    <p className="text-gray-400 mb-4 uppercase tracking-widest text-[10px] font-bold">OR LOGIN WITH</p>
                    <div className="flex justify-center space-x-6 mb-6">
                        <div className="w-10 h-10 rounded-full border-2 border-[#F06292] flex items-center justify-center text-[#F06292] cursor-pointer hover:bg-[#F06292] hover:text-white transition-colors">
                            <span className="font-bold">G</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#F06292] cursor-pointer hover:bg-[#F06292] hover:text-white transition-colors">
                            <span className="font-bold">f</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-[#F06292] flex items-center justify-center text-[#F06292] cursor-pointer hover:bg-[#F06292] hover:text-white transition-colors">
                            <span className="font-bold">in</span>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-[#F06292] font-bold hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;