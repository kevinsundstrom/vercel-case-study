import { llmCall } from '../lib/llm';
import { fetchText } from '../lib/fetch';

const SYSTEM = `You are a research assistant. Given a content outline, you will:
1. Identify the key topics, claims, and questions that need to be answered
2. Synthesize comprehensive research notes that the writer can use

Your notes should be dense with facts, specific details, comparisons, and direct quotes where relevant.
Organize notes by section matching the outline. Be specific — vague notes produce vague articles.`;

export async function research(outline: string, urls: string[] = []): Promise<string> {
  const fetchedContent = await Promise.all(
    urls.map(async (url) => {
      const result = await fetchText(url);
      if (!result.ok) return `[Failed to fetch ${url}: ${result.error}]`;
      return `## ${result.title}\nURL: ${url}\n\n${result.content.slice(0, 8000)}`;
    })
  );

  const sourceBlock = fetchedContent.length > 0
    ? `\n\n---\nSOURCE MATERIAL:\n\n${fetchedContent.join('\n\n---\n\n')}`
    : '';

  return llmCall(SYSTEM, `OUTLINE:\n\n${outline}${sourceBlock}\n\nProduce comprehensive research notes for this article.`);
}
