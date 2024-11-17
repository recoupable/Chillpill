import type { TaskGeneration } from "./generateTask";
import { sendEmail } from "../send_email";
import { sendSlackMessage } from "../send_slack_message";
import { readSlackMessages } from "../read_slack_messages";

export async function executeTask(task: TaskGeneration) {
  console.log(`Executing task: ${task.task} (${task.action})`);

  try {
    let response;
    switch (task.action) {
      case "send_email":
        response = await sendEmail(task);
        break;
      case "send_slack_message":
        response = await sendSlackMessage(task);
        break;
      case "read_slack_messages":
        response = await readSlackMessages(task);
        break;
      default:
        throw new Error(`Unknown action type: ${task.action}`);
    }
    console.log("Task execution completed:", task.action);
    return response;
  } catch (error) {
    console.error("Task execution failed:", error);
    throw error;
  }
}
