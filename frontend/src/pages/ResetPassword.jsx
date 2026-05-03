import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash, FaHeart, FaRegHeart, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`http://127.0.0.1:5000/api/auth/reset-password/${token}`, { password });
            toast.success(data.message || 'Password reset successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired token.');
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
                    <h1 className="text-3xl font-bold text-[#F06292] mb-2">Reset Password</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Create a new strong password for your GlowPick account.
                    </p>
                </div>

                {/* Form Panel */}
                <div className="bg-[#F06292] p-8 pb-10">
                    <form onSubmit={submitHandler} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium" htmlFor="password">
                                New Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaLock />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    className="w-full pl-10 pr-10 py-3 rounded-md bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCE4EC]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaLock />
                                </span>
                                <input
                                    id="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    className="w-full pl-10 pr-10 py-3 rounded-md bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCE4EC]"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-[#FCE4EC] to-[#F48FB1] text-[#E91E63] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 disabled:opacity-60"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
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

export default ResetPassword;
