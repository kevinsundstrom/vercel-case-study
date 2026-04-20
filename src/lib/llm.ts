import Anthropic from '@anthropic-ai/sdk';
import type { ZodType } from 'zod';

const MODEL = 'claude-haiku-4-5-20251001';
const DEFAULT_MAX_TOKENS = 4096;

// Lazy-initialize so missing key only errors on the first call, not at import time.
let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set. Export it before running the pipeline.');
    }
    _client = new Anthropic();
  }
  return _client;
}

export async function llmComplete(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = DEFAULT_MAX_TOKENS
): Promise<string> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  const block = msg.content[0];
  if (block.type !== 'text') {
    throw new Error('Unexpected non-text content block from LLM');
  }
  return block.text;
}

export async function llmCompleteJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: ZodType<T>,
  maxTokens = DEFAULT_MAX_TOKENS
): Promise<T> {
  const raw = await llmComplete(systemPrompt, userPrompt, maxTokens);
  const jsonStr = extractJSONBlock(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(`LLM returned unparseable JSON.\n\nRaw:\n${raw.slice(0, 500)}`);
  }
  return schema.parse(parsed);
}

function extractJSONBlock(text: string): string {
  // Strip ```json ... ``` or ``` ... ``` fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  // Bare JSON object
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text.trim();
}
