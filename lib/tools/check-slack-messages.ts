import { readSlackMessages } from "./read_slack_messages";
import type { TaskGeneration } from "./actionLoop/generateTask";

export async function checkSlackMessages() {
  // Basic task for direct message responses
  const mentionTask: TaskGeneration = {
    taskId: "direct-mention",
    task: "Respond to direct mention",
    taskReasoning: "Quick response to user mention",
    action: "read_slack_messages"
  };

  try {
    // Use existing readSlackMessages function
    await readSlackMessages(mentionTask);
  } catch (error) {
    console.error('Error checking Slack messages:', error);
  }
}

// Continuous checking function
export async function startMessageChecking() {
  console.log('Starting continuous message checking...');
  
  while (true) {
    try {
      await checkSlackMessages();
      // Check every second
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error in message checking loop:', error);
      // Wait 5 seconds if there's an error before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}