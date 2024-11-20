import { WebClient } from "@slack/web-api";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env file from project root
dotenv.config({ path: resolve(__dirname, "../../../.env") });

// Debug: Print environment variable status
console.log("Environment Check:");
console.log("MANAGER_SLACK_BOT_TOKEN exists:", !!process.env.MANAGER_SLACK_BOT_TOKEN);
console.log("Token starts with:", process.env.MANAGER_SLACK_BOT_TOKEN?.substring(0, 15) + "...");

const managerSlack = new WebClient(process.env.MANAGER_SLACK_BOT_TOKEN);

async function findManagerId() {
  try {
    const response = await managerSlack.auth.test();
    console.log("\nSlack API Response:");
    console.log("Manager Bot User ID:", response.user_id);
    console.log("Manager Bot Username:", response.user);
    console.log("Team Name:", response.team);
  } catch (error) {
    console.error("\nError Details:", error);
  }
}

findManagerId();