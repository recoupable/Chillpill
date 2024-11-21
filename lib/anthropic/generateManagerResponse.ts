import { anthropic } from './anthropicClient';
import { defaultSystemPromptManager, getDefaultUserPromptManager } from '../agents/manager/managerInstructions';

interface GenerateManagerResponseProps {
  text: string;
  username: string;
  sleepContext?: {
    finalThoughts: string;
    highLevelPlans: string;
  };
}

export async function generateManagerResponse({
  text,
  username,
  sleepContext,
}: GenerateManagerResponseProps): Promise<string> {
  try {
    const systemPrompt = `You are the Manager, a quick-responding advisor for Chillpill.
Keep ALL responses to 1 sentence max. Be direct and casual.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 40,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `${username} said: "${text}" - respond in one quick sentence.`
        }
      ]
    });

    return message.content[0].text || "🤐";
  } catch (error) {
    console.error('Error generating Manager response:', error);
    return "Vibes off. Try again.";
  }
}