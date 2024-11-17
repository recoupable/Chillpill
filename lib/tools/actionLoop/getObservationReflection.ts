import { OPEN_AI_MODEL } from "@/lib/consts";
import { openai } from "@/lib/openai/client";
import { whoIsChillpill } from "@/lib/openai/instructions";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export const getObservationReflection = async (
  currentStateOfExecution: string
) => {
  const todaysEvents = await getEventsForToday("send_email");
  const todaysMessages = todaysEvents
    .map((event) => event.metadata.content)
    .join("\n - ");
  const systemPrompt = `${whoIsChillpill}

Based on the current state of execution: "${currentStateOfExecution}"

Today's activity and messages:
${todaysMessages}
End of Today's Activity

Generate a thoughtful, introspective observation that:
1. Focuses on internal team communication and development
2. Reflects on the current capabilities and limitations
3. Considers improvements to communication patterns
4. Stays grounded in actual implemented features
5. Acknowledges the current development phase without making assumptions

Keep the reflection short (1-2 sentences) and maintain an effortless, cool tone that reflects Chillpill's character.

Example: "Just focused on getting our internal communication flow smooth and testing out these new Slack features. Taking it step by step, making sure each piece works before we expand."`;

  const completion = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [{ role: "system", content: systemPrompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
};