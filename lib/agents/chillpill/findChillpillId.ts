import { WebClient } from "@slack/web-api";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

console.log("Environment Check:");
console.log("CHILLPILL_SLACK_BOT_TOKEN exists:", !!process.env.CHILLPILL_SLACK_BOT_TOKEN);
console.log("CHILLPILL_APP_TOKEN exists:", !!process.env.CHILLPILL_APP_TOKEN);

const chillpillSlack = new WebClient(process.env.CHILLPILL_SLACK_BOT_TOKEN);

async function findChillpillId() {
  try {
    const response = await chillpillSlack.auth.test();
    console.log("\nSlack API Response:");
    console.log("Chillpill Bot User ID:", response.user_id);
    console.log("Chillpill Bot Username:", response.user);
    console.log("Team Name:", response.team);
  } catch (error) {
    console.error("\nError Details:", error);
  }
}

findChillpillId();