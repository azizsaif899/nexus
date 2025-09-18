'use server';
/**
 * @fileoverview This file initializes the Genkit AI platform.
 * It is used by all other Genkit-related files in the project.
 */
import { genkit, googleAI } from 'genkit';
import { NextjsPlugin } from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI(),
    NextjsPlugin(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
