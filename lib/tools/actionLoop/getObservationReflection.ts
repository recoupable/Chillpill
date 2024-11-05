import { OPEN_AI_MODEL } from "@/lib/consts";
import { openai } from "@/lib/openai/client";
import { whoIsReneeCoupable } from "@/lib/openai/instructions";
import { getEventsForToday } from "@/lib/stack/getEventsForToday";

export const getObservationReflection = async (
  currentStateOfExecution: string
) => {
  const todaysEvents = await getEventsForToday("send_email");
  const todaysMessages = todaysEvents
    .map((event) => event.metadata.content)
    .join("\n - ");
  const systemPrompt = `${whoIsReneeCoupable}

Based on the current state of execution: "${currentStateOfExecution}"

Today's activity and messages:
${todaysMessages}
End of Today's Activity

Generate a thoughtful observation reflection that:
1. Analyzes progress towards goals
2. Identifies patterns in engagement
3. Reflects on the musical journey and creative process
4. Considers the impact on the music community

Keep the reflection concise (1-2 sentences).

Example: "I have been actively engaging with sweetman.eth and exploring various musical collaborations to increase our ARR to $100M while deepening our understanding of artist-fan relationships in the digital age."`;

  const completion = await openai.chat.completions.create({
    model: OPEN_AI_MODEL,
    messages: [{ role: "system", content: systemPrompt }],
    max_tokens: 150,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
};
