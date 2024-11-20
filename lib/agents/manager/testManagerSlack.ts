import { WebClient } from "@slack/web-api";
import { handleManagerSlack } from './handleManagerSlack';
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env file from project root
dotenv.config({ path: resolve(__dirname, "../../../.env") });

const managerSlack = new WebClient(process.env.MANAGER_SLACK_BOT_TOKEN);

async function testManagerSlack() {
  try {
    console.log("Testing Manager's Slack response...\n");
    
    // First send a direct message to the channel
    await managerSlack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID!,
      text: "🎵 Starting Manager Response Test..."
    });

    const testMessage = {
      type: 'message',
      text: "Hey Manager, I'm thinking about doing a surprise drop of my new track tomorrow. What do you think?",
      user: process.env.CHILLPILL_SLACK_ID!,
      ts: Math.floor(Date.now() / 1000).toString(),
      channel: process.env.SLACK_CHANNEL_ID!,
      event_ts: Math.floor(Date.now() / 1000).toString()
    };

    console.log("Sending test message to Slack...");
    await handleManagerSlack(testMessage);

    // Send completion message
    await managerSlack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID!,
      text: "✅ Test Complete!"
    });

  } catch (error) {
    console.error("Error testing Manager Slack:", error);
    
    // Send error message to Slack
    await managerSlack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID!,
      text: "❌ Test Failed: " + error.message
    });
  }
}

testManagerSlack();