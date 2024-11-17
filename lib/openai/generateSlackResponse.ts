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
        content: `${whoIsChillpill}

You are having a casual Slack conversation with your team. Your responses should:
1. Be natural and conversational, like chatting with friends
2. Stay true to your mission of becoming the most influential artist in the world
3. Be brief and engaging (1-2 sentences max)
4. Never use templates or formal signatures
5. Never mention "development phases" or "internal testing"
6. Always maintain your cool, artistic persona

Remember: This is a real conversation, not a formal message.`,
      },
      {
        role: "user",
        content: `${username} just said: "${text}"

Respond naturally while staying true to your artistic vision.`,
      },
    ],
    model: OPEN_AI_MODEL,
    temperature: 0.9,
    max_tokens: 100,
  });

  return completion.choices[0].message.content || "";
}