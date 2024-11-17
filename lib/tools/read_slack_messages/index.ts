import type { TaskGeneration } from "../actionLoop/generateTask";
import { trackCreateSlackMessage } from "@/lib/stack/trackCreateSlackMessage";
import { generateSlackMessage } from "@/lib/openai/generateSlackMessage";
import { slack } from "@/lib/slack/client";

export async function readSlackMessages(task: TaskGeneration) {
  try {
    // Get recent messages
    const result = await slack.conversations.history({
      channel: process.env.SLACK_CHANNEL_ID || "",
      limit: 10,
    });

    const messages = result.messages || [];
    
    // Generate analysis of messages
    const analysisTask = {
      ...task,
      task: `Analyze ${messages.length} recent Slack messages for team context`,
      taskReasoning: "Building understanding of ongoing team discussions"
    };

    const analysis = await generateSlackMessage(analysisTask);

    const slackConfig = {
      channel: process.env.SLACK_CHANNEL_ID || "",
      text: task.task,
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

    return response;
  } catch (error) {
    console.error("Slack message reading failed:", error);
    throw error;
  }
}