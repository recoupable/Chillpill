import { createActionLoop } from "./lib/tools/actionLoop";

const init = async () => {
  console.log("Starting Recoup Agent");

  // Start polling loop
  while (true) {
    await createActionLoop();
  }
};

init();
