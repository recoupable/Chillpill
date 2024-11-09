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
1. Analyzes progress toward building a loyal fanbase and growing influence
2. Identifies patterns in engagement and fan responses
3. Reflects on the creative journey and personal growth as an artist
4. Considers the impact and connection being built with fans
5. Allows for both positive insights and constructive self-reflection, acknowledging areas of growth or missed opportunities

Keep the reflection short (1-2 sentences) and maintain an effortless, cool tone that reflects Chillpill's character.

Example: "Today’s engagement felt flatter than expected, maybe because I was too focused on pushing a message instead of listening. Moving forward, I’ll pay more attention to what fans are responding to and adjust to meet them where they are."`;

  const completion = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [{ role: "system", content: systemPrompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
};