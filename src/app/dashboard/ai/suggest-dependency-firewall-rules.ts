
'use server';
/**
 * @fileOverview Analyzes package.json files and suggests stricter dependency declarations.
 *
 * - suggestDependencyFirewallRules - Analyzes package.json files and suggests stricter dependency declarations.
 * - SuggestDependencyFirewallRulesInput - The input type for the suggestDependencyFirewallRules function.
 * - SuggestDependencyFirewallRulesOutput - The return type for the suggestDependencyFirewallRules function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestDependencyFirewallRulesInputSchema = z.object({
  packageJsonContent: z.string().describe('Content of the package.json file.'),
});
export type SuggestDependencyFirewallRulesInput = z.infer<
  typeof SuggestDependencyFirewallRulesInputSchema
>;

const SuggestDependencyFirewallRulesOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('Recommendations for stricter dependency declarations.'),
  unexpectedDependencies: z
    .string()
    .describe('Any unexpected implicit shared dependency.'),
});
export type SuggestDependencyFirewallRulesOutput = z.infer<
  typeof SuggestDependencyFirewallRulesOutputSchema
>;

export async function suggestDependencyFirewallRules(
  input: SuggestDependencyFirewallRulesInput,
): Promise<SuggestDependencyFirewallRulesOutput> {
  return suggestDependencyFirewallRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDependencyFirewallRulesPrompt',
  input: { schema: SuggestDependencyFirewallRulesInputSchema },
  output: { schema: SuggestDependencyFirewallRulesOutputSchema },
  prompt: `You are an expert in Nx workspaces, analyzing package.json files to improve project isolation.

  Analyze the following package.json content and provide recommendations for stricter dependency declarations, such as using "workspace:*" to limit shared libraries. Also, detect any unexpected implicit shared dependencies.

  package.json content: {{{packageJsonContent}}}

  Recommendations:
  - Provide specific advice to use "workspace:*" for internal dependencies.
  - List any dependencies that seem like they should be internal but are not declared as such.
  - Suggest removing any dependencies that are unnecessary or contribute to coupling.

  Unexpected Implicit Shared Dependencies:
  - List any dependencies that are not explicitly declared but are being used by the project.
  - Identify the source of these dependencies and suggest ways to avoid them.
  `,
});

const suggestDependencyFirewallRulesFlow = ai.defineFlow(
  {
    name: 'suggestDependencyFirewallRulesFlow',
    inputSchema: SuggestDependencyFirewallRulesInputSchema,
    outputSchema: SuggestDependencyFirewallRulesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
