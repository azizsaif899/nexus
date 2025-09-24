
import { https } from 'firebase-functions';
import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

export const geminiChat = async (message: string): Promise<string> => {

  const ai = genkit({
    plugins: [googleAI()],
    model: 'gemini-pro',
  });

  const response = await ai.model.generateContent(message);
  return response.text();
};

