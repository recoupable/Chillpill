import { OPEN_AI_MODEL } from "../consts";
import { openai } from "./client";
import { whoIsChillpill } from "./instructions";
import type { TaskGeneration } from "@/lib/tools/actionLoop/generateTask";

interface SlackResponseInput {
  text: string;
  username: string;
  task: TaskGeneration;
}

export async function generateSlackResponse({
  text,
  username,
  task,
}: SlackResponseInput) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `${whoIsChillpill} Your current goal is to respond to a Slack message in a way that aligns with your persona and the current task context.`,
      },
      {
        role: "user",
        content: `Respond to this Slack message from ${username}: "${text}"
        Current task context:
        Task: ${task.task}
        Reasoning: ${task.taskReasoning}`,
      },
    ],
    model: OPEN_AI_MODEL,
  });

  return completion.choices[0].message.content || "";
}