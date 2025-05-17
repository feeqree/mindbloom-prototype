
'use server';
import { chatWithAI, type MentalHealthChatInput, type MentalHealthChatOutput } from '@/ai/flows/mental-health-chat-flow';

export async function handleAIChat(input: MentalHealthChatInput): Promise<MentalHealthChatOutput> {
  try {
    const result = await chatWithAI(input);
    if (!result || !result.aiResponse) {
        // This case might happen if the AI returns an empty or malformed response.
        return { aiResponse: "I'm having a bit of trouble formulating a response right now. Could you try again?" };
    }
    return result;
  } catch (error) {
    console.error("Error in AI chat action:", error);
    // For the user, give a generic error, but log the specific one.
    // Avoid exposing internal error details to the client.
    const displayMessage = error instanceof Error ? 
      "I encountered an issue and can't respond right now. Please try again later." :
      "An unknown error occurred and I can't respond right now.";
    return { aiResponse: displayMessage };
  }
}
