import type { RunManifest, ArticleDraft, ClaimLedger, VerificationReport } from '../types';

export interface VerifyDraftInput {
  manifest: RunManifest;
  draft: ArticleDraft;
  claimLedger: ClaimLedger;
}

export interface VerifyDraftOutput {
  manifest: RunManifest;
  report: VerificationReport;
}

/**
 * Runs the verifier agent over the draft and claim ledger to produce a VerificationReport.
 * Verification is claim-level: it checks traceability, type correctness, and consistency.
 * Does not check structure or formatting — that is linting's job.
 *
 * Verifier responsibilities:
 *   - claim traceability (every claim in the draft exists in the ledger)
 *   - unsupported claims (claims in the draft not backed by evidence chain)
 *   - claim-type violations (e.g. interpretive claim in a sourced-only section)
 *   - terminology drift (key terms used inconsistently across sections)
 *   - comparison mismatch (a Vercel claim attributed to Cloudflare or vice versa)
 */
export async function verifyDraft(input: VerifyDraftInput): Promise<VerifyDraftOutput> {
  // TODO: invoke verifier agent (src/agents/verifier.ts) with draft and claim ledger
  // TODO: for each claim asserted in each section:
  //         - confirm the claimId exists in the ledger
  //         - confirm the claim type matches the section's allowedClaimTypes
  //         - confirm traceability chain is intact
  // TODO: check terminology consistency against styleProfile.preferredTerminology
  // TODO: check for subject/attribution mismatches (vercel vs cloudflare)
  // TODO: build VerificationReport, set passed = no error-severity issues
  // TODO: store report, update manifest artifactRefs
  throw new Error('Not implemented: verifyDraft');
}
