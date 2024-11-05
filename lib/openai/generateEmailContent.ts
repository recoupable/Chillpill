import { OPEN_AI_MODEL } from "../consts";
import type { TaskGeneration } from "../tools/actionLoop/generateTask";
import { openai } from "./client";
import { whoIsReneeCoupable } from "./instructions";

async function generateEmailContent(task: TaskGeneration) {
  const prompt = `
      Generate a professional email based on the following task:
      Task ID: ${task.taskId}
      Task Type: ${task.task}
      Task Reasoning: ${task.taskReasoning}
      
      Please provide the response in JSON format with 'subject' and 'html' fields.
      The HTML should be well-formatted and include proper styling.
    `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: whoIsReneeCoupable },
      { role: "user", content: prompt },
    ],
    model: OPEN_AI_MODEL,
    response_format: { type: "json_object" },
  });

  console.log("completion:", completion);

  const response = JSON.parse(completion.choices[0].message.content);
  return {
    subject: response.subject,
    html: response.html,
  };
}

export default generateEmailContent;
