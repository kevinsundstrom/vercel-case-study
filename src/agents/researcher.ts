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

    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.ToolResultBlockParam[] = response.content
        .filter(b => b.type === 'tool_use')
        .map(b => ({
          type: 'tool_result' as const,
          tool_use_id: (b as Anthropic.ToolUseBlock).id,
          content: '',
        }));

      messages.push({ role: 'user', content: toolResults });
    }
  }
}
