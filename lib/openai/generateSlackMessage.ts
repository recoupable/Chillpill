import { openai } from "./client";
import { OPEN_AI_MODEL } from "../consts";
import { whoIsChillpill } from "./instructions";

export async function generateSlackMessage(task: TaskGeneration & { 
  metadata?: { 
    userId: string;
    originalMessage: string;
  } 
}) {
  const systemPrompt = `${whoIsChillpill}
You are having a casual conversation. Keep responses:
1. Brief and natural
2. No need to mention yourself
3. No need to tag anyone - the system will handle that
4. Just respond to the message content directly

Original message: "${task.task}"`;

  const completion = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: task.task }
    ],
    max_tokens: 150,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
}