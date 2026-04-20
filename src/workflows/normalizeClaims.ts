import { z } from 'zod';
import { llmCompleteJSON } from '../lib/llm';
import { comparisonDimensions } from '../config/comparisonDimensions';
import { sectionContractSet } from '../config/sectionContracts';
import type {
  RunManifest,
  EvidencePack,
  ClaimLedger,
  ComparisonSchema,
  Evidence,
  Claim,
  EvidenceSource,
  SectionId,
} from '../types';

export interface NormalizeClaimsInput {
  manifest: RunManifest;
  evidencePacks: EvidencePack[];
}

export interface NormalizeClaimsOutput {
  manifest: RunManifest;
  claimLedger: ClaimLedger;
  comparisonSchema: ComparisonSchema;
}

const VALID_SECTION_IDS = new Set<string>(
  sectionContractSet.sections.map(s => s.id)
);

const SYSTEM = `You are a technical claim analyst building a traceable claim ledger.

Rules:
1. Create one Evidence item per raw extract. You may lightly clean quote text for readability but must preserve factual meaning.
2. Create one sourced Claim per Evidence item. A sourced Claim must represent exactly what the evidence says — nothing more.
3. You may create derived Claims ONLY when sourced Claims from different vendors reveal a real implementation or abstraction difference. A derived claim must name the specific difference — not just assert that both platforms share a capability.
4. Do NOT create similarity-only derived claims ("both platforms support X") unless the shared capability is itself the meaningful comparison outcome and you can explain why parity matters.
5. Prefer derived claims that surface HOW the two platforms differ: different execution models, different abstraction layers, different developer mental models, different trade-offs.
6. Do NOT create interpretive Claims in this pass. Do NOT make performance comparisons or superiority claims.
7. Be conservative: 3–4 strong contrastive derived Claims are better than many shallow similarity claims.
8. Each Claim must have a sectionRef chosen from the list provided.
9. Include dimensionHint in each Evidence item (carry it forward from the extract).

Return only valid JSON.`.trim();

function buildPrompt(
  packs: EvidencePack[]
): string {
  const sections = sectionContractSet.sections.map(s => `${s.id}`).join(', ');
  const dimLines = comparisonDimensions.map(d => `  ${d.key}: ${d.label}`).join('\n');

  const extractLines = packs.flatMap(pack =>
    pack.extracts.map((e, i) => {
      const src = pack.sources.find(s => s.id === e.sourceId);
      return [
        `[${e.id}] vendor=${pack.vendor} sourceId=${e.sourceId}`,
        `  source: "${src?.title ?? 'unknown'}" (${src?.url ?? 'unknown'})`,
        `  dimension: ${e.dimensionHint ?? 'unclassified'}`,
        `  quote: "${e.quote}"`,
        `  context: ${e.context}`,
      ].join('\n');
    })
  ).join('\n\n');

  return `Build a claim ledger from these raw evidence extracts.

Valid sectionRef values: ${sections}

Dimensions:
${dimLines}

Raw extracts:
${extractLines}

Instructions:
- Evidence IDs: use ev_0001, ev_0002, … (sequential)
- Claim IDs: claim_vercel_0001 for Vercel, claim_cf_0001 for Cloudflare, claim_both_0001 for derived cross-vendor
- Each sourced Claim's evidenceIds must reference an Evidence ID you defined above
- Each derived Claim's parentClaimIds must reference Claim IDs you defined above

Derived claim guidance:
- ACCEPTABLE: "Vercel Workflows execute as serverless functions with per-step cold-start risk, whereas Cloudflare Workflows run in the Workers runtime with no cold starts."
- ACCEPTABLE: "Vercel Workflows define steps as TypeScript functions with async/await syntax; Cloudflare Workflows use a class-based Workflow API with explicit step() calls, giving Cloudflare a more structured execution contract."
- NOT ACCEPTABLE: "Both Vercel and Cloudflare support durable workflow execution." (similarity-only — no real difference named)
- NOT ACCEPTABLE: "Both platforms offer workflow orchestration for long-running tasks." (too generic — no implementation detail)
- Only create a similarity derived claim if the fact that both platforms share a behavior is a non-obvious finding that directly affects the comparison.

Return JSON:
{
  "evidence": [{"id": "ev_0001", "sourceId": "…", "quote": "…", "context": "…", "dimensionHint": "…"}],
  "claims": [{"id": "claim_vercel_0001", "type": "sourced", "text": "…", "subject": "vercel", "sectionRef": "orchestration_model", "evidenceIds": ["ev_0001"], "parentClaimIds": []}]
}`;
}

const LLMResponseSchema = z.object({
  evidence: z.array(
    z.object({
      id: z.string(),
      sourceId: z.string(),
      quote: z.string(),
      context: z.string(),
      dimensionHint: z.string().optional(),
    })
  ),
  claims: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['sourced', 'derived', 'interpretive']),
      text: z.string(),
      subject: z.enum(['vercel', 'cloudflare', 'both']),
      sectionRef: z.string(),
      evidenceIds: z.array(z.string()),
      parentClaimIds: z.array(z.string()),
      notes: z.string().optional(),
    })
  ),
});

export async function normalizeClaims(input: NormalizeClaimsInput): Promise<NormalizeClaimsOutput> {
  const manifest: RunManifest = {
    ...input.manifest,
    status: 'normalizing',
    currentStage: 'normalizeClaims',
    updatedAt: new Date().toISOString(),
  };

  const allSources = input.evidencePacks.flatMap(p => p.sources);

  // Cap extracts per vendor to keep the LLM response within token limits.
  const MAX_EXTRACTS_PER_VENDOR = 10;
  const cappedPacks = input.evidencePacks.map(p => ({
    ...p,
    extracts: p.extracts.slice(0, MAX_EXTRACTS_PER_VENDOR),
  }));

  const totalExtracts = cappedPacks.reduce((n, p) => n + p.extracts.length, 0);

  // Return empty ledger if no evidence was collected
  if (totalExtracts === 0) {
    console.warn('  normalizeClaims: no extracts found — returning empty ledger');
    return buildEmpty(manifest, allSources);
  }

  const response = await llmCompleteJSON(
    SYSTEM,
    buildPrompt(cappedPacks),
    LLMResponseSchema,
    8192
  );

  // Build evidence-id → dimension map (for ComparisonSchema)
  const evDimMap = new Map(
    response.evidence
      .filter(e => e.dimensionHint)
      .map(e => [e.id, e.dimensionHint!])
  );

  // Strip dimensionHint before storing (not part of formal Evidence type)
  const evidence: Evidence[] = response.evidence.map(e => ({
    id: e.id,
    sourceId: e.sourceId,
    quote: e.quote,
    context: e.context,
  }));

  // Coerce and filter claims
  const claims: Claim[] = response.claims
    .filter(c => c.type !== 'interpretive')
    .filter(c => {
      if (c.type !== 'derived') return true;
      if (isContrastiveClaim(c.text)) return true;
      console.warn(`  normalizeClaims: dropping shallow derived claim ${c.id}: "${c.text.slice(0, 80)}…"`);
      return false;
    })
    .map(c => ({
      ...c,
      sectionRef: VALID_SECTION_IDS.has(c.sectionRef)
        ? (c.sectionRef as SectionId)
        : ('orchestration_model' as SectionId),
    })) as Claim[];

  const claimLedger: ClaimLedger = {
    runId: manifest.runId,
    claims,
    evidence,
    sources: allSources,
    createdAt: new Date().toISOString(),
  };

  // Build ComparisonSchema: group sourced claims by dimension via evidence hints
  const comparisonSchema: ComparisonSchema = {
    runId: manifest.runId,
    dimensions: comparisonDimensions.map(dimSpec => {
      const dimEvIds = new Set(
        [...evDimMap.entries()]
          .filter(([, dim]) => dim === dimSpec.key)
          .map(([id]) => id)
      );
      const dimClaims = claims.filter(
        c => c.type === 'sourced' && c.evidenceIds.some(id => dimEvIds.has(id))
      );
      const vercelClaim = dimClaims.find(c => c.subject === 'vercel');
      const cloudflareClaim = dimClaims.find(c => c.subject === 'cloudflare');
      return {
        dimension: dimSpec.key,
        label: dimSpec.label,
        vercel: vercelClaim?.text ?? '(no sourced evidence for this dimension)',
        cloudflare: cloudflareClaim?.text ?? '(no sourced evidence for this dimension)',
        claimIds: dimClaims.map(c => c.id),
      };
    }),
    createdAt: new Date().toISOString(),
  };

  return {
    manifest: { ...manifest, updatedAt: new Date().toISOString() },
    claimLedger,
    comparisonSchema,
  };
}

const CONTRASTIVE_MARKERS = [
  /\bwhereas\b/i,
  /\bwhile\b/i,
  /\bhowever\b/i,
  /\bunlike\b/i,
  /\bby contrast\b/i,
  /\bin contrast\b/i,
  /\bdiffers?\b/i,
  /\binstead\b/i,
  /\brather than\b/i,
  /\bno cold.?start/i,
  /\bno equivalent\b/i,
];

function isContrastiveClaim(text: string): boolean {
  return CONTRASTIVE_MARKERS.some(re => re.test(text));
}

function buildEmpty(
  manifest: RunManifest,
  sources: EvidenceSource[]
): NormalizeClaimsOutput {
  const claimLedger: ClaimLedger = {
    runId: manifest.runId,
    claims: [],
    evidence: [],
    sources,
    createdAt: new Date().toISOString(),
  };
  const comparisonSchema: ComparisonSchema = {
    runId: manifest.runId,
    dimensions: comparisonDimensions.map(d => ({
      dimension: d.key,
      label: d.label,
      vercel: '(no evidence)',
      cloudflare: '(no evidence)',
      claimIds: [],
    })),
    createdAt: new Date().toISOString(),
  };
  return { manifest, claimLedger, comparisonSchema };
}
