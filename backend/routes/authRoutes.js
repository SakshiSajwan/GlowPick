const express = require('express');
const router  = express.Router();

const { authUser, registerUser }            = require('../controllers/authController');
const { forgotPassword, verifyOtp, resetPasswordOtp } = require('../controllers/authOtpController');

router.post('/login',                authUser);
router.post('/register',             registerUser);
router.post('/forgot-password',      forgotPassword);
router.post('/verify-otp',           verifyOtp);
router.post('/reset-password-otp',   resetPasswordOtp);

module.exports = router;