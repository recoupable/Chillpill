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
    let systemPrompt = defaultSystemPromptManager;
    
    if (sleepContext) {
      systemPrompt += `\nRecent thoughts: ${sleepContext.finalThoughts}\nCurrent plans: ${sleepContext.highLevelPlans}`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: getDefaultUserPromptManager(username, text)
        }
      ]
    });

    return message.content[0].text || "🤐";
  } catch (error) {
    console.error('Error generating Manager response:', error);
    return "Vibes off. Try again.";
  }
}