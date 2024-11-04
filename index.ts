import cron from "node-cron";
import { createActionLoop } from "./lib/tools/actionLoop";

const startCronJobs = () => {
  // Run every 5 minutes
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running 1-minute cron job - I am thinking");
  });
};

const init = async () => {
  console.log("Starting Recoup Agent");

  // Start cron jobs
  startCronJobs();

  // Start polling loop
  while (true) {
    await createActionLoop();
  }
};

init();
