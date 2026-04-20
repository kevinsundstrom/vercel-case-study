import type { PatchResponse } from '../src/types';

/**
 * Fixture demonstrates a successful PatchResponse after applying patchRequest.fixture.
 *
 * Both ops were applied:
 *   - replace_span: "step function" → "step-based workflow" ✓
 *   - delete_span: untraced cold-start sentence removed ✓
 *
 * Draft version advanced from 1 → 2.
 */
export const patchResponseFixture: PatchResponse = {
  runId: 'run_a1b2c3d4e5f6',
  sourceDraftVersion: 1,
  resultDraftVersion: 2,
  success: true,
  appliedAt: '2026-04-17T10:21:00.000Z',
  appliedOps: [
    {
      type: 'replace_span',
      sectionId: 'orchestration_model',
      spanId: 'span_orch_para2_s3',
      newContent: 'step-based workflow',
    },
    {
      type: 'delete_span',
      sectionId: 'developer_implications',
      spanId: 'span_devimpl_para3_s1',
    },
  ],
  rejectedOps: [],
};
