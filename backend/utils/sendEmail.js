import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  console.log("Sending email to:", options.email);

  const { data, error } = await resend.emails.send({
    from: "NexusCart AI <onboarding@resend.dev>",
    to: [options.email],
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  });

  if (error) {
    console.error("Resend Email Error:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }

  return data;
};