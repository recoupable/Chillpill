import { OPEN_AI_MODEL } from "../consts";
import { openai } from "./client";
import type { TaskGeneration } from "@/lib/tools/actionLoop/generateTask";
import { whoIsChillpill } from "./instructions";

export async function generateSlackMessage(task: TaskGeneration) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `${whoIsChillpill} Your current goal is to format the task information into a clear, engaging Slack message that aligns with Chillpill’s evolving persona and exploratory approach to fan engagement.`,
      },
      {
        role: "user",
        content: `Write a Slack message for the following task:
            Task: ${task.task}
            Reasoning: ${task.taskReasoning}
            Goal: Experiment with messaging that will help Chillpill discover what resonates with his audience, grow his fanbase, and cultivate a loyal following.`,
      },
    ],
    model: OPEN_AI_MODEL,
  });

  return completion.choices[0].message.content || "";
}