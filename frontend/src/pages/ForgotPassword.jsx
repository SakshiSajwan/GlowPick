import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaHeart, FaRegHeart, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://127.0.0.1:5000/api/auth/forgot-password', { email });
            toast.success(data.message || 'Reset link sent! Check your email.');
            setSent(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
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
                {/* Header */}
                <div className="p-10 pb-6">
                    <div className="relative inline-block mb-4">
                        <FaRegHeart className="text-6xl text-[#F06292] opacity-30" />
                        <FaHeart className="text-4xl text-[#F06292] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#F06292] mb-2">Forgot Password?</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Form Panel */}
                <div className="bg-[#F06292] p-8 pb-10">
                    {sent ? (
                        <div className="text-center py-6">
                            <div className="text-5xl mb-4">📧</div>
                            <p className="text-white font-semibold text-lg mb-2">Check your inbox!</p>
                            <p className="text-pink-100 text-sm">
                                We sent a password reset link to <strong>{email}</strong>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-white text-sm font-medium" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <FaEnvelope />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your registered email"
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCE4EC]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#FCE4EC] to-[#F48FB1] text-[#E91E63] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 disabled:opacity-60"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 text-center">
                    <Link to="/login" className="flex items-center justify-center gap-2 text-[#F06292] font-medium hover:underline text-sm">
                        <FaArrowLeft /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
