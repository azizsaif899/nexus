'use server';

import {
  generateConflictPreventionRules,
  GenerateConflictPreventionRulesInput,
} from '@/app/dashboard/ai/generate-conflict-prevention-rules';
import {
  suggestDependencyFirewallRules,
  SuggestDependencyFirewallRulesInput,
} from '@/app/dashboard/ai/suggest-dependency-firewall-rules';

export async function handleGenerateConflictPreventionRules(
  input: GenerateConflictPreventionRulesInput,
) {
  try {
    const result = await generateConflictPreventionRules(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate rules.' };
  }
}

export async function handleSuggestDependencyFirewallRules(
  input: SuggestDependencyFirewallRulesInput,
) {
  try {
    const result = await suggestDependencyFirewallRules(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to suggest rules.' };
  }
}
