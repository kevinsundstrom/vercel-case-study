import type { Severity, SectionId } from './core';

export type LintRuleId =
  | 'missing_required_section'
  | 'section_order_violation'
  | 'word_count_below_min'
  | 'word_count_above_max'
  | 'banned_phrase'
  | 'table_dimension_missing'
  | 'table_missing_claim_ids'
  | 'style_violation'
  | 'formatting_error'
  | 'section_contract_violation';

export interface LintIssue {
  id: string;
  ruleId: LintRuleId;
  sectionId?: SectionId;
  description: string;
  severity: Severity;
  /** Character offset + length within the section content, if applicable. */
  location?: { offset: number; length: number };
}

export interface LintReport {
  runId: string;
  draftVersion: number;
  issues: LintIssue[];
  /** True when there are no error-severity issues. */
  passed: boolean;
  checkedAt: string;
}
