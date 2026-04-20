'use workflow';

import { initializeRun } from '../workflows/initializeRun';
import { planSources } from '../workflows/planSources';
import { extractEvidence } from '../workflows/extractEvidence';
import { normalizeClaims } from '../workflows/normalizeClaims';
import { writeDraft } from '../workflows/writeDraft';
import { saveArtifactToBlob, saveMarkdownFileToBlob } from '../lib/artifacts.blob';
import type { RunManifest, EvidencePack, ComparisonSchema, ArticleDraft } from '../types/artifacts';
import type { SourcePlan } from '../types/sourcePlan';
import type { ClaimLedger } from '../types/claims';

const DEFAULT_CONFIG = {
  maxRepairIterations: 3,
  targetWordCount: 1500,
  articleVersion: '1.0.0',
};

export interface PipelineParams {
  topic?: string;
}

export interface PipelineResult {
  runId: string;
  topic: string;
  wordCount: number;
  claimCount: number;
  sourcedClaims: number;
  derivedClaims: number;
  draftUrl: string;
}

async function stepInitializeRun(topic: string): Promise<RunManifest> {
  'use step';
  const { manifest } = await initializeRun({ topic, config: DEFAULT_CONFIG });
  return manifest;
}

async function stepPlanSources(manifest: RunManifest): Promise<{ manifest: RunManifest; sourcePlan: SourcePlan }> {
  'use step';
  return planSources({ manifest });
}

async function stepExtractEvidence(manifest: RunManifest, sourcePlan: SourcePlan): Promise<{ manifest: RunManifest; evidencePacks: EvidencePack[] }> {
  'use step';
  return extractEvidence({ manifest, sourcePlan });
}

async function stepNormalizeClaims(manifest: RunManifest, evidencePacks: EvidencePack[]): Promise<{ manifest: RunManifest; claimLedger: ClaimLedger; comparisonSchema: ComparisonSchema }> {
  'use step';
  return normalizeClaims({ manifest, evidencePacks });
}

async function stepWriteDraft(manifest: RunManifest, claimLedger: ClaimLedger, comparisonSchema: ComparisonSchema): Promise<{ manifest: RunManifest; draft: ArticleDraft }> {
  'use step';
  return writeDraft({ manifest, claimLedger, comparisonSchema });
}

async function stepSaveArtifacts(
  manifest: RunManifest,
  draft: ArticleDraft,
  claimLedger: ClaimLedger,
  comparisonSchema: ComparisonSchema,
  sourcePlan: SourcePlan,
): Promise<string> {
  'use step';
  const [, draftMdUrl] = await Promise.all([
    saveArtifactToBlob(manifest.runId, 'manifest', { ...manifest, status: 'complete', currentStage: 'done' }),
    saveMarkdownFileToBlob(manifest.runId, 'articleDraft', draft.markdown),
    saveArtifactToBlob(manifest.runId, 'articleDraft', draft),
    saveArtifactToBlob(manifest.runId, 'claimLedger', claimLedger),
    saveArtifactToBlob(manifest.runId, 'comparisonSchema', comparisonSchema),
    saveArtifactToBlob(manifest.runId, 'sourcePlan', sourcePlan),
  ]);
  return draftMdUrl;
}

export async function contentPipelineWorkflow(params: PipelineParams): Promise<PipelineResult> {
  const topic = params.topic ?? 'Vercel Workflows vs. Cloudflare Workflows';

  const m1 = await stepInitializeRun(topic);
  const { manifest: m2, sourcePlan } = await stepPlanSources(m1);
  const { manifest: m3, evidencePacks } = await stepExtractEvidence(m2, sourcePlan);
  const { manifest: m4, claimLedger, comparisonSchema } = await stepNormalizeClaims(m3, evidencePacks);
  const { manifest: m5, draft } = await stepWriteDraft(m4, claimLedger, comparisonSchema);
  const draftUrl = await stepSaveArtifacts(m5, draft, claimLedger, comparisonSchema, sourcePlan);

  return {
    runId: m5.runId,
    topic,
    wordCount: draft.totalWordCount,
    claimCount: claimLedger.claims.length,
    sourcedClaims: claimLedger.claims.filter(c => c.type === 'sourced').length,
    derivedClaims: claimLedger.claims.filter(c => c.type === 'derived').length,
    draftUrl,
  };
}
