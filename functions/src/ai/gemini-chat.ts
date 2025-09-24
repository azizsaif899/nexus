
import { https } from 'firebase-functions';
import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

const ai = genkit({
  plugins: [googleAI()],
  model: 'gemini-pro',
});

export const chatCompletion = https.onCall(async (data, context) => {
  const { message } = data;
  if (!context.auth) {
    throw new https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const response = await ai.model.generateContent(message);
  return { response: response.text() };
});
