import type { RunManifest, ArticleDraft, LintReport } from '../types';

export interface LintDraftInput {
  manifest: RunManifest;
  draft: ArticleDraft;
}

export interface LintDraftOutput {
  manifest: RunManifest;
  report: LintReport;
}

/**
 * Runs structural and formatting lint checks over the draft to produce a LintReport.
 * Linting is content-structural: it checks sections, word counts, banned phrases, and table integrity.
 * Does not check claim traceability — that is verification's job.
 *
 * Linter responsibilities:
 *   - required sections present and in correct order
 *   - per-section word count within min/max bounds
 *   - no banned phrases (from styleProfile.bannedPhrases)
 *   - comparison table includes all six v1 dimensions
 *   - section contract claim-type constraints (structural, not traceability)
 *   - markdown formatting validity
 */
export async function lintDraft(input: LintDraftInput): Promise<LintDraftOutput> {
  // TODO: check all required sections are present (sectionContracts.sections where required)
  // TODO: check section order matches sectionContracts order values
  // TODO: check each section word count against contract min/max
  // TODO: scan content for banned phrases from styleProfile
  // TODO: check comparison_table section includes all comparisonDimensions entries
  // TODO: validate markdown structure (no broken tables, unclosed fences, etc.)
  // TODO: build LintReport, set passed = no error-severity issues
  // TODO: store report, update manifest artifactRefs
  throw new Error('Not implemented: lintDraft');
}
