const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
const sendEmail = async (to, subject, html) => {
  console.log(`📧 Sending email to: ${to}`);

  try {
    const response = await resend.emails.send({
      from: "GlowPick <onboarding@resend.dev>", // works instantly
      to,
      subject,
      html,
    });

    console.log("✉️ Email sent:", response.id);
    return { success: true, id: response.id };

  } catch (err) {
    console.error("❌ Email send error:", err.message);
    throw err;
  }
};

module.exports = { sendEmail };