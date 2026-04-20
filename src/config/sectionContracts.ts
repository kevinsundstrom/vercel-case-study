import type { SectionContractSet } from '../types';

export const sectionContractSet: SectionContractSet = {
  version: '1.0.0',
  sections: [
    {
      id: 'short_answer',
      title: 'Short Answer',
      required: true,
      order: 1,
      minWords: 40,
      maxWords: 100,
      allowedClaimTypes: ['derived', 'interpretive'],
      notes:
        'One or two sentences that name the core tradeoff. No hedging. Must be opinionated.',
    },
    {
      id: 'what_is_compared',
      title: 'What Is Being Compared',
      required: true,
      order: 2,
      minWords: 80,
      maxWords: 200,
      allowedClaimTypes: ['sourced'],
      notes:
        'Factual definitions of both products. No opinion. All claims must be sourced.',
    },
    {
      id: 'orchestration_model',
      title: 'Orchestration Model',
      required: true,
      order: 3,
      minWords: 200,
      maxWords: 500,
      allowedClaimTypes: ['sourced', 'derived'],
      notes:
        'Explains the code-as-orchestrator vs. step-based model distinction in depth. Core thesis section.',
    },
    {
      id: 'developer_implications',
      title: 'What This Means for Developers',
      required: true,
      order: 4,
      minWords: 150,
      maxWords: 400,
      allowedClaimTypes: ['derived', 'interpretive'],
      notes:
        'Derived and interpretive claims only. Must link back to sourced or derived parents.',
    },
    {
      id: 'comparison_table',
      title: 'Comparison Table',
      required: true,
      order: 5,
      minWords: 30,
      maxWords: 150,
      allowedClaimTypes: ['sourced', 'derived'],
      notes:
        'Must include all six v1 dimensions. Table format required. Each row must have claim IDs.',
    },
    {
      id: 'when_to_use',
      title: 'When Each Approach Makes Sense',
      required: true,
      order: 6,
      minWords: 150,
      maxWords: 350,
      allowedClaimTypes: ['interpretive'],
      notes:
        'Use-case recommendations. Interpretive claims must link to sourced/derived parents.',
    },
    {
      id: 'bottom_line',
      title: 'Bottom Line',
      required: true,
      order: 7,
      minWords: 50,
      maxWords: 120,
      allowedClaimTypes: ['interpretive'],
      notes: 'Concise synthesis. Must not introduce new claims.',
    },
  ],
};
