import { z } from 'zod';

export const ClaimTypeSchema = z.enum(['sourced', 'derived', 'interpretive']);

export const SectionIdSchema = z.enum([
  'short_answer',
  'what_is_compared',
  'orchestration_model',
  'developer_implications',
  'comparison_table',
  'when_to_use',
  'bottom_line',
]);

export const ComparisonSubjectSchema = z.enum(['vercel', 'cloudflare', 'both']);

export const ComparisonDimensionKeySchema = z.enum([
  'orchestration_model',
  'workflow_definition_model',
  'control_flow_model',
  'durability_model',
  'system_boundary',
  'primary_use_case_shape',
]);

export const RunStatusSchema = z.enum([
  'initialized',
  'planning',
  'extracting',
  'normalizing',
  'writing',
  'verifying',
  'linting',
  'repairing',
  'finalizing',
  'complete',
  'failed',
]);

export const SeveritySchema = z.enum(['error', 'warning', 'info']);

export const EvidenceSourceTypeSchema = z.enum([
  'official_docs',
  'blog',
  'changelog',
  'forum',
  'benchmark',
]);

export const PatchStrategySchema = z.enum([
  'span_patch',
  'paragraph_patch',
  'section_rewrite',
]);

export const PatchOpTypeSchema = z.enum([
  'replace_span',
  'delete_span',
  'insert_after',
  'rewrite_paragraph',
  'rewrite_section',
]);
