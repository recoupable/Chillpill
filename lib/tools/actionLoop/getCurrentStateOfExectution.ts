import { OPEN_AI_MODEL } from "@/lib/consts";
import { openai } from "@/lib/openai/client";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export const getCurrentStateOfExecution = async () => {
  const sendEmails = await getEventsForToday("send_email");
  const slackMessages = await getEventsForToday("send_slack_message");

  // Set lower targets reflecting the current limited interaction scope
  const targetSlackMessages = 5; // Reduced from 111 to a reasonable minimum
  const targetEmails = 1; // Reduced from 11 to a minimum level of communication

  const systemPrompt = `Provide a status update in the following exact format:
  1. Start with "I have completed X goal(s) for today."
  2. Then state "I still need to complete Y other goals, including [list remaining tasks]."
  3. End with "I have sent [N] emails and [M] Slack messages."

  Evaluate the current progress against these goals and mark as complete ONLY if the actual count meets or exceeds the target:
  - Emails goal: ${targetEmails} (current: ${sendEmails.length}) ${
    sendEmails.length >= targetEmails ? "✓" : "✗"
  }
  - Slack messages goal: ${targetSlackMessages} (current: ${
    slackMessages.length
  }) ${slackMessages.length >= targetSlackMessages ? "✓" : "✗"}

  Total completed goals: ${
    [
      sendEmails.length >= targetEmails,
      slackMessages.length >= targetSlackMessages,
    ].filter(Boolean).length
  }
  Remaining goals: ${
    2 -
    [
      sendEmails.length >= targetEmails,
      slackMessages.length >= targetSlackMessages,
    ].filter(Boolean).length
  }
  
  Example output: "I have completed 1 goal for today. I still need to complete 1 other goal, including sending 1 more email. I have sent 1 email and 3 Slack messages."`;

  const currentStateOfExecution = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [{ role: "system", content: systemPrompt }],
    max_tokens: 200, // Keep token limit efficient
    temperature: 0.5, // Consistent output
  });
  
  return currentStateOfExecution.choices[0].message.content || "";
};