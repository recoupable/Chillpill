import { OPEN_AI_MODEL } from "@/lib/consts";
import { openai } from "@/lib/openai/client";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export const getCurrentStateOfExecution = async () => {
  const sendEmails = await getEventsForToday("send_email");
  const systemPrompt = `Reply with the current state of execution in this EXACT format:
  1. Start with "I have completed X goal(s) for today"
  2. Then state "I still need to complete Y other goals, including [list remaining tasks]"
  3. End with "I have sent [N] emails"

  Compare the current progress against these goals and mark as complete ONLY if the current value meets or exceeds the goal:
  - Emails goal: 11 (current: ${sendEmails.length}) ${
    sendEmails.length >= 11 ? "✓" : "✗"
  }

  Total completed goals: ${[sendEmails.length >= 11].filter(Boolean).length}
  Remaining goals: ${1 - [sendEmails.length >= 11].filter(Boolean).length}
  
  Example output: I have completed 3 goals for today. I still need to complete A other goals, including sending C emails.`;

  const currentStateOfExecution = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [{ role: "system", content: systemPrompt }],
    max_completion_tokens: 1111,
  });
  return currentStateOfExecution.choices[0].message.content || "";
};
