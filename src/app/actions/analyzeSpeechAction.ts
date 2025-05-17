
'use server';
import { analyzeSpeech, type AnalyzeSpeechInput, type AnalyzeSpeechOutput } from '@/ai/flows/speech-to-text-analysis';

const defaultErrorOutputAction: AnalyzeSpeechOutput = {
    transcript: "Error: Speech analysis failed to produce a transcript.",
    emotions: ["error"],
    keywords: ["error"],
    summary: "Error: Speech analysis failed to produce a summary due to an internal action error."
};

export async function handleSpeechAnalysis(input: AnalyzeSpeechInput): Promise<AnalyzeSpeechOutput> {
  try {
    const result = await analyzeSpeech(input);
    if (!result || typeof result.transcript !== 'string' || !Array.isArray(result.emotions) || !Array.isArray(result.keywords) || typeof result.summary !== 'string') {
        console.error("AI analysis action: received incomplete or malformed data from the flow:", result);
        return { 
            transcript: result?.transcript || defaultErrorOutputAction.transcript,
            emotions: Array.isArray(result?.emotions) ? result.emotions : defaultErrorOutputAction.emotions,
            keywords: Array.isArray(result?.keywords) ? result.keywords : defaultErrorOutputAction.keywords,
            summary: result?.summary || defaultErrorOutputAction.summary
        };
    }
    // Ensure keywords and emotions are arrays, even if somehow they are not after flow processing
    const keywordsArray = Array.isArray(result.keywords) ? result.keywords : (typeof result.keywords === 'string' ? [result.keywords] : []);
    const emotionsArray = Array.isArray(result.emotions) ? result.emotions : (typeof result.emotions === 'string' ? [result.emotions] : []);

    return {
        ...result,
        keywords: keywordsArray,
        emotions: emotionsArray,
    };
  } catch (error: any) {
    console.error("Error in speech analysis server action:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during speech analysis.";
    return {
        transcript: `Failed to analyze speech: ${errorMessage}`,
        emotions: ["action error"],
        keywords: ["action error"],
        summary: `Analysis was unsuccessful due to an internal error in the action: ${errorMessage}`
    };
  }
}

