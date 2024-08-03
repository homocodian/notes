import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

import { env } from "@/env";

import { saveDevice } from "./save-device";

const connection = new IORedis(env.REDIS_URL, {
  enableOfflineQueue: false,
  maxRetriesPerRequest: null
});

export const BgQueue = new Queue("cinememo-bgTask", {
  connection,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: true }
});

const BgWorker = new Worker(
  "cinememo-bgTask",
  async (job) => {
    switch (job.name) {
      case "saveDevice":
        await saveDevice(job.data);
        break;
      default:
        console.error(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection
  }
);

BgWorker.on("completed", (job) => {
  console.log(`Task ${job.id} (${job.name}) has been completed`);
});

BgWorker.on("failed", (job, err) => {
  console.error(`Task ${job?.id} has failed: ${err.message}`);
});
