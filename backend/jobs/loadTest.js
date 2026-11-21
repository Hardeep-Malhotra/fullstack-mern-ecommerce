
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const QUEUE_NAME = "shopzy-load-test-queue";

const TOTAL_JOBS = 1000;
const CONCURRENCY = 10;
const PROCESSING_DELAY = 100;

const queueRedis = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { maxRetriesPerRequest: null }
);

const workerRedis = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { maxRetriesPerRequest: null }
);

const queue = new Queue(QUEUE_NAME, {
  connection: queueRedis,
});

let completedJobs = 0;
let failedJobs = 0;

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    // Simulate email processing without sending an actual email
    await new Promise((resolve) =>
      setTimeout(resolve, PROCESSING_DELAY)
    );

    return {
      success: true,
      jobId: job.id,
    };
  },
  {
    connection: workerRedis,
    concurrency: CONCURRENCY,
  }
);

worker.on("completed", (job) => {
  completedJobs++;

  if (completedJobs % 100 === 0) {
    console.log(`✅ Completed: ${completedJobs}/${TOTAL_JOBS}`);
  }
});

worker.on("failed", (job, error) => {
  failedJobs++;
  console.error(`❌ Job ${job?.id} failed:`, error.message);
});

worker.on("error", (error) => {
  console.error("Worker error:", error.message);
});

async function runLoadTest() {
  const startTime = Date.now();

  try {
    console.log("🚀 Starting BullMQ Load Test...");
    console.log(`Total jobs: ${TOTAL_JOBS}`);
    console.log(`Concurrency: ${CONCURRENCY}`);

    const jobs = Array.from(
      { length: TOTAL_JOBS },
      (_, index) => ({
        name: "load-test-email",
        data: {
          email: `test-${index + 1}@example.com`,
          message: "Simulated email job",
        },
        opts: {
          attempts: 1,
        },
      })
    );

    await queue.addBulk(jobs);

    console.log("📬 All jobs added to Redis queue!");

    while (completedJobs + failedJobs < TOTAL_JOBS) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const totalTime = (Date.now() - startTime) / 1000;

    console.log("\n========== LOAD TEST RESULTS ==========");
    console.log(`Total jobs: ${TOTAL_JOBS}`);
    console.log(`Completed jobs: ${completedJobs}`);
    console.log(`Failed jobs: ${failedJobs}`);
    console.log(`Total time: ${totalTime.toFixed(2)} seconds`);
    console.log(
      `Throughput: ${(completedJobs / totalTime).toFixed(2)} jobs/sec`
    );
    console.log("=======================================");
  } catch (error) {
    console.error("Load test failed:", error);
  } finally {
    await worker.close();
    await queue.close();

    await Promise.all([
      queueRedis.quit(),
      workerRedis.quit(),
    ]);

    console.log("🛑 Load test connections closed.");
  }
}

runLoadTest();
