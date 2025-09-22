'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven suggestions for campaign optimization.
 *
 * It includes the following:
 * - `getCampaignOptimizationSuggestions`: An async function that takes campaign data and returns optimization suggestions.
 * - `CampaignOptimizationInput`: The input type for the `getCampaignOptimizationSuggestions` function.
 * - `CampaignOptimizationOutput`: The output type for the `getCampaignOptimizationSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignOptimizationInputSchema = z.object({
  campaignData: z
    .string()
    .describe('The data of the campaign, including performance metrics.'),
  targetAudience: z
    .string()
    .describe('Description of the target audience for the campaign.'),
  campaignGoals: z.string().describe('The goals of the marketing campaign.'),
  currentPlatformAllocation: z
    .string()
    .describe('The current allocation of the campaign across different platforms.'),
});
export type CampaignOptimizationInput = z.infer<typeof CampaignOptimizationInputSchema>;

const CampaignOptimizationOutputSchema = z.object({
  optimalEngagementTimes: z
    .string()
    .describe('Suggested optimal times to engage with the target audience.'),
  contentVariations: z
    .string()
    .describe('AI-driven suggestions for content variations to improve engagement.'),
  platformAllocationSuggestions: z
    .string()
    .describe('Suggestions for allocating the campaign budget across different platforms.'),
});
export type CampaignOptimizationOutput = z.infer<typeof CampaignOptimizationOutputSchema>;

export async function getCampaignOptimizationSuggestions(
  input: CampaignOptimizationInput
): Promise<CampaignOptimizationOutput> {
  return campaignOptimizationFlow(input);
}

const campaignOptimizationPrompt = ai.definePrompt({
  name: 'campaignOptimizationPrompt',
  input: {schema: CampaignOptimizationInputSchema},
  output: {schema: CampaignOptimizationOutputSchema},
  prompt: `You are an AI-powered marketing assistant that provides campaign optimization suggestions.

  Based on the following campaign data, target audience, campaign goals, and current platform allocation, provide suggestions for optimal engagement times, content variations, and platform allocation.

  Campaign Data: {{{campaignData}}}
  Target Audience: {{{targetAudience}}}
  Campaign Goals: {{{campaignGoals}}}
  Current Platform Allocation: {{{currentPlatformAllocation}}}

  Provide your suggestions in a clear and concise manner.

  Optimal Engagement Times: 
  Content Variations: 
  Platform Allocation Suggestions:
  `,
});

const campaignOptimizationFlow = ai.defineFlow(
  {
    name: 'campaignOptimizationFlow',
    inputSchema: CampaignOptimizationInputSchema,
    outputSchema: CampaignOptimizationOutputSchema,
  },
  async input => {
    const {output} = await campaignOptimizationPrompt(input);
    return output!;
  }
);
