import { WebClient } from "@slack/web-api";

if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_CHANNEL_ID) {
  throw new Error("Slack environment variables are missing.");
}

console.log("SLACK_BOT_TOKEN:", process.env.SLACK_BOT_TOKEN);
console.log("SLACK_CHANNEL_ID:", process.env.SLACK_CHANNEL_ID);

export const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
