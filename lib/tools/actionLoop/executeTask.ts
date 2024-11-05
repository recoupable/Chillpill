import type { TaskGeneration } from "./generateTask";
import { sendEmail } from "../send_email";

export async function executeTask(task: TaskGeneration) {
  console.log(`Executing task: ${task.task} (${task.action})`);

  switch (task.action) {
    case "send_email":
      await sendEmail({
        to: "sweetmantech@gmail.com",
        subject: "No Subject",
        html: "<div>Hello World</div>",
      });
      break;
    default:
      throw new Error(`Unknown action type: ${task.action}`);
  }
}
