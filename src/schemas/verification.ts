import { z } from 'zod';
import { SectionIdSchema, SeveritySchema } from './core';

export const VerificationIssueTypeSchema = z.enum([
  'unsupported_claim',
  'claim_type_violation',
  'missing_evidence_link',
  'terminology_drift',
  'comparison_mismatch',
]);

export const VerificationIssueSchema = z.object({
  id: z.string(),
  type: VerificationIssueTypeSchema,
  claimId: z.string().optional(),
  sectionId: SectionIdSchema,
  description: z.string(),
  severity: SeveritySchema,
  targetSpanId: z.string().optional(),
  expectedAction: z.enum(['replace_span', 'delete_span', 'clarify', 're_source']).optional(),
});

export const VerificationReportSchema = z.object({
  runId: z.string(),
  draftVersion: z.number().int().positive(),
  issues: z.array(VerificationIssueSchema),
  passed: z.boolean(),
  checkedAt: z.string().datetime(),
});
