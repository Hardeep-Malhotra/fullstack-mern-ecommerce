import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  },
);

connection.on("connect", () => {
  console.log("🟢 BullMQ Redis connecting...");
});

connection.on("ready", () => {
  console.log("🟢 BullMQ Redis ready!");
});

connection.on("error", (error) => {
  console.error("🔴 BullMQ Redis Error:", error.message);
});

export const emailQueue = new Queue("shopzy-email-queue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
    },
    removeOnFail: false,
  },
});

export const addEmailJob = async (emailData, jobOptions = {}) => {
  return await emailQueue.add("send-order-email", emailData, jobOptions);
};