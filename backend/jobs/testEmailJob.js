
import dotenv from "dotenv";

dotenv.config({
  path: "./config/config.env",
});

// Import queue only after environment variables load
const { addEmailJob, emailQueue } = await import("./emailQueue.js");

try {
  const job = await addEmailJob({
    email: "bhumikagaba75@gmail.com",
    subject: "Shopzy BullMQ Test",
    message: "Bro! Your BullMQ Producer and Worker are working successfully.",
  });

  console.log("✅ Email job added successfully!");
  console.log("Job ID:", job.id);
} catch (error) {
  console.error("❌ Failed to add job:", error.message);
} finally {
  await emailQueue.close();
}
