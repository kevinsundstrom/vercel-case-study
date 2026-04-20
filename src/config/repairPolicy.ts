import type { PatchStrategy } from '../types';

export interface RepairPolicy {
  maxIterations: number;
  /** Preferred strategy order — try earlier entries before escalating. */
  strategyOrder: PatchStrategy[];
  /** When to escalate from one strategy to the next. */
  escalationThresholds: {
    /** Retry the same span_patch this many times before upgrading to paragraph_patch. */
    spanPatchMaxRetries: number;
    /** Retry paragraph_patch this many times before upgrading to section_rewrite. */
    paragraphPatchMaxRetries: number;
  };
  /** Issue types that should always trigger section_rewrite, skipping span/paragraph. */
  sectionRewriteAlways: string[];
  /** If true, abort the run after maxIterations rather than producing a partial result. */
  abortOnMaxIterations: boolean;
}

export const repairPolicy: RepairPolicy = {
  maxIterations: 3,
  strategyOrder: ['span_patch', 'paragraph_patch', 'section_rewrite'],
  escalationThresholds: {
    spanPatchMaxRetries: 2,
    paragraphPatchMaxRetries: 1,
  },
  sectionRewriteAlways: [
    'comparison_mismatch',
    'claim_type_violation',
  ],
  abortOnMaxIterations: false,
};
