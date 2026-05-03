const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Create nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
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

        // Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save({ validateBeforeSave: false });

        // Build reset URL
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        // Email content
        const mailOptions = {
            from: `"GlowPick Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: '🌸 GlowPick Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #FFF0F5; border-radius: 10px;">
                    <h2 style="color: #E91E63; text-align: center;">GlowPick Password Reset</h2>
                    <p style="color: #555;">Hi ${user.name},</p>
                    <p style="color: #555;">You requested a password reset. Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background: linear-gradient(to right, #F48FB1, #E91E63); color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">
                            Reset My Password
                        </a>
                    </div>
                    <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                    <hr style="border: none; border-top: 1px solid #F48FB1; margin: 20px 0;" />
                    <p style="color: #E91E63; text-align: center; font-size: 12px;">💄 GlowPick – Your Beauty, Our Passion</p>
                </div>
            `,
        };

        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        try {
            const user = await User.findOne({ email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save({ validateBeforeSave: false });
            }
        } catch (e) { }
        res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }
};

const resetPassword = async (req, res) => {
    const { password } = req.body;
    const rawToken = req.params.token;

    // Hash the incoming token to compare with DB
    const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful! You can now log in.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

module.exports = { authUser, registerUser, forgotPassword, resetPassword };
