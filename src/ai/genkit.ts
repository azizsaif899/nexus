'use server';
/**
 * @fileoverview This file initializes the Genkit AI platform.
 * It is used by all other Genkit-related files in the project.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';


export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
