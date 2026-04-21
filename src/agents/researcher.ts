import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-4-5';
const MAX_SEARCHES = 6;

const SYSTEM = `You are a research assistant. Given a content outline, search the web to find accurate, up-to-date information for each section.

Be targeted: search for specific facts, version numbers, pricing, and benchmark figures. Do not search the same topic twice.
When you have enough information, write detailed research notes organized by section. Be specific — vague notes produce vague articles.`;

export async function research(outline: string): Promise<string> {
  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `Research this article outline. Search for the facts needed to write a comprehensive, accurate article.\n\nOUTLINE:\n\n${outline}\n\nWhen done searching, write detailed research notes organized by section.`,
    },
  ];

  let searches = 0;

  while (true) {
    // Once we hit the search cap, force end_turn by removing the tool
    const tools = searches < MAX_SEARCHES
      ? [{ type: 'web_search_20250305', name: 'web_search' } as const]
      : [];

    let response: Anthropic.Message;
    try {
      response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM,
        tools,
        messages,
      });
    } catch (err: unknown) {
      // On rate limit, wait out the 1-minute window and retry the same call
      const status = (err as { status?: number }).status;
      if (status === 429) {
        await new Promise(resolve => setTimeout(resolve, 62_000));
        continue;
      }
      throw err;
    }

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') throw new Error('Researcher returned no text');
      return textBlock.text;
    }

    // web_search_20250305 is server-side: Anthropic executes the search and
    // returns results as web_search_tool_result blocks in response.content.
    // No tool_result message needed — just loop back with the assistant turn.
    searches++;
  }
}
