import type { LintRuleId, Severity } from '../types';

export interface LintRule {
  id: LintRuleId;
  description: string;
  severity: Severity;
  enabled: boolean;
}

export const lintRules: LintRule[] = [
  {
    id: 'missing_required_section',
    description: 'A required section defined in sectionContracts is absent from the draft.',
    severity: 'error',
    enabled: true,
  },
  {
    id: 'section_order_violation',
    description: 'Sections appear in a different order than specified by sectionContracts.',
    severity: 'error',
    enabled: true,
  },
  {
    id: 'word_count_below_min',
    description: 'A section falls below its minimum word count.',
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'word_count_above_max',
    description: 'A section exceeds its maximum word count.',
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'banned_phrase',
    description: 'Draft contains a phrase from the banned phrase list in styleProfile.',
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'table_dimension_missing',
    description: 'The comparison table is missing one or more v1 dimensions.',
    severity: 'error',
    enabled: true,
  },
  {
    id: 'table_missing_claim_ids',
    description: 'A comparison table row is missing claim IDs for one or both vendors.',
    severity: 'error',
    enabled: true,
  },
  {
    id: 'style_violation',
    description: 'Content violates a rule in the style profile (e.g. excessive paragraph length).',
    severity: 'info',
    enabled: true,
  },
  {
    id: 'formatting_error',
    description: 'Markdown formatting is malformed (broken table, unclosed code fence, etc.).',
    severity: 'error',
    enabled: true,
  },
  {
    id: 'section_contract_violation',
    description: 'A section uses a claim type not allowed by its section contract.',
    severity: 'error',
    enabled: true,
  },
];
