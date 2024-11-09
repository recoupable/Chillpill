import { OPEN_AI_MODEL } from "../consts";
import type { TaskGeneration } from "../tools/actionLoop/generateTask";
import { openai } from "./client";
import { whoIsChillpill } from "./instructions";

async function generateEmailContent(task: TaskGeneration) {
  const prompt = `
      Generate a short, casual email that feels effortless and intriguing, aligned with Chillpill's vibe. 
      Keep it one or two sentences max—simple, direct, and with a hint of mystery. The tone should be cool and confident, without trying too hard to grab attention.
      The goal is to make the recipient curious enough to respond or engage further, but without sounding overly eager.
      
      Here are the task details:
      Task ID: ${task.taskId}
      Task Type: ${task.task}
      Task Reasoning: ${task.taskReasoning}

      Format the response in JSON with two fields: 'subject' and 'html'.
      The 'subject' should be low-key but interesting, and the 'html' should have a relaxed, conversational style.
    `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: whoIsChillpill },
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