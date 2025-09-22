"use server";

import {
  getCampaignOptimizationSuggestions,
  type CampaignOptimizationInput,
  type CampaignOptimizationOutput,
} from "@/ai/flows/campaign-optimization-suggestions";

type ActionResult = {
  success: boolean;
  data?: CampaignOptimizationOutput;
  error?: string;
};

export async function getSuggestions(
  input: CampaignOptimizationInput
): Promise<ActionResult> {
  try {
    const suggestions = await getCampaignOptimizationSuggestions(input);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error(error);
    // In a real app, you'd want to log this error more robustly.
    return { success: false, error: "Failed to get suggestions. Please try again." };
  }
}
