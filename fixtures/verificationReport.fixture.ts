import type { VerificationReport } from '../src/types';

/**
 * Fixture demonstrates a verification run that found two issues:
 * - A terminology drift in the orchestration_model section
 * - An unsupported claim in developer_implications (claim not found in ledger)
 *
 * Both issues carry targetSpanId and expectedAction so the repair system can
 * generate a PatchRequest without inferring the repair target from prose alone.
 *
 * passed = false because both issues are error severity.
 * These issues are addressed by the patchRequest.fixture.
 */
export const verificationReportFixture: VerificationReport = {
  runId: 'run_a1b2c3d4e5f6',
  draftVersion: 1,
  passed: false,
  checkedAt: '2026-04-17T10:15:00.000Z',
  issues: [
    {
      id: 'issue_v001',
      type: 'terminology_drift',
      sectionId: 'orchestration_model',
      description:
        'The term "step function" appears in this section. The preferred term is "step-based workflow" per the style profile. Inconsistent usage creates ambiguity with AWS Step Functions.',
      severity: 'error',
      targetSpanId: 'span_orch_para2_s3',
      expectedAction: 'replace_span',
    },
    {
      id: 'issue_v002',
      type: 'unsupported_claim',
      claimId: 'claim_both_UNKNOWN',
      sectionId: 'developer_implications',
      description:
        'The draft asserts claim_both_UNKNOWN in the developer_implications section, but this claim ID does not exist in the ClaimLedger. The claim reads: "Vercel Workflows has better cold start performance than Cloudflare Workflows." This is untraced — no evidence was found for it.',
      severity: 'error',
      targetSpanId: 'span_devimpl_para3_s1',
      expectedAction: 'delete_span',
    },
  ],
};
