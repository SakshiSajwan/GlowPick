/* Shared wrapper */
const wrap = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GlowPick</title>
</head>
<body style="margin:0;padding:0;background:#FFF0F7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF0F7;padding:40px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(252,39,121,.12);">

        <!-- Pink header -->
        <tr>
          <td style="background:linear-gradient(135deg,#B5006B,#FC2779);padding:36px 40px 28px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.75);">✨ AI-Powered Beauty</p>
            <h1 style="margin:0;font-size:34px;font-weight:900;color:#fff;letter-spacing:-.02em;line-height:1;">
              GLOW<span style="font-style:italic;opacity:.85;">PICK</span>
            </h1>
          </td>
        </tr>

        <!-- Body -->
        ${content}

        <!-- Footer -->
        <tr>
          <td style="background:#FFF0F7;padding:28px 40px;text-align:center;border-top:1px solid #FCE7F3;">
            <p style="margin:0 0 6px;font-size:13px;color:#FC2779;font-weight:700;">🌸 GlowPick Beauty Technologies Pvt. Ltd.</p>
            <p style="margin:0 0 4px;font-size:12px;color:#9CA3AF;">New Delhi, 110096, India</p>
            <p style="margin:0;font-size:12px;color:#C4B5C0;">
              <a href="#" style="color:#FC2779;text-decoration:none;">Privacy Policy</a> &nbsp;·&nbsp;
              <a href="#" style="color:#FC2779;text-decoration:none;">Unsubscribe</a>
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:#D1D5DB;">© 2026 GlowPick. All rights reserved. Made with 💕</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

/*1. NEWSLETTER SUBSCRIPTION WELCOME EMAIL*/
const newsletterWelcomeTemplate = (email) => wrap(`
  <tr>
    <td style="padding:44px 40px 36px;text-align:center;">

      <!-- Flower graphic -->
      <p style="margin:0 0 16px;font-size:64px;line-height:1;">🌸🌷🌺</p>

      <h2 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#1C1C1E;letter-spacing:-.02em;">
        You're in the glow club! 💖
      </h2>
      <p style="margin:0 0 28px;font-size:16px;color:#6B7280;line-height:1.7;max-width:400px;margin-left:auto;margin-right:auto;">
        Hey gorgeous! 🌸<br/>
        You've successfully subscribed to <strong style="color:#FC2779;">GlowPick</strong> with
        <strong style="color:#1C1C1E;">${email}</strong>.<br/><br/>
        Get ready for exclusive beauty drops, personalised skincare tips, and members-only deals delivered straight to your inbox.
      </p>

      <!-- What to expect box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF0F7;border-radius:16px;border:1.5px solid #FCE7F3;margin-bottom:28px;">
        <tr>
          <td style="padding:24px 28px;">
            <p style="margin:0 0 16px;font-size:13px;font-weight:800;color:#FC2779;text-transform:uppercase;letter-spacing:.12em;">What's coming your way 🌷</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ['💄', 'New arrivals & product launches every week'],
                ['✨', 'AI-powered skincare tips just for your skin type'],
                ['🎁', 'Members-only discount codes & flash sales'],
                ['🌿', 'Clean beauty guides & ingredient deep-dives'],
              ].map(([icon, text]) => `
              <tr>
                <td style="padding:6px 0;width:32px;vertical-align:top;">
                  <span style="font-size:18px;">${icon}</span>
                </td>
                <td style="padding:6px 0 6px 8px;font-size:14px;color:#4B5563;line-height:1.5;">${text}</td>
              </tr>`).join('')}
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA button -->
      <a href="http://localhost:5173" style="display:inline-block;background:linear-gradient(135deg,#B5006B,#FC2779);color:#fff;text-decoration:none;font-size:15px;font-weight:800;padding:14px 40px;border-radius:99px;letter-spacing:.04em;box-shadow:0 6px 20px rgba(252,39,121,.35);">
        🌸 Shop Now
      </a>

      <p style="margin:24px 0 0;font-size:13px;color:#9CA3AF;">
        Use code <strong style="color:#FC2779;font-size:15px;">GLOW10</strong> for 10% off your first order! 🎉
      </p>
    </td>
  </tr>
`);

/*2. FORGOT PASSWORD OTP EMAIL*/
const forgotPasswordOtpTemplate = (name, otp) => wrap(`
  <tr>
    <td style="padding:44px 40px 36px;text-align:center;">

      <p style="margin:0 0 16px;font-size:64px;line-height:1;">🔐🌸</p>

      <h2 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#1C1C1E;letter-spacing:-.02em;">
        Password Reset Request
      </h2>
      <p style="margin:0 0 28px;font-size:16px;color:#6B7280;line-height:1.7;">
        Hi <strong style="color:#FC2779;">${name || 'Gorgeous'}</strong>! 🌷<br/>
        We received a request to reset your GlowPick password.<br/>
        Use the OTP below — it expires in <strong style="color:#1C1C1E;">10 minutes</strong>.
      </p>

      <!-- OTP box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td align="center">
            <div style="display:inline-block;background:linear-gradient(135deg,#FFF0F7,#FFE0EF);border:2px solid #FC2779;border-radius:20px;padding:28px 48px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#FC2779;letter-spacing:.16em;text-transform:uppercase;">Your OTP Code</p>
              <p style="margin:0;font-size:48px;font-weight:900;color:#1C1C1E;letter-spacing:.18em;font-family:'Courier New',monospace;">${otp}</p>
              <p style="margin:10px 0 0;font-size:12px;color:#9CA3AF;">Valid for 10 minutes only</p>
            </div>
          </td>
        </tr>
      </table>

      <!-- Steps -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF0F7;border-radius:16px;border:1.5px solid #FCE7F3;margin-bottom:28px;text-align:left;">
        <tr>
          <td style="padding:22px 28px;">
            <p style="margin:0 0 14px;font-size:13px;font-weight:800;color:#FC2779;text-transform:uppercase;letter-spacing:.1em;">How to reset 🌸</p>
            ${[
              'Go back to the GlowPick app',
              'Enter the 6-digit OTP shown above',
              'Set your new password',
              'Sign in and glow on! 💄',
            ].map((step, i) => `
            <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;width:100%;">
              <tr>
                <td style="width:32px;vertical-align:top;padding-top:1px;">
                  <div style="width:28px;height:28px;background:linear-gradient(135deg,#FC2779,#F43F5E);border-radius:50%;color:white;font-size:13px;font-weight:900;text-align:center;line-height:28px;flex-shrink:0;">${i + 1}</div>
                </td>
                <td style="padding-left:12px;vertical-align:middle;">
                  <span style="font-size:14px;color:#4B5563;line-height:1.6;">${step}</span>
                </td>
              </tr>
            </table>`).join('')}
          </td>
        </tr>
      </table>

      <p style="margin:0 0 6px;font-size:13px;color:#9CA3AF;line-height:1.6;">
        🔒 Didn't request this? Your account is safe — just ignore this email.<br/>
        This OTP was sent to protect your GlowPick account.
      </p>
    </td>
  </tr>
`);

/*3. ORDER CONFIRMATION EMAIL*/
const orderConfirmationTemplate = (name, order) => {
  const orderId = order._id?.toString().slice(-8).toUpperCase() || 'XXXXXXXX';

  // Delivery window: 4–7 days from now
  const today = new Date();
  const from = new Date(today); from.setDate(today.getDate() + 4);
  const to   = new Date(today); to.setDate(today.getDate() + 7);
  const fmt  = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' });
  const deliveryWindow = `${fmt(from)} – ${fmt(to)}`;

  const itemRows = (order.orderItems || []).map(item => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #FCE7F3;vertical-align:middle;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:60px;vertical-align:middle;">
              ${item.image
                ? `<img src="${item.image}" width="52" height="52" style="border-radius:12px;object-fit:cover;border:1.5px solid #FCE7F3;display:block;" />`
                : `<div style="width:52px;height:52px;background:#FFF0F7;border-radius:12px;text-align:center;line-height:52px;font-size:24px;">✨</div>`
              }
            </td>
            <td style="padding-left:14px;vertical-align:middle;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1C1C1E;">${item.name}</p>
              <p style="margin:0;font-size:13px;color:#9CA3AF;">Qty: ${item.qty}</p>
            </td>
            <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
              <p style="margin:0;font-size:16px;font-weight:800;color:#1C1C1E;">
                ₹${((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
              </p>
              ${item.qty > 1
                ? `<p style="margin:3px 0 0;font-size:12px;color:#9CA3AF;">₹${(item.price||0).toLocaleString('en-IN')} each</p>`
                : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return wrap(`
  <tr>
    <td style="padding:44px 40px 36px;">

      <!-- Greeting -->
      <div style="text-align:center;margin-bottom:32px;">
        <p style="margin:0 0 12px;font-size:56px;line-height:1;">🌸🎉✨</p>
        <h2 style="margin:0 0 10px;font-size:28px;font-weight:900;color:#1C1C1E;letter-spacing:-.02em;">
          Yay! Order Confirmed!
        </h2>
        <p style="margin:0;font-size:16px;color:#6B7280;line-height:1.7;">
          Hey <strong style="color:#FC2779;">${name || 'Gorgeous'}</strong>! 💖<br/>
          Your GlowPick order is confirmed and being lovingly packed.<br/>
          Get ready to glow! 🌺
        </p>
      </div>

      <!-- Order ID + Payment row -->
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:linear-gradient(135deg,#FFF0F7,#FFE0EF);border:1.5px solid #FC2779;border-radius:16px;margin-bottom:20px;">
        <tr>
          <td style="padding:18px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 3px;font-size:11px;font-weight:800;color:#FC2779;text-transform:uppercase;letter-spacing:.12em;">Order ID</p>
                  <p style="margin:0;font-size:19px;font-weight:900;color:#1C1C1E;letter-spacing:.06em;">#${orderId}</p>
                </td>
                <td style="text-align:right;">
                  <p style="margin:0 0 3px;font-size:11px;font-weight:800;color:#FC2779;text-transform:uppercase;letter-spacing:.12em;">Payment</p>
                  <p style="margin:0;font-size:15px;font-weight:700;color:#16A34A;">✅ ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid'}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Delivery window -->
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:16px;margin-bottom:20px;">
        <tr>
          <td style="padding:18px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;width:44px;">
                  <div style="width:40px;height:40px;background:#16A34A;border-radius:50%;text-align:center;line-height:40px;font-size:20px;">🚚</div>
                </td>
                <td style="padding-left:14px;vertical-align:middle;">
                  <p style="margin:0 0 3px;font-size:12px;font-weight:800;color:#16A34A;text-transform:uppercase;letter-spacing:.1em;">Expected Delivery</p>
                  <p style="margin:0;font-size:18px;font-weight:900;color:#1C1C1E;">${deliveryWindow}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#6B7280;">Between 9:00 AM – 8:00 PM at your address</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Shipping address -->
      ${order.shippingAddress ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="background:#FFF5FA;border:1.5px solid #FCE7F3;border-radius:14px;padding:16px 22px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#FC2779;text-transform:uppercase;letter-spacing:.1em;">📍 Delivering To</p>
            <p style="margin:0;font-size:14px;color:#4B5563;line-height:1.8;">
              ${order.shippingAddress.address || order.shippingAddress.street || ''}<br/>
              ${order.shippingAddress.city || ''}${order.shippingAddress.postalCode ? ', ' + order.shippingAddress.postalCode : ''}<br/>
              ${order.shippingAddress.country || 'India'}
            </p>
          </td>
        </tr>
      </table>` : ''}

      <!-- Items -->
      <p style="margin:0 0 12px;font-size:16px;font-weight:900;color:#1C1C1E;">🛍️ Your Items (${(order.orderItems||[]).length})</p>
      <table width="100%" cellpadding="0" cellspacing="0"
        style="border:1.5px solid #FCE7F3;border-radius:16px;overflow:hidden;margin-bottom:20px;">
        <tr><td style="padding:4px 20px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
          </table>
        </td></tr>
      </table>

      <!-- Price summary -->
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#FFF0F7;border:1.5px solid #FCE7F3;border-radius:16px;margin-bottom:28px;">
        <tr><td style="padding:20px 24px;">

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
            <tr>
              <td style="font-size:14px;color:#6B7280;">Items total</td>
              <td style="font-size:14px;color:#1C1C1E;text-align:right;font-weight:600;">₹${(order.itemsPrice||0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
            <tr>
              <td style="font-size:14px;color:#6B7280;">Delivery</td>
              <td style="font-size:14px;color:#1C1C1E;text-align:right;font-weight:600;">${(order.shippingPrice||0) === 0 ? '<span style="color:#16A34A;font-weight:700;">FREE 🎁</span>' : '₹' + order.shippingPrice}</td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
            <tr>
              <td style="font-size:14px;color:#6B7280;">GST (5%)</td>
              <td style="font-size:14px;color:#1C1C1E;text-align:right;font-weight:600;">₹${(order.taxPrice||0).toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <div style="border-top:1.5px solid #FCE7F3;margin:14px 0;"></div>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:18px;font-weight:900;color:#1C1C1E;">Total ${order.paymentMethod === 'COD' ? '(Pay on delivery)' : 'Paid'}</td>
              <td style="font-size:22px;font-weight:900;color:#FC2779;text-align:right;">₹${(order.totalPrice||0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </td></tr>
      </table>

      <!-- Track order CTA -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="http://localhost:5173/orders"
          style="display:inline-block;background:linear-gradient(135deg,#B5006B,#FC2779);color:#fff;
          text-decoration:none;font-size:15px;font-weight:800;padding:16px 44px;
          border-radius:99px;letter-spacing:.04em;
          box-shadow:0 6px 20px rgba(252,39,121,.35);">
          🌸 Track My Order
        </a>
      </div>

      <!-- What happens next -->
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#FFF5FA;border:1.5px solid #FCE7F3;border-radius:16px;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 14px;font-size:13px;font-weight:800;color:#FC2779;text-transform:uppercase;letter-spacing:.1em;">What happens next? 🌷</p>
          ${[
            ['📦', 'Your order is being packed with care'],
            ['🚚', 'It will be picked up by our delivery partner'],
            ['📍', 'You\'ll receive tracking updates via SMS'],
            ['✨', 'Unbox and glow — you deserve it!'],
          ].map(([icon, text]) => `
          <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;width:100%;">
            <tr>
              <td style="width:32px;vertical-align:middle;font-size:18px;">${icon}</td>
              <td style="padding-left:10px;font-size:14px;color:#4B5563;line-height:1.5;">${text}</td>
            </tr>
          </table>`).join('')}
        </td></tr>
      </table>

      <p style="text-align:center;font-size:13px;color:#9CA3AF;line-height:1.7;margin:0;">
        Questions? Email us at
        <a href="mailto:glowpick04@gmail.com" style="color:#FC2779;font-weight:700;text-decoration:none;">glowpick04@gmail.com</a><br/>
        We reply within 2 hours! 💬
      </p>

    </td>
  </tr>
  `);
};

module.exports = {
  newsletterWelcomeTemplate,
  forgotPasswordOtpTemplate,
  orderConfirmationTemplate,
};