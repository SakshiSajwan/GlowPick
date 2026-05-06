const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const { forgotPasswordOtpTemplate } = require('../utils/emailTemplates');

const otpStore = new Map();

/* Generate a 6-digit OTP */
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

/* Generate a secure reset token */
const generateToken = () => crypto.randomBytes(32).toString('hex');

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email is registered, an OTP has been sent.',
      });
    }

    const otp        = generateOtp();
    const resetToken = generateToken();
    const expiresAt  = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP (keyed by email)
    otpStore.set(email.toLowerCase(), { otp, resetToken, expiresAt });

    // Send email
    await sendEmail(
      email,
      '🔐 Your GlowPick Password Reset OTP',
      forgotPasswordOtpTemplate(user.name, otp)
    );

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Valid for 10 minutes.',
    });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ message: 'Could not send OTP. Please try again.' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

  const record = otpStore.get(email.toLowerCase());

  if (!record) {
    return res.status(400).json({ message: 'OTP not found or already used. Please request a new one.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  if (record.otp !== String(otp)) {
    return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
  }

  // OTP is valid
  res.status(200).json({
    success: true,
    message: 'OTP verified successfully.',
    resetToken: record.resetToken,
  });
};

const resetPasswordOtp = async (req, res) => {
  const { email, otp, resetToken, password } = req.body;

  if (!email || !otp || !resetToken || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const record = otpStore.get(email.toLowerCase());

  if (!record) {
    return res.status(400).json({ message: 'OTP session expired. Please start over.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  if (record.otp !== String(otp) || record.resetToken !== resetToken) {
    return res.status(400).json({ message: 'Invalid OTP or token. Please start over.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Hash new password
    user.password = password;
    await user.save();

    // Clear OTP record
    otpStore.delete(email.toLowerCase());

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now sign in.',
    });
  } catch (err) {
    console.error('resetPasswordOtp error:', err);
    res.status(500).json({ message: 'Failed to reset password. Please try again.' });
  }
};

module.exports = { forgotPassword, verifyOtp, resetPasswordOtp };