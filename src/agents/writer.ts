import { z } from 'zod';
import { llmCompleteJSON } from '../lib/llm';
import { sectionContractSet } from '../config/sectionContracts';
import { styleProfile } from '../config/styleProfile';
import type {
  ArticleDraft,
  ArticleSection,
  ClaimLedger,
  ComparisonSchema,
  EditorialBrief,
  SectionId,
  SectionRenderingConfig,
} from '../types';

export interface WriterInput {
  claimLedger: ClaimLedger;
  comparisonSchema: ComparisonSchema;
  editorialBrief: EditorialBrief;
  sectionRenderingConfig: SectionRenderingConfig;
  runId: string;
  topic: string;
}

const SYSTEM = `You are a technical writer producing a structured comparison article.

Rules:
1. Use ONLY the claims provided. Do not introduce facts not present in the claim list.
2. Do not smooth over real differences. If claims show a meaningful distinction, preserve it in the prose.
3. Do not invent tradeoffs, performance claims, or superiority judgments not grounded in the claims.
4. If two systems share a capability, do not stop there — explain HOW that capability is expressed differently when the claims support it.
5. If a section has weak evidence, keep it short and factual. Do not pad.
6. Follow the section contracts: respect word targets and allowed claim types.
7. The comparison table must use GitHub Markdown table syntax.
8. The article must remain comparative throughout — do not describe each vendor independently in separate sections.
9. Do not use generic headings like "Introduction", "Overview", or "Conclusion".
10. Do not write fluffy openers ("In today's world…", "As developers increasingly…").
11. Return only valid JSON.`.trim();

function buildClaimsBySection(ledger: ClaimLedger): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const claim of ledger.claims) {
    const lines = map.get(claim.sectionRef) ?? [];
    lines.push(`  [${claim.id}] (${claim.type}, ${claim.subject}) "${claim.text}"`);
    map.set(claim.sectionRef, lines);
  }
  return map;
}

function buildTableRows(schema: ComparisonSchema): string {
  return schema.dimensions
    .map(d => `  | ${d.label} | ${d.vercel} | ${d.cloudflare} |`)
    .join('\n');
}

function buildEditorialBlock(brief: EditorialBrief): string {
  const lines = [
    `EDITORIAL BRIEF`,
    `Audience: ${brief.audience.role} — ${brief.audience.context}`,
    `Prior knowledge: ${brief.audience.priorKnowledge}`,
    `Objective: ${brief.objective}`,
    `Core thesis: ${brief.coreThesis}`,
    `Key tensions to center: ${brief.keyTensions.join('; ')}`,
    `Reader takeaway: ${brief.readerTakeaway}`,
    `Tone: ${brief.tone.style}, ${brief.tone.verbosity}`,
    `Constraints:`,
    `  - Article must remain comparative throughout (no describing vendors independently): ${brief.constraints.mustBeComparative}`,
    `  - No generic headings (no "Introduction", "Overview", "Conclusion", etc.): ${brief.constraints.noGenericHeadings}`,
    `  - No fluffy openers or filler prose: ${brief.constraints.noFluff}`,
  ];
  return lines.join('\n');
}

function buildSectionBlocks(
  claimsBySection: Map<string, string[]>,
  renderingConfig: SectionRenderingConfig
): string {
  return sectionContractSet.sections
    .map(s => {
      const render = renderingConfig[s.id];
      const claimLines = claimsBySection.get(s.id)?.join('\n') ?? '  (no claims for this section)';
      const headingLine = render?.render === false
        ? `Heading: NONE — render as body text only, no heading`
        : `Heading: "${render?.heading ?? s.title}"`;
      return [
        `### Section ${s.order} [id: ${s.id}]`,
        headingLine,
        `Purpose: ${render?.purpose ?? s.notes}`,
        `Instructions: ${render?.instructions ?? s.notes}`,
        `Word target: ${s.minWords}–${s.maxWords} | Allowed claim types: ${s.allowedClaimTypes.join(', ')}`,
        `Supporting claims — use only what the section purpose requires; omit claims that weaken clarity or comparison flow:`,
        claimLines,
      ].join('\n');
    })
    .join('\n\n');
}

function buildPrompt(input: WriterInput): string {
  const { claimLedger, comparisonSchema, editorialBrief, sectionRenderingConfig, topic } = input;
  const claimsBySection = buildClaimsBySection(claimLedger);
  const sectionBlocks = buildSectionBlocks(claimsBySection, sectionRenderingConfig);
  const tableRows = buildTableRows(comparisonSchema);
  const bannedPhrases = styleProfile.bannedPhrases.join(', ');

  return `Write a structured comparison article on this topic: "${topic}"

${buildEditorialBlock(editorialBrief)}

Style: ${styleProfile.voice}
Banned phrases: ${bannedPhrases}
Formatting: GitHub Markdown, H3 for sub-headings within a section, max 4 sentences per paragraph

WRITING INSTRUCTIONS:
- Argue the core thesis throughout: "${editorialBrief.coreThesis}"
- Keep the key tensions visible: ${editorialBrief.keyTensions.map(t => `"${t}"`).join(', ')}
- Write for: ${editorialBrief.audience.role}
- Every section must compare both vendors in the same breath — never a full paragraph about one vendor without referencing the other

SECTION RENDERING AND AVAILABLE CLAIMS:
${sectionBlocks}

COMPARISON TABLE DATA (for the comparison_table section):
Columns: Dimension | Vercel | Cloudflare
${tableRows}

TABLE RULES (strictly enforced):
- Each cell must be a short phrase or a single sentence — maximum 15 words per cell
- No multi-sentence prose in any table cell
- If a cell value is "(no sourced evidence for this dimension)", write "(no evidence)"
- Do not omit any rows

IMPORTANT:
- Sections with Heading: NONE render as body text only — do not add a heading to those sections in the content field
- Use the exact heading text specified for each section — do not invent headings
- Do not assert anything not traceable to the claims listed above

Return JSON:
{
  "sections": [
    {
      "id": "short_answer",
      "title": "",
      "content": "…markdown content, no heading…",
      "claimIds": ["claim_both_0001"]
    }
  ]
}

Include all 7 sections in order: short_answer, what_is_compared, orchestration_model, developer_implications, comparison_table, when_to_use, bottom_line.
For sections with Heading: NONE, set title to empty string "" in the JSON.`;
}

const LLMResponseSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      claimIds: z.array(z.string()),
    })
  ),
});

const SECTION_ORDER: SectionId[] = [
  'short_answer',
  'what_is_compared',
  'orchestration_model',
  'developer_implications',
  'comparison_table',
  'when_to_use',
  'bottom_line',
];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function stitchMarkdown(sections: ArticleSection[], renderingConfig: SectionRenderingConfig): string {
  return sections
    .map(s => {
      const entry = renderingConfig[s.id];
      if (entry && !entry.render) {
        return s.content;
      }
      const heading = entry?.heading ?? s.title;
      return `## ${heading}\n\n${s.content}`;
    })
    .join('\n\n---\n\n');
}

export async function runWriter(input: WriterInput): Promise<ArticleDraft> {
  const response = await llmCompleteJSON(
    SYSTEM,
    buildPrompt(input),
    LLMResponseSchema,
    8192
  );

  const contractMap = new Map(sectionContractSet.sections.map(s => [s.id, s]));

  const sections: ArticleSection[] = SECTION_ORDER.map(sectionId => {
    const raw = response.sections.find(s => s.id === sectionId);
    const contract = contractMap.get(sectionId)!;
    const renderEntry = input.sectionRenderingConfig[sectionId];
    const content = raw?.content ?? `*(no content generated for this section)*`;
    // Canonical title: config heading if rendered, else contract title, else LLM title
    const title = renderEntry?.render === false
      ? ''
      : (renderEntry?.heading ?? contract.title);
    return {
      id: sectionId,
      title,
      content,
      claimIds: raw?.claimIds ?? [],
      wordCount: countWords(content),
    };
  });

  const totalWordCount = sections.reduce((n, s) => n + s.wordCount, 0);
  const markdown = stitchMarkdown(sections, input.sectionRenderingConfig);

  return {
    runId: input.runId,
    version: 1,
    markdown,
    sections,
    totalWordCount,
    createdAt: new Date().toISOString(),
  };
}
