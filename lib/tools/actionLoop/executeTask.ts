import type { TaskGeneration } from "./generateTask";
import { sendEmail } from "../send_email";
import { sendSlackMessage } from "../send_slack_message";
import { readSlackMessages } from "../read_slack_messages";

export async function executeTask(task: TaskGeneration) {
  console.log(`Executing task: ${task.task} (${task.action})`);

  switch (task.action) {
    case "send_email":
      await sendEmail(task);
      break;
    case "send_slack_message":
      await sendSlackMessage(task);
      break;
    case "read_slack_messages":
      await readSlackMessages(task);
      break;
    default:
      throw new Error(`Unknown action type: ${task.action}`);
  }
}
