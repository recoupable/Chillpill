import { WebClient } from "@slack/web-api";
import { generateManagerResponse } from "../../anthropic/generateManagerResponse";

const managerSlack = new WebClient(process.env.MANAGER_SLACK_BOT_TOKEN);

interface SlackMessage {
  type: string;
  text: string;
  user: string;
  ts: string;
  channel: string;
  event_ts: string;
  thread_ts?: string;
}

// Helper to determine message type
function getMessageContext(text: string): string {
  // Clean the text (remove mentions)
  const cleanText = text.replace(/<@[^>]+>/g, '').trim().toLowerCase();
  
  // Casual greetings and questions
  if (cleanText.match(/^(hey|hi|hello|what('s| is)? up|how are you|what are you doing)/)) {
    return 'casual';
  }
  
  // Music and career related
  if (cleanText.includes('track') || 
      cleanText.includes('release') || 
      cleanText.includes('music') || 
      cleanText.includes('career') ||
      cleanText.includes('collab')) {
    return 'strategic';
  }
  
  // Personal/emotional
  if (cleanText.includes('feel') || 
      cleanText.includes('worry') || 
      cleanText.includes('scared') || 
      cleanText.includes('doubt')) {
    return 'emotional';
  }
  
  // Default to strategic for unknown contexts
  return 'strategic';
}

export async function handleManagerSlack(message: SlackMessage) {
  try {
    console.log('\n--- Handling Message ---');
    if (message.user === process.env.MANAGER_SLACK_ID) {
      console.log('Skipping - message is from Manager');
      return;
    }
    
    const cleanText = message.text.replace(/<@[^>]+>/g, '').trim();
    const context = getMessageContext(cleanText);
    
    console.log('Clean text:', cleanText);
    console.log('Message context:', context);
    
    console.log('Generating response...');
    const response = await generateManagerResponse({
      text: cleanText,
      username: "chillpill",
      messageContext: context
    });

    console.log('Generated response:', response);

    // Always tag Chillpill in the response
    const taggedResponse = `<@${process.env.CHILLPILL_SLACK_ID}> ${response}`;
    console.log('Tagged response:', taggedResponse);

    console.log('Sending to Slack...');
    await managerSlack.chat.postMessage({
      channel: message.channel,
      text: taggedResponse
    });
    console.log('✅ Response sent successfully');

  } catch (error) {
    console.error("Error handling Slack message:", error);
    await managerSlack.chat.postMessage({
      channel: message.channel,
      text: "Vibes off. Try again."
    });
  }
}