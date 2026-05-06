const { sendEmail } = require('../utils/emailService');
const { forgotPasswordOtpTemplate } = require('../utils/emailTemplates');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account with that email found.' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Use your template
        const html = forgotPasswordOtpTemplate(user.name, otp);

        // Send email via Resend
        await sendEmail(
            user.email,
            '🔐 GlowPick Password Reset OTP',
            html
        );

        res.json({ message: 'OTP sent to your email 📧' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetPasswordOtp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP expired' });
    }

    // Generate temp token
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    await user.save();

    res.json({ resetToken });
};

const resetPasswordOtp = async (req, res) => {
    const { email, otp, resetToken, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (
        user.resetPasswordOtp !== otp ||
        user.resetPasswordToken !== resetToken ||
        user.resetPasswordExpires < Date.now()
    ) {
        return res.status(400).json({ message: 'Invalid or expired request' });
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful 🎉' });
};

module.exports = {
    authUser,
    registerUser,
    forgotPassword,
    verifyOtp,
    resetPasswordOtp
};
