import type { SectionRenderingConfig } from '../types';

export const sectionRenderingConfig: SectionRenderingConfig = {
  short_answer: {
    render: false,
    purpose: 'Open the article with a direct thesis statement — no heading',
    instructions:
      'Write 2–3 sentences. State the core programming model difference immediately. Name the tradeoff the reader faces. Do not introduce the products generically — assume the reader already knows what workflows are.',
  },
  what_is_compared: {
    render: true,
    heading: 'Two Models for the Same Problem',
    purpose: 'Define both products comparatively and establish shared vocabulary',
    instructions:
      'Name the contrast in the first sentence. Both products must appear in the opening sentence. Do not define each vendor separately before stating the difference.',
  },
  orchestration_model: {
    render: true,
    heading: 'How the Programming Models Actually Differ',
    purpose: 'Core technical comparison — the thesis section',
    instructions:
      'Explain the code-as-orchestrator vs. step-based execution graph distinction with concrete technical detail. Use H3 sub-headings for distinct sub-topics (e.g. durability mechanics, control flow, deployment). Every claim about one vendor must be contrasted with the other in the same paragraph or the next.',
  },
  developer_implications: {
    render: true,
    heading: 'What You Actually Deal With as a Developer',
    purpose: 'Translate model differences into concrete developer-facing experience',
    instructions:
      'Lead with the derived or interpretive claims. Focus on what the developer directly touches: syntax, debugging approach, version management, mental model. Keep it tight — no more than 3 paragraphs. Do not repeat the technical mechanics already covered in the orchestration_model section.',
  },
  comparison_table: {
    render: true,
    heading: 'Side-by-Side',
    purpose: 'Scannable reference across all six comparison dimensions',
    instructions:
      'Each table cell must be a short phrase or a single sentence — maximum 15 words per cell. No multi-sentence prose in any cell. If evidence is missing for a dimension, write (no evidence). Do not add context or explanation inside cells that belongs in prose sections.',
  },
  when_to_use: {
    render: true,
    heading: 'When to Choose Each',
    purpose: 'Practical decision guidance grounded in the claims',
    instructions:
      'Give concrete, claim-grounded decision criteria. Two paragraphs: one for Vercel, one for Cloudflare. End with one sentence naming the core decision axis. Do not use bullet lists. Do not make superiority claims.',
  },
  bottom_line: {
    render: false,
    purpose: 'Restate the thesis one final time without introducing new claims',
    instructions:
      'Write 2–3 sentences. Restate the core programming model distinction. No new claims. No recommendations beyond what the claims support. Render without a heading — append directly after the when_to_use section.',
  },
};
