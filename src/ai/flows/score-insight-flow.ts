
'use server';
/**
 * @fileOverview A Genkit flow to generate a personalized insight based on a questionnaire score.
 *
 * - getScoreInsight - A function that returns a brief encouraging message.
 * - ScoreInsightInput - The input type for the getScoreInsight function.
 * - ScoreInsightOutput - The return type for the getScoreInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreInsightInputSchema = z.object({
  score: z.number().describe('The user\'s score from the questionnaire.'),
  totalPossibleScore: z.number().describe('The total possible score for the questionnaire.'),
});
export type ScoreInsightInput = z.infer<typeof ScoreInsightInputSchema>;

const ScoreInsightOutputSchema = z.object({
  insightMessage: z.string().describe("A short, empathetic, and encouraging insight based on the user's score."),
});
export type ScoreInsightOutput = z.infer<typeof ScoreInsightOutputSchema>;

export async function getScoreInsight(input: ScoreInsightInput): Promise<ScoreInsightOutput> {
  return scoreInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreInsightPrompt',
  input: {schema: ScoreInsightInputSchema},
  output: {schema: ScoreInsightOutputSchema},
  prompt: `You are 'Bloom', a caring and empathetic AI companion.
A user has just completed a mental well-being questionnaire. Their score is {{score}} out of a total possible {{totalPossibleScore}}.

Based on this score, provide a very short (1-2 sentences maximum), empathetic, and encouraging insight.
- If the score is low (e.g., less than 30% of totalPossibleScore), acknowledge their positive state.
- If the score is moderate (e.g., between 30% and 60% of totalPossibleScore), encourage continued self-awareness and self-care.
- If the score is high (e.g., more than 60% of totalPossibleScore), gently acknowledge their feelings and frame exploring support as a positive step.

Focus on being supportive and brief. Do not give medical advice.
Example for low score: "It's wonderful to see you're feeling quite balanced right now! Keep nurturing that well-being."
Example for moderate score: "Thanks for sharing how you're feeling. It's good to be aware. Remember, small steps in self-care can make a big difference."
Example for high score: "I hear you, and it's brave to acknowledge these feelings. Exploring support options is a sign of strength and self-care."

Generate only the insight message.
`,
});

const scoreInsightFlow = ai.defineFlow(
  {
    name: 'scoreInsightFlow',
    inputSchema: ScoreInsightInputSchema,
    outputSchema: ScoreInsightOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output || !output.insightMessage) {
        console.error('ScoreInsightFlow: AI prompt returned no output or malformed output (missing insightMessage). This could be due to safety filters or an issue with the model response.', output);
        return { insightMessage: "It's great that you're checking in with yourself. Every step towards understanding is valuable." };
      }
      return output;
    } catch (flowError: any) {
      console.error("Error within scoreInsightFlow:", flowError);
      let displayMessage = "Taking time for self-reflection is always a positive step.";
       if (flowError && typeof flowError.message === 'string') {
        if (flowError.message.includes('Candidate was blocked due to')) {
           displayMessage = "I had a thought to share, but it seems it wasn't quite right for this moment. Keep exploring what feels right for you!";
        } else if (flowError.message.includes('output did not validate')) {
          displayMessage = "I'm having a bit of trouble structuring my thoughts right now. Your self-reflection is what matters most!";
        }
      }
      return { insightMessage: displayMessage };
    }
  }
);

