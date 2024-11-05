import { OPEN_AI_MODEL } from "../consts";
import { openai } from "./client";
import type { TaskGeneration } from "@/lib/tools/actionLoop/generateTask";
import { whoIsReneeCoupable } from "./instructions";

export async function generateSlackMessage(task: TaskGeneration) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `${whoIsReneeCoupable} Your current goal is to format the task information into a clear, concise Slack message.`,
      },
      {
        role: "user",
        content: `Write a Slack message for the following task:
            Task: ${task.task}
            Reasoning: ${task.taskReasoning}
            Goal: Create authentic music and grow your cult-like following`,
      },
    ],
    model: OPEN_AI_MODEL,
  });

  return completion.choices[0].message.content || "";
}
