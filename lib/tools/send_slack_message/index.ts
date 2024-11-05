import type { TaskGeneration } from "../actionLoop/generateTask";
import { trackCreateSlackMessage } from "@/lib/stack/trackCreateSlackMessage";
import { generateSlackMessage } from "@/lib/openai/generateSlackMessage";
import { slack } from "@/lib/slack/client";

export async function sendSlackMessage(task: TaskGeneration) {
  try {
    const generatedMessage = await generateSlackMessage(task);

    const slackConfig = {
      channel: process.env.SLACK_CHANNEL_ID || "",
      text: task.task,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: generatedMessage,
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
