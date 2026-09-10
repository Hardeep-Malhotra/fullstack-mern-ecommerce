import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config({ path: "./config/config.env" });

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  console.log("Sending email to:", options.email);

  console.log(
    "Sending from:",
    `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`
  );

  const { data, error } = await resend.emails.send({
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,

    to: [options.email],

    subject: options.subject,

    text: options.message,

    html: options.html || `<p>${options.message}</p>`,
  });

  if (error) {
    console.error("Resend Email Error:", error);

    throw new Error(`Email sending failed: ${error.message}`);
  }

  console.log("Email sent successfully:", data);

  return data;
};