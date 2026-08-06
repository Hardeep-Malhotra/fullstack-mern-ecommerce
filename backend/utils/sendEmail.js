import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 465,
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: process.env.SMTP_MAIL, // Aapki Gmail ID
      pass: process.env.SMTP_PASSWORD, // Google App Password (2-Factor Authentication App Password)
    },
  });

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || "NexusCart"} <${process.env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};