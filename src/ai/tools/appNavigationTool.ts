
'use server';
/**
 * @fileOverview Defines tools for app navigation assistance within AI flows.
 *
 * - getBreathingExerciseInfoTool - A tool that provides a standard message for offering the breathing exercise.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const getBreathingExerciseInfoTool = ai.defineTool(
  {
    name: 'getBreathingExerciseInfoTool',
    description:
      'Used when the user has expressed interest in a breathing exercise. Returns a standard message to introduce the breathing exercise guidance.',
    inputSchema: z.object({}).optional(), // No specific input needed from the AI for this version
    outputSchema: z.object({
      confirmationMessage: z.string().describe("A preparatory message to be relayed to the user before listing breathing exercise steps. Example: 'Okay, I can help with that. Here is a simple breathing exercise you can try.'"),
    }),
  },
  async () => {
    // In a more complex scenario, this tool could fetch dynamic info.
    // For now, it returns a static confirmation.
    return {
      confirmationMessage: "Okay, that's a great idea. Taking a moment to focus on your breath can be very helpful. Here's a simple 1-minute breathing exercise you can try:",
    };
  }
);
