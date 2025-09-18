'use server';
/**
 * @fileOverview Generates ESLint rules, TypeScript path mappings, and environment variable prefixes to prevent naming conflicts between projects.
 *
 * - generateConflictPreventionRules - A function that generates conflict prevention rules.
 * - GenerateConflictPreventionRulesInput - The input type for the generateConflictPreventionRules function.
 * - GenerateConflictPreventionRulesOutput - The return type of the generateConflictPreventionRules function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateConflictPreventionRulesInputSchema = z.object({
  projectName: z
    .string()
    .describe(
      'The name of the project for which to generate conflict prevention rules.',
    ),
  projectType: z
    .string()
    .describe('The type of the project (e.g., application, library).'),
  projectScope: z
    .string()
    .describe('The scope of the project (e.g., shared, nexux).'),
});
export type GenerateConflictPreventionRulesInput = z.infer<
  typeof GenerateConflictPreventionRulesInputSchema
>;

const GenerateConflictPreventionRulesOutputSchema = z.object({
  eslintRules: z
    .string()
    .describe(
      'Generated ESLint rules to enforce module boundaries and naming conventions.',
    ),
  typescriptPathMappings: z
    .string()
    .describe(
      'Generated TypeScript path mappings to ensure proper module resolution.',
    ),
  environmentVariablePrefix: z
    .string()
    .describe(
      'Generated environment variable prefix to avoid naming conflicts with other projects.',
    ),
});
export type GenerateConflictPreventionRulesOutput = z.infer<
  typeof GenerateConflictPreventionRulesOutputSchema
>;

export async function generateConflictPreventionRules(
  input: GenerateConflictPreventionRulesInput,
): Promise<GenerateConflictPreventionRulesOutput> {
  return generateConflictPreventionRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConflictPreventionRulesPrompt',
  input: { schema: GenerateConflictPreventionRulesInputSchema },
  output: { schema: GenerateConflictPreventionRulesOutputSchema },
  prompt: `You are an expert in Nx workspace configuration and project isolation.

  Based on the provided project information, generate ESLint rules, TypeScript path mappings, and an environment variable prefix to prevent naming conflicts with other projects in the workspace.

  Project Name: {{{projectName}}}
  Project Type: {{{projectType}}}
  Project Scope: {{{projectScope}}}

  ESLint Rules:
  - Enforce module boundaries to prevent the project from depending on other projects outside its scope.
  - Enforce naming conventions for variables, CSS classes, and other artifacts to avoid collisions.

  TypeScript Path Mappings:
  - Create path mappings that alias the project's modules to prevent naming conflicts with other modules.

  Environment Variable Prefix:
  - Generate a unique prefix for the project's environment variables to avoid collisions with other environment variables.

  Output the rules and prefix in a format that can be easily copied and pasted into the project's configuration files.

  Example Output (Do NOT include this in your output):
  {
    "eslintRules": "{
      \"@nx/enforce-module-boundaries\": [
        \"error\",
        {
          \"allow\": [\"@nexux/*\", \"@shared/*\"],
          \"depConstraints\": [
            {
              \"sourceTag\": \"scope:nexux\",
              \"onlyDependOnLibsWithTags\": [\"scope:shared\", \"scope:nexux\"]
            }
          ]
        }
      ]
    }",
    "typescriptPathMappings": "{
      \"@nexux/*\": [\"apps/nexux/src/*\"]
    }",
    "environmentVariablePrefix": \"NEXUX_\"
  }
  `,
});

const generateConflictPreventionRulesFlow = ai.defineFlow(
  {
    name: 'generateConflictPreventionRulesFlow',
    inputSchema: GenerateConflictPreventionRulesInputSchema,
    outputSchema: GenerateConflictPreventionRulesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
