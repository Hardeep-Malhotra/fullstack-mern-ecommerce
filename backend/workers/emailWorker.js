import { Worker } from "bullmq";
import IORedis from "ioredis";
import { sendEmail } from "../utils/sendEmail.js";

// 1. Create Redis connection for Worker
const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  },
);

// 2. Create Worker
export const emailWorker = new Worker(
  "shopzy-email-queue",

  async (job) => {
    console.log(`📩 Processing email job: ${job.id}`);

    // 3. Get email data from the Queue
    const { email, subject, message, html } = job.data;

    // 4. Reuse existing Resend email function
    const result = await sendEmail({
      email,
      subject,
      message,
      html,
    });

    console.log(`✅ Email sent for job: ${job.id}`);

    return result;
  },

  {
    connection,
    concurrency: 5,
  },
);

// 5. Worker event listeners

emailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`❌ Job ${job?.id} failed:`, error.message);
});

emailWorker.on("error", (error) => {
  console.error("🔴 Worker Error:", error.message);
});

// 6. Graceful shutdown
export const closeEmailWorker = async () => {
  await emailWorker.close();
  await connection.quit();

  console.log("Email Worker shut down gracefully");
};

process.on("SIGTERM", closeEmailWorker);
process.on("SIGINT", closeEmailWorker);

console.log("🚀 Shopzy Email Worker is running...");
