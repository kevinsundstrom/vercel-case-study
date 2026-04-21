import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-6';

const SYSTEM = `You are a research assistant. Given a content outline, search the web to find comprehensive, accurate, and up-to-date information for each section.

Search multiple times — once to understand the landscape, then for specific claims, comparisons, and technical details.
Organize your final notes by section matching the outline. Be specific: include version numbers, pricing, API names, benchmark figures, and direct quotes where available.
Vague notes produce vague articles.`;

export async function research(outline: string): Promise<string> {
  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `Research this article outline thoroughly. Search for everything needed to write a comprehensive, accurate article.\n\nOUTLINE:\n\n${outline}\n\nWhen done searching, write detailed research notes organized by section.`,
    },
  ];

  // Tool use loop — Claude will search until it has enough information
  while (true) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8096,
      system: SYSTEM,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
    });

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') throw new Error('Researcher returned no text');
      return textBlock.text;
    }

    // web_search_20250305 is server-side: Anthropic executes the search and
    // returns results as web_search_tool_result blocks in response.content.
    // No tool_result message needed — just loop back with the assistant turn.
  }
}
