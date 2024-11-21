import { App } from '@slack/bolt';
import { handleManagerSlack } from './handleManagerSlack';
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

console.log('Starting Manager bot with debug logging...');
console.log('MANAGER_SLACK_ID:', process.env.MANAGER_SLACK_ID);

const app = new App({
  token: process.env.MANAGER_SLACK_BOT_TOKEN,
  signingSecret: process.env.MANAGER_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.MANAGER_APP_TOKEN,
  logLevel: 'DEBUG'
});

// Debug middleware to log all incoming events
app.use(async ({ logger, context, next }) => {
  console.log('\n=== Incoming Event ===');
  console.log('Type:', context.type);
  console.log('Body:', JSON.stringify(context.body, null, 2));
  await next();
});

// Add message deduplication
const processedMessages = new Set();

app.event('app_mention', async ({ event, say }) => {
  // Skip quoted text
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
  try {
    await handleManagerSlack(event);
  } catch (error) {
    console.error('Error:', error);
  }
});

app.error(async (error) => {
  console.error('\n=== Slack App Error ===');
  console.error('Error:', error);
});

(async () => {
  try {
    await app.start();
    console.log('\n⚡️ Manager Bot is running with DEBUG logging!');
    console.log('Waiting for events...\n');
  } catch (error) {
    console.error('\n❌ Failed to start app:', error);
  }
})();