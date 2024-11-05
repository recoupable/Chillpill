import type { TaskGeneration } from "./generateTask";
import { sendEmail } from "../send_email";
import { sendSlackMessage } from "../send_slack_message";

export async function executeTask(task: TaskGeneration) {
  console.log(`Executing task: ${task.task} (${task.action})`);

  switch (task.action) {
    case "send_email":
      await sendEmail(task);
      break;
    case "send_slack_message":
      await sendSlackMessage(task);
      break;
    default:
      throw new Error(`Unknown action type: ${task.action}`);
  }
}
