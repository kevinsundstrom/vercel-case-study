import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export interface RefinementRequest {
  draft: string;
  feedback: FeedbackItem[];
}

export interface FeedbackItem {
  id: string;
  target: string;
  issue: string;
  instruction: string;
}

export interface DiffItem {
  id: string;
  target: string;
  before: string;
  after: string;
  reason: string;
}

export interface RefinementResult {
  diffs: DiffItem[];
  skipped: string[];
}

export async function refine(request: RefinementRequest): Promise<RefinementResult> {
  const feedbackBlock = request.feedback
    .map(f => `### Feedback item ${f.id}\n**Target passage:** ${f.target}\n**Issue:** ${f.issue}\n**Instruction:** ${f.instruction}`)
    .join('\n\n');

  const prompt = `You are a precise copy editor. You will be given a draft article and a list of targeted feedback items. Your job is to suggest a specific change for each feedback item.

CRITICAL RULES:
- Address ONLY the passages identified in each feedback item
- Do not rewrite, improve, or touch any text outside the targeted passages
- Do not make stylistic improvements to adjacent sentences
- Do not fix things that were not flagged
- If you cannot address a feedback item without touching untargeted text, add its ID to the skipped list instead

For each feedback item, return:
- id: the feedback item ID
- target: the exact passage identified (copy it verbatim)
- before: the exact current text you are replacing (must appear verbatim in the draft)
- after: the replacement text
- reason: one sentence explaining the change

Return JSON only. No preamble. No markdown. Schema:
{
  "diffs": [
    {
      "id": string,
      "target": string,
      "before": string,
      "after": string,
      "reason": string
    }
  ],
  "skipped": string[]
}

---

DRAFT:
${request.draft}

---

FEEDBACK ITEMS:
${feedbackBlock}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');

  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as RefinementResult;
}
