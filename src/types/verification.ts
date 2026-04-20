import type { Severity, SectionId } from './core';

export type VerificationIssueType =
  | 'unsupported_claim'
  | 'claim_type_violation'
  | 'missing_evidence_link'
  | 'terminology_drift'
  | 'comparison_mismatch';

export interface VerificationIssue {
  id: string;
  type: VerificationIssueType;
  /** The claim being flagged, if applicable. */
  claimId?: string;
  sectionId: SectionId;
  description: string;
  severity: Severity;
  /** The span ID that should be targeted by the repair operation, if known. */
  targetSpanId?: string;
  /** The repair action most likely to fix this issue, if determinable without reasoning. */
  expectedAction?: 'replace_span' | 'delete_span' | 'clarify' | 're_source';
}

export interface VerificationReport {
  runId: string;
  draftVersion: number;
  issues: VerificationIssue[];
  /** True when there are no error-severity issues. */
  passed: boolean;
  checkedAt: string;
}
