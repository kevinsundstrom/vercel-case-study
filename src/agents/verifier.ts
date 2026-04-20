import type { ArticleDraft, ClaimLedger, VerificationReport } from '../types';

/**
 * Verifier role: checks claim traceability and consistency across the draft.
 *
 * Reasoning responsibility:
 *   - confirm every claimId in the draft exists in the ledger
 *   - confirm claim type matches the section's allowedClaimTypes
 *   - confirm sourced claims have evidence, derived have sourced parents
 *   - flag terminology drift (key terms used inconsistently)
 *   - flag comparison mismatches (Vercel claim attributed to Cloudflare, or vice versa)
 *
 * The verifier does not check structure, formatting, or word counts — that is linting.
 * The verifier works at the semantic/traceability level.
 */

export interface VerifierInput {
  draft: ArticleDraft;
  claimLedger: ClaimLedger;
  runId: string;
}

// TODO: design a verifier prompt focused on traceability chain validation
// TODO: consider rule-based (non-LLM) checks for claim existence and type matching
//        — these are structural and don't require reasoning
// TODO: use LLM only for: terminology drift, comparison mismatch, semantic consistency
// TODO: emit a VerificationIssue per violation with a clear description
export async function runVerifier(input: VerifierInput): Promise<VerificationReport> {
  throw new Error('Not implemented: verifier agent');
}

export const VERIFIER_PROMPT_TEMPLATE = `
You are a technical fact-checker verifying a comparison article.

Article draft:
{{draft}}

Claim ledger:
{{claimLedger}}

Check for:
1. Claims in the article not present in the ledger (unsupported_claim)
2. Inconsistent use of "Vercel Workflows" or "Cloudflare Workflows" as subjects
3. Terminology drift: e.g. "step function" used instead of "step-based workflow"
4. Any comparison claim that attributes a property to the wrong platform

Return a JSON array of verification issues.
`.trim();
