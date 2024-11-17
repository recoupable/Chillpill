import { openai } from "./client";
import { OPEN_AI_MODEL } from "../consts";
import { whoIsChillpill } from "./instructions";

export async function generateSlackMessage(task: TaskGeneration & { 
  metadata?: { 
    userId: string;
    originalMessage: string;
    shouldTag: boolean;
  } 
}) {
  const systemPrompt = `${whoIsChillpill}
You are having a casual conversation. Keep responses:
1. Brief and natural
2. Direct and personal
3. No need to include greetings like "Hey!" or "Hello!"
4. Just respond naturally to the message content

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

  const response = completion.choices[0].message.content || "";
  
  // Add user tag at the start if needed
  return task.metadata?.shouldTag 
    ? `<@${task.metadata.userId}> ${response}`
    : response;
}