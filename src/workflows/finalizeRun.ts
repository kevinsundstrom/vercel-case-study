import type {
  RunManifest,
  ArticleDraft,
  ClaimLedger,
  VerificationReport,
  LintReport,
  FinalizationReport,
} from '../types';
import { escalationPolicy } from '../config/escalationPolicy';

export interface FinalizeRunInput {
  manifest: RunManifest;
  draft: ArticleDraft;
  claimLedger: ClaimLedger;
  verificationReport: VerificationReport;
  lintReport: LintReport;
  repairIterations: number;
}

export interface FinalizeRunOutput {
  manifest: RunManifest;
  finalizationReport: FinalizationReport;
}

/**
 * Evaluates escalation conditions and, if none are triggered, marks the run complete.
 * Produces a FinalizationReport summarizing the final state of all artifacts.
 * If escalation conditions are met, updates manifest status to 'failed' with a reason.
 */
export async function finalizeRun(input: FinalizeRunInput): Promise<FinalizeRunOutput> {
  // TODO: evaluate each escalationPolicy.abortConditions against current state
  // TODO: if any abort condition is met:
  //         - set manifest.status = 'failed'
  //         - record which condition triggered
  //         - notify escalationPolicy.notifyChannels (when connected)
  //         - return with passed = false
  // TODO: if all conditions pass:
  //         - count total claims and evidence items
  //         - build FinalizationReport
  //         - set manifest.status = 'complete'
  // TODO: store finalizationReport, update manifest artifactRefs and updatedAt
  // Suppressed eslint warning — escalationPolicy imported for future use in condition evaluation
  void escalationPolicy;
  throw new Error('Not implemented: finalizeRun');
}
