import { OPEN_AI_MODEL } from "@/lib/consts";
import { openai } from "@/lib/openai/client";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export const getCurrentStateOfExecution = async () => {
  const sendEmails = await getEventsForToday("send_email");
  const slackMessages = await getEventsForToday("send_slack_message");

  const targetSlackMessages = 111;
  const targetEmails = 11;

  const systemPrompt = `Reply with the current state of execution in this EXACT format:
  1. Start with "I have completed X goal(s) for today"
  2. Then state "I still need to complete Y other goals, including [list remaining tasks]"
  3. End with "I have sent [N] emails and [M] slack messages"

  Compare the current progress against these goals and mark as complete ONLY if the current value meets or exceeds the goal:
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
  
  Example output: I have completed 1 goal for today. I still need to complete 1 other goal, including sending 3 more emails. I have sent 8 emails and 2 slack messages.`;

  const currentStateOfExecution = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [{ role: "system", content: systemPrompt }],
    max_completion_tokens: 1111,
  });
  return currentStateOfExecution.choices[0].message.content || "";
};
