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
  'synergy', 'robust', 'scalable', 'cutting-edge',
  'delve', 'streamline', 'harness', 'industry-leading', 'best-in-class',
  'world-class',
];

const HYPE_OPENINGS = [
  "we're excited", "we are excited", "excited to share",
  "thrilled to announce", "proud to announce",
];

const SUMMARY_CONCLUSIONS = [
  "overall,", "in conclusion,", "in summary,", "to summarize,",
];

const MAX_SENTENCE_WORDS = 35;

export function lint(markdown: string): LintReport {
  const violations: LintViolation[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  // Hype opening — check first 100 characters of document
  const docStart = markdown.slice(0, 100).toLowerCase();
  for (const phrase of HYPE_OPENINGS) {
    if (docStart.includes(phrase)) {
      violations.push({ line: 1, rule: 'phrases.hype-opening', message: `Hype opening detected: "${phrase}"`, text: markdown.slice(0, 100) });
    }
  }

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const stripped = line.trim();

    // Track code block state
    if (stripped.startsWith('```')) { inCodeBlock = !inCodeBlock; return; }
    if (inCodeBlock || stripped.startsWith('#') || stripped.startsWith('|')) return;

    // Em dash
    if (/[—–]/.test(line)) {
      violations.push({ line: lineNum, rule: 'punctuation.em-dash', message: 'Em dash detected — use a period or restructure', text: stripped.slice(0, 100) });
    }

    // Prohibited words
    for (const word of PROHIBITED_WORDS) {
      const regex = new RegExp(`\\b${word.replace(/-/g, '[- ]')}\\b`, 'i');
      if (regex.test(stripped)) {
        violations.push({ line: lineNum, rule: 'phrases.banned-words', message: `Banned word: "${word}"`, text: stripped.slice(0, 100) });
      }
    }

    // Summary conclusion — check paragraph-opening lines
    if (stripped.length > 0) {
      const lower = stripped.toLowerCase();
      for (const phrase of SUMMARY_CONCLUSIONS) {
        if (lower.startsWith(phrase)) {
          violations.push({ line: lineNum, rule: 'phrases.summary-conclusion', message: `Summary conclusion opener: "${phrase}"`, text: stripped.slice(0, 100) });
        }
      }
    }

    // Oxford comma — "X, Y and Z" or "X, Y or Z" without comma before conjunction
    const oxfordRegex = /\w+,\s+\w[\w\s]*\s+(and|or)\s+\w/gi;
    const missingCommaRegex = /(\w+),\s+(\w[\w\s]*?)\s+(and|or)\s+(\w)/g;
    let match;
    while ((match = missingCommaRegex.exec(stripped)) !== null) {
      // Only flag if the text before the conjunction contains a comma (3+ items)
      // and does NOT already have a comma immediately before the conjunction
      const beforeConj = match[0].slice(0, match[0].lastIndexOf(match[3])).trimEnd();
      if (!beforeConj.endsWith(',')) {
        violations.push({ line: lineNum, rule: 'style.oxford-comma', message: `Missing Oxford comma before "${match[3]}"`, text: stripped.slice(0, 100) });
        break;
      }
    }
    void oxfordRegex;

    // Sentence length
    const sentences = stripped.split(/[.!?]+/).filter(s => s.trim().length > 0);
    for (const sentence of sentences) {
      const wordCount = sentence.trim().split(/\s+/).length;
      if (wordCount > MAX_SENTENCE_WORDS) {
        violations.push({ line: lineNum, rule: 'sentence-length', message: `Sentence too long (${wordCount} words, max ${MAX_SENTENCE_WORDS})`, text: sentence.trim().slice(0, 100) });
      }
    }

    // Passive voice (basic detection)
    const passiveRegex = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/i;
    if (passiveRegex.test(stripped)) {
      violations.push({ line: lineNum, rule: 'passive-voice', message: 'Possible passive voice', text: stripped.slice(0, 100) });
    }

    // Double spaces
    if (/  /.test(line)) {
      violations.push({ line: lineNum, rule: 'double-space', message: 'Double space detected', text: stripped.slice(0, 100) });
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
