import { OPEN_AI_MODEL } from "@/lib/consts";
import { openai } from "@/lib/openai/client";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export const getCurrentStateOfExecution = async () => {
  const sendEmails = await getEventsForToday("send_email");
  const slackMessages = await getEventsForToday("send_slack_message");
  const readMessages = await getEventsForToday("read_slack_messages");

  // Set targets to prioritize reading messages
  const targetSlackReads = 10; // Check messages frequently
  const targetSlackMessages = 5;
  const targetEmails = 1;

  const systemPrompt = `Provide a status update in the following exact format:
  1. Start with "I have completed X goal(s) for today."
  2. Then state "I still need to complete Y other goals, including [list remaining tasks]."
  3. End with "I have read [R] messages, sent [M] Slack messages, and [N] emails."

  Evaluate current progress against these goals:
  - Message reading goal: ${targetSlackReads} (current: ${readMessages.length})
  - Slack messages goal: ${targetSlackMessages} (current: ${slackMessages.length})
  - Emails goal: ${targetEmails} (current: ${sendEmails.length})`;

  const currentStateOfExecution = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [{ role: "system", content: systemPrompt }],
    max_tokens: 200, // Keep token limit efficient
    temperature: 0.5, // Consistent output
  });
  
  return currentStateOfExecution.choices[0].message.content || "";
};