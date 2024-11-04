import cron from "node-cron";
import sleep from "./lib/tools/sleep";

const startCronJobs = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running 5-minute post cron job");
  });
};

const init = async () => {
  console.log("Starting Farcaster Cast Poller");

  // Start cron jobs
  startCronJobs();

  // Start polling loop
  while (true) {
    await sleep();
  }
};

init();
