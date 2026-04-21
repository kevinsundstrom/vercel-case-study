export interface LintViolation {
  line: number;
  rule: string;
  message: string;
  text: string;
}

export interface LintReport {
  violations: LintViolation[];
  clean: boolean;
}

const PROHIBITED_WORDS = [
  'simply', 'just', 'easy', 'easily', 'obvious', 'obviously',
  'straightforward', 'seamless', 'seamlessly', 'leverage', 'utilize',
  'utilize', 'synergy', 'robust', 'scalable', 'cutting-edge',
];

const MAX_SENTENCE_WORDS = 35;

export function lint(markdown: string): LintReport {
  const violations: LintViolation[] = [];
  const lines = markdown.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const stripped = line.trim();

    // Skip code blocks and headings
    if (stripped.startsWith('```') || stripped.startsWith('#') || stripped.startsWith('|')) return;

    // Prohibited words
    for (const word of PROHIBITED_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(stripped)) {
        violations.push({
          line: lineNum,
          rule: 'prohibited-word',
          message: `Prohibited word: "${word}"`,
          text: stripped.slice(0, 100),
        });
      }
    }

    // Sentence length
    const sentences = stripped.split(/[.!?]+/).filter(s => s.trim().length > 0);
    for (const sentence of sentences) {
      const wordCount = sentence.trim().split(/\s+/).length;
      if (wordCount > MAX_SENTENCE_WORDS) {
        violations.push({
          line: lineNum,
          rule: 'sentence-length',
          message: `Sentence too long (${wordCount} words, max ${MAX_SENTENCE_WORDS})`,
          text: sentence.trim().slice(0, 100),
        });
      }
    }

    // Passive voice (basic detection)
    const passiveRegex = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/i;
    if (passiveRegex.test(stripped)) {
      violations.push({
        line: lineNum,
        rule: 'passive-voice',
        message: 'Possible passive voice',
        text: stripped.slice(0, 100),
      });
    }

    // Double spaces
    if (/  /.test(line)) {
      violations.push({
        line: lineNum,
        rule: 'double-space',
        message: 'Double space detected',
        text: stripped.slice(0, 100),
      });
    }
  });

  return { violations, clean: violations.length === 0 };
}

export function formatReport(report: LintReport): string {
  if (report.clean) return 'No violations found.';
  return report.violations
    .map(v => `Line ${v.line} [${v.rule}]: ${v.message}\n  > ${v.text}`)
    .join('\n\n');
}
