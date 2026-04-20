import { z } from 'zod';
import { SectionIdSchema, SeveritySchema } from './core';

export const LintRuleIdSchema = z.enum([
  'missing_required_section',
  'section_order_violation',
  'word_count_below_min',
  'word_count_above_max',
  'banned_phrase',
  'table_dimension_missing',
  'table_missing_claim_ids',
  'style_violation',
  'formatting_error',
  'section_contract_violation',
]);

export const LintIssueSchema = z.object({
  id: z.string(),
  ruleId: LintRuleIdSchema,
  sectionId: SectionIdSchema.optional(),
  description: z.string(),
  severity: SeveritySchema,
  location: z
    .object({ offset: z.number().int().nonnegative(), length: z.number().int().positive() })
    .optional(),
});

export const LintReportSchema = z.object({
  runId: z.string(),
  draftVersion: z.number().int().positive(),
  issues: z.array(LintIssueSchema),
  passed: z.boolean(),
  checkedAt: z.string().datetime(),
});
