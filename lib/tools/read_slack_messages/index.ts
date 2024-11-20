import type { TaskGeneration } from "../actionLoop/generateTask";
import { trackCreateSlackMessage } from "@/lib/stack/trackCreateSlackMessage";
import { generateSlackMessage } from "@/lib/openai/generateSlackMessage";
import { slack } from "@/lib/slack/client";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export async function readSlackMessages(task: TaskGeneration) {
  try {
    console.time('total-response-time');
    
    console.time('fetch-messages');
    const result = await slack.conversations.history({
      channel: process.env.SLACK_CHANNEL_ID || "",
      limit: 1,
    });
    console.timeEnd('fetch-messages');

    const messages = result.messages || [];
    
    console.time('check-previous-responses');
    const previousResponses = await getEventsForToday("send_slack_message");
    console.timeEnd('check-previous-responses');

    // Get previous responses
    const respondedThreads = new Set();
    
    // Track both thread_ts and original message ts
    previousResponses.forEach(response => {
      if (response.metadata?.thread_ts) {
        respondedThreads.add(response.metadata.thread_ts);
      }
      if (response.metadata?.originalMessageTs) {
        respondedThreads.add(response.metadata.originalMessageTs);
      }
    });

    // Get the most recent message that's not from Chillpill and hasn't been responded to
    const latestMessage = messages.find(message => 
      message.user !== 'U07UV2S9M8S' && 
      !respondedThreads.has(message.ts) &&
      message.text.includes('<@U07UV2S9M8S>')
    );

    if (!latestMessage) {
      console.timeEnd('total-response-time');
      console.log("No new messages to respond to");
      return;
    }

    // Generate analysis of messages
    const analysisTask = {
      ...task,
      task: latestMessage.text.replace(/<@U07UV2S9M8S>/g, '').trim(),
      metadata: {
        userId: latestMessage.user,
        originalMessage: latestMessage.text,
        thread_ts: latestMessage.ts,
        shouldTag: true
      },
      taskReasoning: "Just chat naturally"
    };

    console.time('generate-response');
    const analysis = await generateSlackMessage(analysisTask);
    console.timeEnd('generate-response');

    // Remove any existing user tags from the analysis
    const cleanAnalysis = analysis.replace(/<@[A-Z0-9]+>/g, '').trim();

    const slackConfig = {
      channel: process.env.SLACK_CHANNEL_ID || "",
      text: cleanAnalysis,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<@${latestMessage.user}> ${cleanAnalysis}`,
          },
        },
      ],
    };

    console.time('send-message');
    const response = await slack.chat.postMessage(slackConfig);
    console.timeEnd('send-message');

    console.timeEnd('total-response-time');
    await trackCreateSlackMessage(
      slackConfig.text,
      slackConfig.channel,
      response.ts,
      {
        originalMessageTs: latestMessage.ts
      }
    );

    console.log("Successfully read and responded to Slack message");
    return response;
  } catch (error) {
    console.error("Slack message reading failed:", error);
    throw error;
  }
}