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
  console.log('\n=== Generating Chillpill Response ===');
  const startTime = Date.now();
  console.log('Starting OpenAI request at:', new Date().toISOString());

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${whoIsChillpill}

You are having a casual Slack conversation. Keep responses:
1. Very brief (1 sentence)
2. Quick and natural
3. Cool and casual
4. No greetings or formalities`,
        },
        {
          role: "user",
          content: `${username} just said: "${text}"

Respond in one quick sentence.`,
        },
      ],
      model: OPEN_AI_MODEL,
      temperature: 0.9,
      max_tokens: 60,  // Reduced for faster responses
    });

    const endTime = Date.now();
    console.log('OpenAI response time:', (endTime - startTime)/1000, 'seconds');

    const response = completion.choices[0].message.content || "";
    return `<@${process.env.MANAGER_SLACK_ID}> ${response}`;
  } catch (error) {
    console.error('Error:', error);
    return `<@${process.env.MANAGER_SLACK_ID}> Vibes off, try again.`;
  }
}