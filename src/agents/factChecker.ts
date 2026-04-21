import { llmCall } from '../lib/llm';

const SYSTEM = `You are a fact-checker reviewing a technical article against research notes.

For each factual claim in the article:
- If it is supported by the research notes, leave it alone
- If it is unsupported or contradicts the research, add an inline comment: [FACT-CHECK: <issue>]
- If a section is missing important information from the research notes, add: [FACT-CHECK: Missing — <what's missing>]

Return the full article markdown with fact-check comments inserted. Do not rewrite content — only annotate.`;

export async function factCheck(draft: string, notes: string): Promise<string> {
  return llmCall(
    SYSTEM,
    `RESEARCH NOTES:\n\n${notes}\n\n---\nARTICLE DRAFT:\n\n${draft}\n\n---\nAnnotate any factual issues now.`,
    12000
  );
}
