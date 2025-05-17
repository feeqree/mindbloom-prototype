
import { config } from 'dotenv';
config();

import '@/ai/flows/speech-to-text-analysis.ts';
import '@/ai/flows/mental-health-chat-flow.ts';
import '@/ai/flows/score-insight-flow.ts'; // Register the new flow
import '@/ai/tools/appNavigationTool.ts'; // Ensure tools are part of the build/dev process if needed by Genkit
