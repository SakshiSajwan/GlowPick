const nodemailer = require('nodemailer');

/* ─────────────────────────────────────────────────────────────────
   GlowPick Email Service
   Uses Gmail SMTP. Requires an App Password (not your normal password).

   HOW TO GET AN APP PASSWORD:
   1. Go to myaccount.google.com → Security
   2. Enable 2-Step Verification (required)
   3. Go to Security → App passwords
   4. Select app: Mail, device: Other → name it "GlowPick"
   5. Copy the 16-char password → paste into GMAIL_APP_PASSWORD in .env
   ─────────────────────────────────────────────────────────────────*/

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,         // glowpick04@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char App Password from Google
  },
});

/**
 * Send an email
 * @param {string} to      - recipient email
 * @param {string} subject - email subject
 * @param {string} html    - HTML body
 */
const sendEmail = async (to, subject, html) => {
  console.log(`📧 Attempting to send email to: ${to}`);
  const mailOptions = {
    from: `"GlowPick 💄" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️  Email sent to ${to} — MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw err;
  }
};

module.exports = { sendEmail };