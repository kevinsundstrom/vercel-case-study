import type { LintReport } from '../src/types';

/**
 * Fixture demonstrates a lint run that found two issues:
 * - A banned phrase in bottom_line
 * - The when_to_use section is below its minimum word count
 *
 * passed = false because 'banned_phrase' is warning here but
 * 'word_count_below_min' is also warning — neither is error severity in this run.
 *
 * NOTE: the passed field is driven by error-severity issues only.
 * Both issues here are warnings, so passed = true to demonstrate that distinction.
 */
export const lintReportFixture: LintReport = {
  runId: 'run_a1b2c3d4e5f6',
  draftVersion: 1,
  passed: true,
  checkedAt: '2026-04-17T10:16:00.000Z',
  issues: [
    {
      id: 'issue_l001',
      ruleId: 'banned_phrase',
      sectionId: 'bottom_line',
      description:
        'The phrase "at the end of the day" appears in the bottom_line section. This phrase is on the banned list in the style profile.',
      severity: 'warning',
      location: { offset: 312, length: 17 },
    },
    {
      id: 'issue_l002',
      ruleId: 'word_count_below_min',
      sectionId: 'when_to_use',
      description:
        'The when_to_use section has 88 words, which is below the minimum of 150 words defined in the section contract.',
      severity: 'warning',
    },
  ],
};
