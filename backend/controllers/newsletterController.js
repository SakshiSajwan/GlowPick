const { sendEmail } = require('../utils/emailService');
const { newsletterWelcomeTemplate } = require('../utils/emailTemplates');

/**
 * POST /api/newsletter/subscribe
 * Body: { email }
 */
const subscribe = async (req, res) => {
  console.log('📬 Subscribe endpoint hit, email:', req.body.email);
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    await sendEmail(
      email,
      '🌸 Welcome to GlowPick — You\'re In the Glow Club!',
      newsletterWelcomeTemplate(email)
    );

    res.status(200).json({
      success: true,
      message: 'Subscribed successfully! Check your inbox for a welcome email 💖',
    });
  } catch (err) {
    console.error('Newsletter subscribe error:', err.message);
    res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
};

module.exports = { subscribe };