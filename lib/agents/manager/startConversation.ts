import { generateManagerResponse } from '../../anthropic/generateManagerResponse';
import { WebClient } from "@slack/web-api";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

const managerSlack = new WebClient(process.env.MANAGER_SLACK_BOT_TOKEN);

async function startManagerConversation() {
  try {
    console.log("Manager starting conversation...\n");
    
    const response = await generateManagerResponse({
      text: "Time to level up your game. What's your biggest goal right now?",
      username: "chillpill"
    });

    // Add Chillpill tag
    const taggedResponse = `<@${process.env.CHILLPILL_SLACK_ID}> ${response}`;

    // Send to Slack
    await managerSlack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID!,
      text: taggedResponse
    });

    console.log("Message sent:", taggedResponse);

  } catch (error) {
    console.error("Error:", error);
  }
}

startManagerConversation();