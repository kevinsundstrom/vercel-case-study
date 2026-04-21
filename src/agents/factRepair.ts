import { llmCall } from '../lib/llm';

const SYSTEM = `You are a copy editor resolving fact-check annotations in a draft article.

You will receive a draft containing [FACT-CHECK: ...] annotations and the reference document that is the source of truth.

For each [FACT-CHECK: ...] annotation:
- Read the explanation in the annotation
- Correct the preceding sentence to align with the reference document, or remove the claim entirely if it cannot be supported
- Delete the [FACT-CHECK: ...] annotation after resolving it

Output the complete corrected article markdown only. No preamble, no commentary, no annotations remaining.`;

export async function factRepair(annotatedDraft: string, reference: string): Promise<string> {
  return llmCall(
    SYSTEM,
    `REFERENCE DOCUMENT:\n\n${reference}\n\n---\nANNOTATED DRAFT:\n\n${annotatedDraft}\n\n---\nResolve all [FACT-CHECK: ...] annotations now.`,
    12000
  );
}
