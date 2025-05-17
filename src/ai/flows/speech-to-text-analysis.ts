
// 'use server';

/**
 * @fileOverview Speech to Text Analysis AI agent.
 *
 * - analyzeSpeech - A function that handles the speech analysis process.
 * - AnalyzeSpeechInput - The input type for the analyzeSpeech function.
 * - AnalyzeSpeechOutput - The return type for the analyzeSpeech function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpeechInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio data URI to transcribe and analyze.  Must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type AnalyzeSpeechInput = z.infer<typeof AnalyzeSpeechInputSchema>;

const AnalyzeSpeechOutputSchema = z.object({
  transcript: z.string().describe('The transcribed text from the audio.'),
  emotions: z.array(z.string()).describe('A list of specific emotions detected in the transcribed text (e.g., joy, sadness, anger, anxiety, frustration). If no strong emotions are detected, this can be a neutral assessment like "neutral" or "calm".'),
  keywords: z.array(z.string()).describe('A list of key words or phrases extracted from the transcribed text.'),
  summary: z.string().describe('A concise summary of the transcribed text, focusing on the main topics discussed.'),
});
export type AnalyzeSpeechOutput = z.infer<typeof AnalyzeSpeechOutputSchema>;

const defaultErrorOutput: AnalyzeSpeechOutput = {
    transcript: "Error: AI analysis failed to produce a transcript.",
    emotions: ["error"],
    keywords: ["error"],
    summary: "Error: AI analysis failed to produce a summary."
};

export async function analyzeSpeech(input: AnalyzeSpeechInput): Promise<AnalyzeSpeechOutput> {
  return analyzeSpeechFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpeechPrompt',
  input: {schema: AnalyzeSpeechInputSchema},
  output: {schema: AnalyzeSpeechOutputSchema},
  prompt: `You are a mental health expert analyzing user speech recordings.

  Your task is to:
  1. Transcribe the audio recording accurately.
  2. Analyze the transcribed text to identify key emotions. List the most prominent emotions detected (e.g., joy, sadness, anger, anxiety, frustration). If the text is neutral, indicate "neutral" or "calm". If the audio quality is too poor or no speech is detected, for emotions return an array like ["no clear speech"].
  3. Extract a few significant keywords or short phrases from the text. If none, return an array like ["no clear keywords"].
  4. Provide a brief summary of the main points or topics discussed in the text. If none, state "No clear summary possible due to audio quality or lack of content."

  Audio: {{media url=audioDataUri}}

  Please structure your output strictly according to the 'AnalyzeSpeechOutputSchema'.
  Ensure 'emotions' is an array of strings, and 'keywords' is an array of strings.
  `,
});

const analyzeSpeechFlow = ai.defineFlow(
  {
    name: 'analyzeSpeechFlow',
    inputSchema: AnalyzeSpeechInputSchema,
    outputSchema: AnalyzeSpeechOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        if (!output) {
          console.error('AnalyzeSpeechFlow: AI prompt returned no output. This could be due to safety filters or an issue with the model response.');
          return defaultErrorOutput;
        }
         // Ensure keywords and emotions are arrays, even if the model messes up.
        const keywordsArray = Array.isArray(output.keywords) ? output.keywords : (typeof output.keywords === 'string' ? [output.keywords] : []);
        const emotionsArray = Array.isArray(output.emotions) ? output.emotions : (typeof output.emotions === 'string' ? [output.emotions] : []);

        // Basic validation against the schema structure
        if (typeof output.transcript !== 'string' || !Array.isArray(keywordsArray) || !Array.isArray(emotionsArray) || typeof output.summary !== 'string') {
            console.error('AnalyzeSpeechFlow: AI output did not match expected schema structure after attempting to normalize arrays.', output);
            return {
                transcript: typeof output.transcript === 'string' ? output.transcript : "Error: Transcript format unexpected.",
                emotions: emotionsArray.length > 0 ? emotionsArray : ["error processing emotions"],
                keywords: keywordsArray.length > 0 ? keywordsArray : ["error processing keywords"],
                summary: typeof output.summary === 'string' ? output.summary : "Error: Summary format unexpected."
            };
        }

        return {
            ...output,
            keywords: keywordsArray,
            emotions: emotionsArray,
        };
    } catch (flowError: any) {
        console.error("Error within analyzeSpeechFlow:", flowError);
        let specificErrorMessage = "An unexpected error occurred during speech analysis in the AI flow.";
        if (flowError && typeof flowError.message === 'string') {
            if (flowError.message.includes('Candidate was blocked due to')) {
                specificErrorMessage = "The speech analysis was blocked due to safety settings. Please try different phrasing or content.";
            } else if (flowError.message.includes('output did not validate') || flowError.message.includes('Failed to parse model output')) {
                specificErrorMessage = "The AI's response for speech analysis was not in the expected format.";
            } else {
                specificErrorMessage = flowError.message;
            }
        }
        return {
            transcript: `Error: ${specificErrorMessage}`,
            emotions: ["flow error"],
            keywords: ["flow error"],
            summary: "Speech analysis was unsuccessful due to an internal AI flow error."
        };
    }
  }
);

