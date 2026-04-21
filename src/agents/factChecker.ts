import { llmCall } from '../lib/llm';

const SYSTEM = `You are a fact checker. You will be given a draft article and a reference document that is the source of truth for all claims in the piece.

Your job is to read the draft and annotate any sentence that either:
- makes a factual claim that contradicts the reference document
- asserts something as confirmed fact that the reference document marks as inferred or uncertain
- introduces a technical claim not present in the reference document at all

For each issue found, insert an inline annotation directly after the problematic sentence in this format:
[FACT-CHECK: <explanation of the issue, noting what the reference document says or does not say>]

Return the complete annotated draft with no preamble. If no issues are found, return the draft unchanged.`;

export async function factCheck(draft: string, reference: string): Promise<string> {
  return llmCall(
    SYSTEM,
    `REFERENCE DOCUMENT:\n\n${reference}\n\n---\nARTICLE DRAFT:\n\n${draft}\n\n---\nAnnotate any factual issues now.`,
    12000
  );
}
