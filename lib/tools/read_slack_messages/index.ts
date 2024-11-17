import type { TaskGeneration } from "../actionLoop/generateTask";
import { trackCreateSlackMessage } from "@/lib/stack/trackCreateSlackMessage";
import { generateSlackMessage } from "@/lib/openai/generateSlackMessage";
import { slack } from "@/lib/slack/client";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export async function readSlackMessages(task: TaskGeneration) {
  try {
    const result = await slack.conversations.history({
      channel: process.env.SLACK_CHANNEL_ID || "",
      limit: 10,
    });

    const messages = result.messages || [];
    
    // Get previous responses
    const previousResponses = await getEventsForToday("send_slack_message");
    const respondedThreads = new Set(
      previousResponses.map(response => response.metadata.thread_ts)
    );

    // Get the most recent message that's not from Chillpill and hasn't been responded to
    const latestMessage = messages.find(message => 
      message.user !== 'U07UV2S9M8S' && 
      !respondedThreads.has(message.ts) &&
      message.text.includes('<@U07UV2S9M8S>')
    );

    if (!latestMessage) {
      console.log("No new messages to respond to");
      return;
    }

    // Generate analysis of messages
    const analysisTask = {
      ...task,
      task: latestMessage.text.replace(/<@U07UV2S9M8S>/g, '').trim(),
      metadata: {
        userId: latestMessage.user,
        originalMessage: latestMessage.text
      },
      taskReasoning: "Just chat naturally"
    };
    const analysis = await generateSlackMessage(analysisTask);

    const slackConfig = {
      channel: process.env.SLACK_CHANNEL_ID || "",
      text: analysis,
      thread_ts: latestMessage.ts,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: analysis,
          },
        },
      ],
    };

    const response = await slack.chat.postMessage(slackConfig);

    await trackCreateSlackMessage(
      slackConfig.text,
      slackConfig.channel,
      response.ts || ""
    );

    console.log("Successfully read and responded to Slack message");
    return response;
  } catch (error) {
    console.error("Slack message reading failed:", error);
    throw error;
  }
}