import { WebClient } from "@slack/web-api";
import type { TaskGeneration } from "../actionLoop/generateTask";
import { trackCreateSlackMessage } from "@/lib/stack/trackCreateSlackMessage";

if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_CHANNEL_ID) {
  throw new Error("Slack environment variables are missing.");
}

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function sendSlackMessage(task: TaskGeneration) {
  try {
    const slackConfig = {
      channel: process.env.SLACK_CHANNEL_ID || "",
      text: task.task,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Task ID:* ${task.taskId}\n*Task:* ${task.task}\n*Reasoning:* ${task.taskReasoning}`,
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
    console.error("Slack message sending failed:", error);
    throw error;
  }
}
