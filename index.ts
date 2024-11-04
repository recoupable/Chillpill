import cron from "node-cron";
// import sleep from "./lib/tools/sleep";

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
  // while (true) {
  //   await sleep();
  // }
};

init();
