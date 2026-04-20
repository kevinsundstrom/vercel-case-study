/** Primitive union types shared across the entire pipeline. */

export type ClaimType = 'sourced' | 'derived' | 'interpretive';

export type SectionId =
  | 'short_answer'
  | 'what_is_compared'
  | 'orchestration_model'
  | 'developer_implications'
  | 'comparison_table'
  | 'when_to_use'
  | 'bottom_line';

export type ComparisonSubject = 'vercel' | 'cloudflare' | 'both';

export type ComparisonDimensionKey =
  | 'orchestration_model'
  | 'workflow_definition_model'
  | 'control_flow_model'
  | 'durability_model'
  | 'system_boundary'
  | 'primary_use_case_shape';

export type RunStatus =
  | 'initialized'
  | 'planning'
  | 'extracting'
  | 'normalizing'
  | 'writing'
  | 'verifying'
  | 'linting'
  | 'repairing'
  | 'finalizing'
  | 'complete'
  | 'failed';

export type Severity = 'error' | 'warning' | 'info';

export type EvidenceSourceType =
  | 'official_docs'
  | 'blog'
  | 'changelog'
  | 'forum'
  | 'benchmark';

export type PatchStrategy = 'span_patch' | 'paragraph_patch' | 'section_rewrite';

export type PatchOpType =
  | 'replace_span'
  | 'delete_span'
  | 'insert_after'
  | 'rewrite_paragraph'
  | 'rewrite_section';
