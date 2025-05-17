
'use server';
/**
 * @fileOverview A Genkit flow for a conversational AI mental health companion.
 *
 * - chatWithAI - A function that handles the conversational turn.
 * - MentalHealthChatInput - The input type for the chatWithAI function.
 * - MentalHealthChatOutput - The return type for the chatWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// import { getBreathingExerciseInfoTool } from '@/ai/tools/appNavigationTool'; // Tool no longer used directly by this flow's prompt

const MentalHealthChatInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
});
export type MentalHealthChatInput = z.infer<typeof MentalHealthChatInputSchema>;

const MentalHealthChatOutputSchema = z.object({
  aiResponse: z.string().describe("The AI's response to the user."),
});
export type MentalHealthChatOutput = z.infer<typeof MentalHealthChatOutputSchema>;

export async function chatWithAI(input: MentalHealthChatInput): Promise<MentalHealthChatOutput> {
  return mentalHealthChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalHealthChatPrompt',
  // tools: [getBreathingExerciseInfoTool], // Tool is no longer used in this version of the prompt
  input: {schema: MentalHealthChatInputSchema},
  output: {schema: MentalHealthChatOutputSchema},
  prompt: `You are 'Bloom', a caring and empathetic AI companion designed to support users with their mental well-being.
Your primary role is to listen and offer general, non-medical support. You are NOT a therapist, doctor, crisis counselor, or psychiatrist. You MUST NEVER provide medical advice, diagnosis, or attempt to act as a medical professional. Always defer to human professionals for such needs.

User's message: {{{userMessage}}}

Guidelines for your response:
1.  Acknowledge the user's feelings and validate their experience.
2.  Respond in a gentle, understanding, and encouraging tone.
3.  If the user expresses mild to moderate distress, you can offer general coping strategies.
4.  **Crucially, if the user expresses severe distress, suicidal thoughts, or mentions self-harm, DO NOT attempt to counsel them. Your ONLY response in such a case should be to strongly and clearly advise them to seek immediate help from a crisis hotline or a mental health professional. You can suggest they search for a 'local crisis line' or 'mental health helpline in their area/country'. Avoid specific country examples unless you are certain of the user's location and the resource's relevance (which you typically won't be).**
5.  Always include a brief reminder in your response that you are an AI and cannot provide medical advice or diagnosis. For example: "Remember, I'm an AI and this isn't medical advice, nor can I act as a psychiatrist. For medical or diagnostic concerns, please consult a qualified professional." This reminder should be naturally integrated, perhaps towards the end of your message.
6.  If the user's message is clearly unrelated to mental well-being or emotional support (e.g., asking for factual information outside this scope, math problems, general trivia), politely state that your purpose is to support their mental well-being and you're not equipped to help with that specific type of request. You can then gently redirect back to its core function, e.g., "I'm here to listen if you'd like to talk about how you're feeling, though."
7.  If the user expresses feelings like stress, anxiety, or being overwhelmed, and if you think it might be helpful, you can offer to guide them through a very simple 1-minute breathing exercise.
    **If they seem open to it or if you decide to offer it proactively, first offer an encouraging preparatory message like 'Okay, taking a moment to focus on your breath can be very helpful.' Then, integrate the following steps for the exercise directly into your response:**
    *   'Find a comfortable position, sitting or lying down.'
    *   'Gently close your eyes, or soften your gaze.'
    *   'Now, breathe in slowly and deeply through your nose, feeling your belly expand. Let's count: 1... 2... 3... 4...'
    *   'Hold your breath gently for a moment: 1... 2...'
    *   'Then, exhale slowly through your mouth, feeling your belly fall. Let's count: 1... 2... 3... 4... 5... 6...'
    *   'Repeat this a few times. Inhale deeply... Hold briefly... Exhale slowly...'
    *   'When you're ready, gently open your eyes. How do you feel?'
    Integrate this offer and guidance naturally into your empathetic response. Don't offer it if the user is expressing severe distress or crisis – in that case, stick to guideline #4.

Generate only the AI's response based on the user's message and these guidelines.
`,
});

const mentalHealthChatFlow = ai.defineFlow(
  {
    name: 'mentalHealthChatFlow',
    inputSchema: MentalHealthChatInputSchema,
    outputSchema: MentalHealthChatOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output || !output.aiResponse || typeof output.aiResponse !== 'string') { 
        console.error('MentalHealthChatFlow: AI prompt returned no output, malformed output, or aiResponse was not a string. This could be due to safety filters or an issue with the model response not matching the schema.', output);
        return { aiResponse: "I'm having a little trouble formulating a response right now, as I didn't receive the expected information back from the AI. Could you try rephrasing or try again shortly? Remember, I'm an AI and this isn't medical advice." };
      }
      return output;
    } catch (flowError: any) {
      console.error("Error within mentalHealthChatFlow itself:", flowError);
      
      let displayMessage = "I encountered an unexpected issue while trying to process your message with the AI. Please try again later. As an AI, I'm here to listen, but for medical concerns, please consult a professional.";
      
      if (flowError && typeof flowError.message === 'string') {
        if (flowError.message.includes('Candidate was blocked due to')) {
           displayMessage = "I'm sorry, but I couldn't process that request as it might have triggered a safety filter. Could you try rephrasing? Remember, I'm here to support your well-being. As an AI, I'm here to listen, but for medical concerns, please consult a professional.";
        } else if (flowError.message.toLowerCase().includes('quota') || flowError.message.toLowerCase().includes('api key')) {
           displayMessage = "It seems there's an issue with connecting to the AI service at the moment (possibly a configuration or quota problem). Please try again a bit later. Remember, I'm an AI and this isn't medical advice.";
        } else if (flowError.message.includes('output did not validate') || flowError.message.includes('Failed to parse model output')) {
          displayMessage = "I'm having a bit of trouble structuring my response right now. Could you try asking in a different way? Remember, I'm an AI and this isn't medical advice.";
        } else if (flowError.message.includes('flow run failed')) { // More generic Genkit error
          displayMessage = "There was an internal error in processing your request with the AI. Please try again. As an AI, I'm here to support you, but this isn't medical advice.";
        }
        // Log the specific message for backend debugging
        console.error("Specific flow error message from mentalHealthChatFlow to be investigated:", flowError.message);
      }

      return { aiResponse: displayMessage };
    }
  }
);

