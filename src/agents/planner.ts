import { z } from 'zod';
import { llmCompleteJSON } from '../lib/llm';
import { comparisonDimensions } from '../config/comparisonDimensions';
import { sectionContractSet } from '../config/sectionContracts';
import type { ComparisonDimensionKey, SourcePlan } from '../types';
import { VendorPlanSchema } from '../schemas/sourcePlan';

export interface PlannerInput {
  topic: string;
  runId: string;
  targetDimensions: ComparisonDimensionKey[];
}

const SYSTEM = `You are a technical research planner for comparison articles.

Your job is to generate open research questions and identify candidate documentation sources.
Do NOT answer the questions or assume any specific technical behaviors of either platform.
Treat all implementation details as hypotheses that must be verified from official documentation.

Return only valid JSON — no prose, no explanation outside the JSON object.`.trim();

function buildPrompt(topic: string, targetDimensions: ComparisonDimensionKey[]): string {
  // Pass dimension labels + descriptions only — not writer notes
  const dimLines = comparisonDimensions
    .filter(d => targetDimensions.includes(d.key))
    .map(d => `  ${d.key}: ${d.label} — ${d.description}`)
    .join('\n');

  const sectionLines = sectionContractSet.sections
    .map(s => `  ${s.id}: ${s.title}`)
    .join('\n');

  return `Plan evidence collection for this comparison article: "${topic}"

Article sections that need factual support:
${sectionLines}

Comparison dimensions to investigate (these are areas to research — do not assume answers):
${dimLines}

For each vendor (vercel and cloudflare), produce a research plan with:
- 2–3 research questions per dimension
  - "definitional": what is this feature/concept for this vendor?
  - "comparative": how does this differ across vendors? (ask the question, don't answer it)
  - "evidence_critical": what specifically must be confirmed from official docs?
- Mark priority: "high" (needed to write the thesis sections), "medium", or "low"
- 3–5 candidate official documentation URLs for this vendor
- A brief strategy note for this vendor

Question IDs: q_v_001, q_v_002 … for Vercel; q_c_001, q_c_002 … for Cloudflare.

Return JSON:
{
  "vendorPlans": {
    "vercel": {
      "subject": "vercel",
      "researchQuestions": [{"id": "q_v_001", "question": "…", "dimensionKey": "orchestration_model", "type": "definitional", "priority": "high"}],
      "priorityQuestions": ["q_v_001"],
      "dimensionsCovered": ["orchestration_model"],
      "candidateUrls": ["https://vercel.com/docs/…"],
      "notes": "…"
    },
    "cloudflare": { "subject": "cloudflare", … }
  }
}`;
}

// Accept any string for subject at parse time; normalize below.
const LooseVendorPlanSchema = VendorPlanSchema.extend({ subject: z.string() });
const ResponseSchema = z.object({
  vendorPlans: z.object({
    vercel: LooseVendorPlanSchema,
    cloudflare: LooseVendorPlanSchema,
  }),
});

function toSubject(raw: string): 'vercel' | 'cloudflare' {
  return raw.toLowerCase().includes('cloudflare') ? 'cloudflare' : 'vercel';
}

export async function runPlanner(input: PlannerInput): Promise<SourcePlan> {
  const response = await llmCompleteJSON(
    SYSTEM,
    buildPrompt(input.topic, input.targetDimensions),
    ResponseSchema,
    4096
  );
  return {
    runId: input.runId,
    prompt: input.topic,
    generatedAt: new Date().toISOString(),
    vendorPlans: {
      vercel: { ...response.vendorPlans.vercel, subject: toSubject(response.vendorPlans.vercel.subject) },
      cloudflare: { ...response.vendorPlans.cloudflare, subject: toSubject(response.vendorPlans.cloudflare.subject) },
    },
  };
}
