import { createActionLoop } from "./lib/tools/actionLoop";

const init = async () => {
  console.log("Starting Recoup Agent");

  // Start polling loop
  while (true) {
    await createActionLoop();
    // Sleep for 5 minutes (300000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 300000));
  }
};

init();
