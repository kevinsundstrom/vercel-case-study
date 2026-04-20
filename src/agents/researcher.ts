import { z } from 'zod';
import { llmCompleteJSON } from '../lib/llm';
import { comparisonDimensions } from '../config/comparisonDimensions';
import { generateEvidenceId, generateSourceId } from '../lib/ids';
import type { EvidenceSource, RawExtract } from '../types';

export interface ResearcherInput {
  vendor: 'vercel' | 'cloudflare';
  sourceUrl: string;
  sourceTitle: string;
  /** Cleaned page text from the fetched URL. */
  content: string;
}

export interface ResearcherOutput {
  source: EvidenceSource;
  extracts: RawExtract[];
}

const SYSTEM = `You are a technical researcher extracting structured evidence from documentation.

Extract only what is explicitly stated in the source content.
Do not infer, elaborate, or add information that is not present in the text.
Verbatim quotes are preferred over paraphrases.

Return only valid JSON — no prose.`.trim();

const VALID_DIMENSION_KEYS = new Set<string>(comparisonDimensions.map(d => d.key));
const MAX_CONTENT_CHARS = 8000;

function buildPrompt(
  vendor: string,
  sourceTitle: string,
  sourceUrl: string,
  content: string,
  sourceId: string
): string {
  const dimLines = comparisonDimensions
    .map(d => `  ${d.key}: ${d.label} — ${d.description}`)
    .join('\n');

  const snippet = content.length > MAX_CONTENT_CHARS
    ? content.slice(0, MAX_CONTENT_CHARS) + '\n[truncated]'
    : content;

  return `Extract structured evidence from this ${vendor} documentation source.

Source title: ${sourceTitle}
Source URL: ${sourceUrl}
sourceId (use exactly): ${sourceId}

Content:
---
${snippet}
---

Comparison dimensions to look for:
${dimLines}

Extract 5–10 relevant quotes. For each:
- quote: verbatim text from the source (or very close paraphrase if verbatim is too long)
- context: one sentence explaining where/why this appears
- dimensionHint: the single most relevant dimension key from the list above
- sourceId: must be exactly "${sourceId}"

Return JSON:
{
  "extracts": [
    {"quote": "…", "context": "…", "dimensionHint": "orchestration_model", "sourceId": "${sourceId}"}
  ]
}`;
}

const ResponseSchema = z.object({
  extracts: z.array(
    z.object({
      quote: z.string().min(1),
      context: z.string(),
      dimensionHint: z.string(),
      sourceId: z.string(),
    })
  ),
});

export async function extractEvidenceFromSource(
  input: ResearcherInput,
  runId: string
): Promise<ResearcherOutput> {
  const sourceId = generateSourceId();

  const response = await llmCompleteJSON(
    SYSTEM,
    buildPrompt(input.vendor, input.sourceTitle, input.sourceUrl, input.content, sourceId),
    ResponseSchema,
    4096
  );

  const extracts: RawExtract[] = response.extracts.map(e => ({
    id: generateEvidenceId(),
    sourceId,
    quote: e.quote,
    context: e.context,
    dimensionHint: VALID_DIMENSION_KEYS.has(e.dimensionHint)
      ? (e.dimensionHint as import('../types').ComparisonDimensionKey)
      : undefined,
  }));

  const source: EvidenceSource = {
    id: sourceId,
    url: input.sourceUrl,
    title: input.sourceTitle,
    type: 'official_docs',
    retrievedAt: new Date().toISOString(),
    excerpt: extracts[0]?.quote ?? '',
  };

  return { source, extracts };
}
