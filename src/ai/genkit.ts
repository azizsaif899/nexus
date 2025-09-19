'use server';
/**
 * @fileoverview This file initializes the Genkit AI platform.
 * It is used by all other Genkit-related files in the project.
 */
import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// يتم استدعاء هذا مرة واحدة فقط في التطبيق
configureGenkit({
  plugins: [
    googleAI({
      // تعيين إصدارات API اختيارياً
      // apiVersion: 'v1'
    }),
  ],
  logLevel: 'debug', // عرض سجلات مفصلة للتصحيح
  enableTracingAndMetrics: true, // تفعيل التتبع والمقاييس للإنتاج
});

export const ai = genkit();
