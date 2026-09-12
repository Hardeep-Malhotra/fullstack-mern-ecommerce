export const welcomeEmailTemplate = (userName, userEmail) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to NexusCart AI</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f6f8;
  font-family: Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 15px;">

        <!-- Main Container -->
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          "
        >

          <!-- ================= HEADER ================= -->
          <tr>
            <td
              style="
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                padding: 32px 30px;
                text-align: center;
              "
            >

              <div style="
                font-size: 30px;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: -1px;
              ">
                Nexus<span style="color: #c4b5fd;">Cart</span>
              </div>

              <div style="
                margin-top: 8px;
                font-size: 13px;
                color: #e9d5ff;
                letter-spacing: 1px;
              ">
                AI-POWERED SHOPPING
              </div>

            </td>
          </tr>


          <!-- ================= HERO ================= -->
          <tr>
            <td style="padding: 40px 35px 20px;">

              <div style="
                display: inline-block;
                background-color: #ede9fe;
                color: #5b21b6;
                padding: 7px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.5px;
              ">
                🎉 WELCOME TO NEXUSCART
              </div>

              <h1 style="
                margin: 20px 0 10px;
                color: #111827;
                font-size: 28px;
                line-height: 1.3;
              ">
                Hey ${userName},<br />
                Welcome aboard! 👋
              </h1>

              <p style="
                margin: 0;
                color: #6b7280;
                font-size: 16px;
                line-height: 1.7;
              ">
                Your NexusCart AI account is officially ready.
                We're excited to have you with us.
              </p>

            </td>
          </tr>


          <!-- ================= ACCOUNT CARD ================= -->
          <tr>
            <td style="padding: 10px 35px 25px;">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  background-color: #f9fafb;
                  border: 1px solid #e5e7eb;
                  border-radius: 12px;
                "
              >

                <tr>
                  <td style="padding: 20px;">

                    <p style="
                      margin: 0 0 8px;
                      font-size: 12px;
                      color: #9ca3af;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    ">
                      ACCOUNT EMAIL
                    </p>

                    <p style="
                      margin: 0;
                      font-size: 15px;
                      font-weight: 600;
                      color: #111827;
                    ">
                      ${userEmail}
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>


          <!-- ================= BENEFITS ================= -->
          <tr>
            <td style="padding: 5px 35px 20px;">

              <h2 style="
                margin: 0 0 20px;
                font-size: 19px;
                color: #111827;
              ">
                Your shopping experience just got smarter ✨
              </h2>


              <!-- Benefit 1 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="45" valign="top">
                    <div style="
                      width: 36px;
                      height: 36px;
                      line-height: 36px;
                      text-align: center;
                      background-color: #ede9fe;
                      border-radius: 10px;
                      font-size: 18px;
                    ">
                      🤖
                    </div>
                  </td>

                  <td style="padding-bottom: 18px;">
                    <strong style="color: #111827; font-size: 15px;">
                      AI-Powered Recommendations
                    </strong>

                    <p style="
                      margin: 4px 0 0;
                      color: #6b7280;
                      font-size: 13px;
                      line-height: 1.5;
                    ">
                      Discover products personalized around your interests.
                    </p>
                  </td>
                </tr>
              </table>


              <!-- Benefit 2 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="45" valign="top">
                    <div style="
                      width: 36px;
                      height: 36px;
                      line-height: 36px;
                      text-align: center;
                      background-color: #ede9fe;
                      border-radius: 10px;
                      font-size: 18px;
                    ">
                      🛍️
                    </div>
                  </td>

                  <td style="padding-bottom: 18px;">
                    <strong style="color: #111827; font-size: 15px;">
                      Curated Shopping
                    </strong>

                    <p style="
                      margin: 4px 0 0;
                      color: #6b7280;
                      font-size: 13px;
                      line-height: 1.5;
                    ">
                      Find products faster with a smarter shopping experience.
                    </p>
                  </td>
                </tr>
              </table>


              <!-- Benefit 3 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="45" valign="top">
                    <div style="
                      width: 36px;
                      height: 36px;
                      line-height: 36px;
                      text-align: center;
                      background-color: #ede9fe;
                      border-radius: 10px;
                      font-size: 18px;
                    ">
                      🔒
                    </div>
                  </td>

                  <td>
                    <strong style="color: #111827; font-size: 15px;">
                      Secure Shopping
                    </strong>

                    <p style="
                      margin: 4px 0 0;
                      color: #6b7280;
                      font-size: 13px;
                      line-height: 1.5;
                    ">
                      Your account and shopping experience are protected.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>


          <!-- ================= CTA ================= -->
          <tr>
            <td align="center" style="padding: 25px 35px 40px;">

              <a
                href="${frontendUrl}"
                style="
                  display: inline-block;
                  background-color: #4f46e5;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 30px;
                  border-radius: 10px;
                  font-size: 15px;
                  font-weight: 700;
                  box-shadow: 0 5px 15px rgba(79,70,229,0.25);
                "
              >
                Start Shopping →
              </a>

              <p style="
                margin: 18px 0 0;
                color: #9ca3af;
                font-size: 12px;
              ">
                Your next great find is just a click away.
              </p>

            </td>
          </tr>


          <!-- ================= FOOTER ================= -->
          <tr>
            <td
              style="
                background-color: #111827;
                padding: 25px 30px;
                text-align: center;
              "
            >

              <div style="
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
              ">
                Nexus<span style="color: #a78bfa;">Cart</span> AI
              </div>

              <p style="
                margin: 8px 0;
                color: #9ca3af;
                font-size: 12px;
              ">
                Smarter shopping. Personalized for you.
              </p>

              <p style="
                margin: 15px 0 0;
                color: #6b7280;
                font-size: 11px;
              ">
                © ${new Date().getFullYear()} NexusCart AI. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

// 1. Password Reset Link Request Template
export const forgotPasswordTemplate = (resetPasswordUrl, userName) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #EF4444; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Password Reset Request 🔐</h2>
      </div>
      <div style="padding: 24px; color: #333333;">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>You requested a password reset for your NexusCart AI account.</p>
        <p>Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetPasswordUrl}" style="background-color: #EF4444; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 13px; color: #666666;">If you did not request this email, please ignore it and your password will remain unchanged.</p>
      </div>
    </div>
  `;
};

// 2. Password Changed Security Alert Template
export const passwordChangedTemplate = (userName) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #10B981; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Password Changed Successfully 🔒</h2>
      </div>
      <div style="padding: 24px; color: #333333;">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your NexusCart AI account password was updated successfully.</p>
        <p>If you performed this action, no further steps are required.</p>
        <p style="font-size: 13px; color: #EF4444; font-weight: bold;">If you did not make this change, please contact our support team immediately.</p>
      </div>
    </div>
  `;
};

// ============================================
// SELLER REGISTRATION PENDING EMAIL
// ============================================

export const sellerPendingEmailTemplate = (name, email) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 10px;
    ">
      
      <h2>Welcome to NexusCart AI! 🚀</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Thank you for registering as a seller on
        <strong>NexusCart AI</strong>.
      </p>

      <p>
        Your seller account request has been successfully submitted.
      </p>

      <div style="
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      ">
        ⏳ <strong>Your account is currently pending admin approval.</strong>
      </div>

      <p>
        Our admin team will review your seller application.
        You will receive another email once your account is approved.
      </p>

      <hr />

      <p>
        Registered Email:
        <strong>${email}</strong>
      </p>

      <p>
        Thanks,<br />
        <strong>NexusCart AI Team</strong>
      </p>

    </div>
  `;
};


// ============================================
// SELLER APPROVED EMAIL
// ============================================

export const sellerApprovedEmailTemplate = (name) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 10px;
    ">

      <h2>🎉 Congratulations, ${name}!</h2>

      <p>
        Your seller account on
        <strong>NexusCart AI</strong>
        has been approved.
      </p>

      <div style="
        background: #d4edda;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      ">
        ✅ <strong>Your seller account is now active!</strong>
      </div>

      <p>
        You can now access your seller dashboard and start managing
        your products and business.
      </p>

      <p>
        Thank you for joining NexusCart AI.
      </p>

      <hr />

      <p>
        Best regards,<br />
        <strong>NexusCart AI Team</strong>
      </p>

    </div>
  `;
};

export const sellerRejectedEmailTemplate = (name) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 10px;
    ">

      <h2>Seller Application Update</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Thank you for your interest in becoming a seller on
        <strong>NexusCart AI</strong>.
      </p>

      <div style="
        background: #f8d7da;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      ">
        ❌ <strong>
          Unfortunately, your seller application was not approved.
        </strong>
      </div>

      <p>
        You may contact our support team for more information.
      </p>

      <p>
        Thank you for your understanding.
      </p>

      <hr />

      <p>
        Best Regards,<br />
        <strong>NexusCart AI Team</strong>
      </p>

    </div>
  `;
};
// ============================================
// 📦 ORDER PLACED / ORDER CONFIRMATION EMAIL
// ============================================

export const orderPlacedEmailTemplate = (name, order) => {

  const productsHtml = order.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd;">
            ${item.name}
          </td>

          <td style="padding: 12px; border-bottom: 1px solid #ddd;">
            ₹${item.price}
          </td>

          <td style="padding: 12px; border-bottom: 1px solid #ddd;">
            ${item.quantity}
          </td>

          <td style="padding: 12px; border-bottom: 1px solid #ddd;">
            ₹${item.price * item.quantity}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 650px;
      margin: auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 10px;
      color: #333;
    ">

      <!-- HEADER -->

      <h2 style="text-align: center;">
        🎉 Order Confirmed!
      </h2>

      <p>
        Hello <strong>${name}</strong>,
      </p>

      <p>
        Thank you for shopping with
        <strong>NexusCart AI</strong>.
      </p>

      <p>
        Your order has been successfully placed and is now being processed.
      </p>


      <!-- ORDER INFO -->

      <div style="
        background: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      ">

        <p>
          <strong>Order ID:</strong>
          ${order._id}
        </p>

        <p>
          <strong>Order Status:</strong>
          Processing
        </p>

        <p>
          <strong>Order Date:</strong>
          ${new Date(order.createdAt).toLocaleString()}
        </p>

      </div>


      <!-- PRODUCTS -->

      <h3>🛍️ Order Items</h3>

      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          border-collapse: collapse;
          margin-top: 10px;
        "
      >

        <thead>

          <tr style="background: #eee;">

            <th style="padding: 12px; text-align: left;">
              Product
            </th>

            <th style="padding: 12px;">
              Price
            </th>

            <th style="padding: 12px;">
              Qty
            </th>

            <th style="padding: 12px;">
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          ${productsHtml}

        </tbody>

      </table>


      <!-- PRICE SUMMARY -->

      <div style="
        margin-top: 25px;
        padding: 15px;
        background: #f9f9f9;
        border-radius: 8px;
      ">

        <h3>💰 Payment Summary</h3>

        <p>
          Items Price:
          <strong>₹${order.itemsPrice}</strong>
        </p>

        <p>
          Tax:
          <strong>₹${order.taxPrice}</strong>
        </p>

        <p>
          Shipping:
          <strong>₹${order.shippingPrice}</strong>
        </p>

        <hr />

        <h3>
          Total Amount:
          ₹${order.totalPrice}
        </h3>

      </div>


      <!-- SHIPPING INFO -->

      <div style="
        margin-top: 25px;
      ">

        <h3>📍 Shipping Address</h3>

        <p>
          ${order.shippingInfo.address},
          ${order.shippingInfo.city},
          ${order.shippingInfo.state}
        </p>

        <p>
          ${order.shippingInfo.country}
          - ${order.shippingInfo.pinCode}
        </p>

        <p>
          📞 ${order.shippingInfo.phoneNo}
        </p>

      </div>


      <!-- FOOTER -->

      <hr style="margin-top: 30px;" />

      <p>
        We will notify you when your order status changes.
      </p>

      <p>
        Thank you for shopping with us! ❤️
      </p>

      <p>
        <strong>
          NexusCart AI Team
        </strong>
      </p>

    </div>
  `;
};
// ============================================
// ORDER CANCELLED EMAIL
// ============================================

export const orderCancelledEmailTemplate = (
  name,
  order,
  reason,
  comment,
) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 10px;
    ">

      <h2>❌ Order Cancelled</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Your order on <strong>NexusCart AI</strong> has been successfully cancelled.
      </p>

      <div style="
        background: #f8d7da;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      ">

        <strong>Order ID:</strong> ${order._id}
        <br />

        <strong>Order Status:</strong> Cancelled

      </div>

      <h3>Cancellation Details</h3>

      <p>
        <strong>Reason:</strong> ${reason}
      </p>

      ${
        comment
          ? `
        <p>
          <strong>Additional Comment:</strong> ${comment}
        </p>
      `
          : ""
      }

      <p>
        If you have any questions regarding your cancelled order,
        please contact our support team.
      </p>

      <hr />

      <p>
        Thank you,<br />
        <strong>NexusCart AI Team</strong>
      </p>

    </div>
  `;
};

// ============================================
// ORDER STATUS UPDATE EMAIL
// ============================================

export const orderStatusEmailTemplate = (
  name,
  order,
  status,
  comment
) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 10px;
    ">

      <h2>📦 Order Status Updated</h2>

      <p>
        Hello <strong>${name}</strong>,
      </p>

      <p>
        The status of your order has been updated.
      </p>

      <div style="
        background: #f1f5f9;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      ">

        <p>
          <strong>Order ID:</strong>
          ${order._id}
        </p>

        <p>
          <strong>New Status:</strong>
          ${status}
        </p>

        ${
          comment
            ? `
          <p>
            <strong>Message:</strong>
            ${comment}
          </p>
        `
            : ""
        }

      </div>

      ${
        status === "Processing"
          ? `
            <p>
              ⏳ Your order is currently being processed.
            </p>
          `
          : ""
      }

      ${
        status === "Shipped"
          ? `
            <p>
              🚚 Great news! Your order has been shipped and is on its way.
            </p>
          `
          : ""
      }

      ${
        status === "Delivered"
          ? `
            <p>
              🎉 Your order has been successfully delivered.
            </p>

            <p>
              Thank you for shopping with us!
            </p>
          `
          : ""
      }

      <hr />

      <p>
        Thanks,<br />

        <strong>NexusCart AI Team</strong>
      </p>

    </div>
  `;
};