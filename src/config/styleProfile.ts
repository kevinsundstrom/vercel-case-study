export interface StyleProfile {
  voice: string;
  audience: string;
  targetReadingLevel: string;
  toneAdjectives: string[];
  bannedPhrases: string[];
  preferredTerminology: Record<string, string>;
  formatting: StyleFormattingRules;
}

export interface StyleFormattingRules {
  useMarkdown: boolean;
  headingLevel: 'h2' | 'h3';
  maxSentencesPerParagraph: number;
  useCodeBlocks: boolean;
  tableSyntax: 'github_markdown';
}

export const styleProfile: StyleProfile = {
  voice: 'direct, technical, opinionated but fair',
  audience: 'Senior software engineers evaluating workflow orchestration tools',
  targetReadingLevel: 'Technical — assumes familiarity with serverless, async patterns, and cloud platforms',
  toneAdjectives: ['clear', 'precise', 'confident', 'grounded'],
  bannedPhrases: [
    'it is worth noting',
    'needless to say',
    'in conclusion',
    'to summarize',
    'in today\'s world',
    'game-changer',
    'seamlessly',
    'robust solution',
    'best of both worlds',
    'a wide variety of',
    'at the end of the day',
  ],
  preferredTerminology: {
    'Vercel Workflows': 'Vercel Workflows',
    'Cloudflare Workflows': 'Cloudflare Workflows',
    'async generator': 'async generator function',
    'step function': 'step-based workflow',
    'serverless': 'serverless',
    'durable execution': 'durable execution',
  },
  formatting: {
    useMarkdown: true,
    headingLevel: 'h2',
    maxSentencesPerParagraph: 4,
    useCodeBlocks: true,
    tableSyntax: 'github_markdown',
  },
};
