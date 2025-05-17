
'use server';
import { getScoreInsight, type ScoreInsightInput, type ScoreInsightOutput } from '@/ai/flows/score-insight-flow';

export async function handleScoreInsight(input: ScoreInsightInput): Promise<ScoreInsightOutput> {
  try {
    const result = await getScoreInsight(input);
    if (!result || !result.insightMessage || typeof result.insightMessage !== 'string') {
        console.error("GetScoreInsightAction: AI flow returned no result or malformed insightMessage.", result);
        return { insightMessage: "Remember, self-awareness is a journey, and every insight counts." };
    }
    return result;
  } catch (error: any) {
    console.error("Error in getScoreInsightAction:", error);
    const userMessage = "It's always good to reflect. Keep taking care of yourself!";
    if (error && typeof error.message === 'string' && error.message.includes('output did not validate')) {
        // Potentially more specific message if it's a schema validation issue from the flow
        return { insightMessage: "Bloom tried to share a thought, but it wasn't quite structured right. Your reflection is valuable!" };
    }
    return { insightMessage: userMessage };
  }
}

