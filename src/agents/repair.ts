import { llmCall } from '../lib/llm';

const SYSTEM = `You are a copy editor making surgical fixes to a markdown article.
You will receive the article and a lint report listing specific violations with line numbers.
Fix only the flagged violations. Do not rewrite sections that are not flagged.
Output the complete corrected article markdown only. No preamble, no commentary, no explanation — just the article.`;

export async function repair(draft: string, report: string): Promise<string> {
  return llmCall(
    SYSTEM,
    `LINT REPORT:\n\n${report}\n\n---\nARTICLE:\n\n${draft}\n\n---\nApply the fixes now.`,
    12000
  );
}
