import type {
  RunManifest,
  ArticleDraft,
  ClaimLedger,
  VerificationReport,
  LintReport,
  RepairPlan,
  PatchResponse,
} from '../types';

export interface RepairDraftInput {
  manifest: RunManifest;
  draft: ArticleDraft;
  claimLedger: ClaimLedger;
  verificationReport: VerificationReport;
  lintReport: LintReport;
  iterationNumber: number;
}

export interface RepairDraftOutput {
  manifest: RunManifest;
  repairedDraft: ArticleDraft;
  repairPlan: RepairPlan;
  patchResponse: PatchResponse;
}

/**
 * Builds a RepairPlan from the combined verification and lint issues, then applies patches
 * to produce a new ArticleDraft version. Uses the repairPolicy to choose strategy per issue.
 *
 * Patch strategy preference order (per repairPolicy):
 *   1. span_patch  — smallest change; targets a specific span within a section
 *   2. paragraph_patch — rewrites a single paragraph within a section
 *   3. section_rewrite — rewrites an entire section (only when span/paragraph cannot fix the issue)
 *
 * Whole-article rewrite is not supported in v1.
 */
export async function repairDraft(input: RepairDraftInput): Promise<RepairDraftOutput> {
  // TODO: collect all error-severity issues from both reports
  // TODO: for each issue, determine repair strategy via repairPolicy
  //         (check sectionRewriteAlways list first, then prefer span_patch)
  // TODO: invoke repairWriter agent (src/agents/repairWriter.ts) with issues + strategy
  // TODO: build RepairPlan from the agent's proposed PatchRequests
  // TODO: apply each PatchRequest to the draft in sequence:
  //         - span_patch: replace/delete/insert a specific span
  //         - paragraph_patch: rewrite paragraphs[index] in the target section
  //         - section_rewrite: replace entire section content
  // TODO: produce PatchResponse listing applied and rejected ops
  // TODO: increment draft.version
  // TODO: store repairPlan and new draft, update manifest artifactRefs
  throw new Error('Not implemented: repairDraft');
}
