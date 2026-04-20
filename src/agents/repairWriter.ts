import type {
  ArticleDraft,
  ClaimLedger,
  VerificationIssue,
  LintIssue,
  PatchRequest,
} from '../types';
import type { PatchStrategy } from '../types/core';

/**
 * Repair writer role: produces targeted PatchRequests to fix specific issues.
 *
 * Reasoning responsibility:
 *   - understand the root cause of each issue
 *   - generate the minimal content change that fixes the issue
 *   - prefer the smallest patch scope (span > paragraph > section)
 *   - ensure the fix does not introduce new issues
 *   - for claim-traceability issues, also propose adding or updating claims in the ledger
 *
 * The repair writer is not a rewriter. It operates on specific, named targets.
 * It does not produce whole-article rewrites.
 */

export interface RepairWriterInput {
  draft: ArticleDraft;
  claimLedger: ClaimLedger;
  verificationIssues: VerificationIssue[];
  lintIssues: LintIssue[];
  strategy: PatchStrategy;
  runId: string;
  iterationNumber: number;
}

// TODO: design a repair writer prompt that accepts a single issue and returns a PatchRequest
// TODO: for span_patch: prompt must identify the exact text span to replace
// TODO: for paragraph_patch: prompt must identify the paragraph index (0-based) and new content
// TODO: for section_rewrite: prompt gets full section context and all related claims
// TODO: instruct repair writer to cite which claimIds the new content supports
// TODO: validate that proposed newContent does not introduce banned phrases
export async function runRepairWriter(input: RepairWriterInput): Promise<PatchRequest[]> {
  throw new Error('Not implemented: repairWriter agent');
}

export const REPAIR_WRITER_PROMPT_TEMPLATE = `
You are a surgical content repair writer.

Issue to fix:
{{issue}}

Current section content:
{{sectionContent}}

Repair strategy: {{strategy}}

Instructions:
- Fix only the identified issue. Do not change surrounding content.
- If strategy is span_patch: identify the specific text span and provide replacement text.
- If strategy is paragraph_patch: identify the paragraph index and provide a full replacement paragraph.
- If strategy is section_rewrite: provide a complete new section that fixes all issues in this section.

Constraints:
- All factual claims must exist in the claim ledger.
- Do not use banned phrases: {{bannedPhrases}}
- Match the voice: {{voice}}

Return a JSON PatchRequest object.
`.trim();
