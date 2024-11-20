import { App } from '@slack/bolt';
import { handleManagerSlack } from './handleManagerSlack';
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env file from project root
dotenv.config({ path: resolve(__dirname, "../../../.env") });

// Debug log to check if env vars are loaded
console.log('Checking environment variables:');
console.log('MANAGER_SLACK_BOT_TOKEN exists:', !!process.env.MANAGER_SLACK_BOT_TOKEN);
console.log('MANAGER_SIGNING_SECRET exists:', !!process.env.MANAGER_SIGNING_SECRET);
console.log('MANAGER_APP_TOKEN exists:', !!process.env.MANAGER_APP_TOKEN);

const app = new App({
  token: process.env.MANAGER_SLACK_BOT_TOKEN,
  signingSecret: process.env.MANAGER_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.MANAGER_APP_TOKEN
});

// Listen to both direct messages and mentions
app.event('message', async ({ event, say }) => {
  try {
    // Respond to messages that either mention the Manager or are direct messages
    if (
      event.user !== process.env.MANAGER_SLACK_ID && 
      (event.text.includes(`<@${process.env.MANAGER_SLACK_ID}>`) || event.channel_type === 'im')
    ) {
      await handleManagerSlack(event);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Start the app
(async () => {
  await app.start(3000);
  console.log('⚡️ Manager Bot is running!');
})();