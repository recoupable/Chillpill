import { App } from '@slack/bolt';
import { generateSlackResponse } from '../../openai/generateSlackResponse';
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

console.log('\n=== Starting Chillpill Bot ===');
console.log('Environment Check:');
console.log('- CHILLPILL_SLACK_ID:', process.env.CHILLPILL_SLACK_ID);
console.log('- SLACK_BOT_TOKEN exists:', !!process.env.SLACK_BOT_TOKEN);
console.log('- CHILLPILL_SIGNING_SECRET exists:', !!process.env.CHILLPILL_SIGNING_SECRET);
console.log('- CHILLPILL_APP_TOKEN exists:', !!process.env.CHILLPILL_APP_TOKEN);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.CHILLPILL_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.CHILLPILL_APP_TOKEN,
  logLevel: 'DEBUG'
});

// Track processed messages
const processedMessages = new Set();

app.event('app_mention', async ({ event, say }) => {
  // Only respond to direct mentions, not quoted text
  if (event.text.startsWith('>')) {
    console.log('Skipping quoted text');
    return;
  }
  
  const messageKey = `${event.ts}`;
  
  if (processedMessages.has(messageKey)) {
    console.log('Skipping duplicate message:', messageKey);
    return;
  }
  
  processedMessages.add(messageKey);
  setTimeout(() => processedMessages.delete(messageKey), 10000);

  console.log('\n=== Processing App Mention ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    console.log('Processing message:', messageKey);
    const response = await generateSlackResponse({
      text: event.text,
      username: "manager",
      task: {
        taskId: "natural-chat",
        task: "chat",
        taskReasoning: "natural conversation",
        action: "send_slack_message"
      }
    });
    await say(response);
    console.log('Successfully processed:', messageKey);
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

app.error(async (error) => {
  console.error('\n=== Slack App Error ===');
  console.error('Error:', error);
});

(async () => {
  try {
    await app.start();
    console.log('\n⚡️ Chillpill Bot is running with DEBUG logging!');
    console.log('Waiting for events...\n');
  } catch (error) {
    console.error('\n❌ Failed to start app:', error);
  }
})();