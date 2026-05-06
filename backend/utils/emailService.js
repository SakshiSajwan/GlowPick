const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,         
    pass: process.env.GMAIL_APP_PASSWORD, 
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