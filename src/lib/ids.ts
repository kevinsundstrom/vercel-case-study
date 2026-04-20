import { randomBytes } from 'crypto';

/** Generates a run ID in the format run_<12 hex chars>. */
export function generateRunId(): string {
  return `run_${randomBytes(6).toString('hex')}`;
}

/** Generates a claim ID in the format claim_<subject>_<4 hex chars>. */
export function generateClaimId(subject: 'vercel' | 'cloudflare' | 'both'): string {
  return `claim_${subject}_${randomBytes(2).toString('hex')}`;
}

/** Generates an evidence ID in the format ev_<4 hex chars>. */
export function generateEvidenceId(): string {
  return `ev_${randomBytes(2).toString('hex')}`;
}

/** Generates a source ID in the format src_<4 hex chars>. */
export function generateSourceId(): string {
  return `src_${randomBytes(2).toString('hex')}`;
}

/** Generates a verification or lint issue ID in the format issue_<6 hex chars>. */
export function generateIssueId(): string {
  return `issue_${randomBytes(3).toString('hex')}`;
}

/** Generates a patch request ID in the format patch_<6 hex chars>. */
export function generatePatchId(): string {
  return `patch_${randomBytes(3).toString('hex')}`;
}
