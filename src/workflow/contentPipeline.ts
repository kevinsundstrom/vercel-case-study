'use workflow';

import { initializeRun } from '../workflows/initializeRun';
import { planSources } from '../workflows/planSources';
import { extractEvidence } from '../workflows/extractEvidence';
import { normalizeClaims } from '../workflows/normalizeClaims';
import { writeDraft } from '../workflows/writeDraft';
import { saveArtifactToBlob, saveMarkdownFileToBlob } from '../lib/artifacts.blob';

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

export async function contentPipelineWorkflow(params: PipelineParams): Promise<PipelineResult> {
  const topic = params.topic ?? 'Vercel Workflows vs. Cloudflare Workflows';

  'use step';
  const { manifest: m1 } = await initializeRun({ topic, config: DEFAULT_CONFIG });

  'use step';
  const { manifest: m2, sourcePlan } = await planSources({ manifest: m1 });

  'use step';
  const { manifest: m3, evidencePacks } = await extractEvidence({ manifest: m2, sourcePlan });

  'use step';
  const { manifest: m4, claimLedger, comparisonSchema } = await normalizeClaims({
    manifest: m3,
    evidencePacks,
  });

  'use step';
  const { manifest: m5, draft } = await writeDraft({
    manifest: m4,
    claimLedger,
    comparisonSchema,
  });

  const [, draftMdUrl] = await Promise.all([
    saveArtifactToBlob(m5.runId, 'manifest', { ...m5, status: 'complete', currentStage: 'done' }),
    saveMarkdownFileToBlob(m5.runId, 'articleDraft', draft.markdown),
    saveArtifactToBlob(m5.runId, 'articleDraft', draft),
    saveArtifactToBlob(m5.runId, 'claimLedger', claimLedger),
    saveArtifactToBlob(m5.runId, 'comparisonSchema', comparisonSchema),
    saveArtifactToBlob(m5.runId, 'sourcePlan', sourcePlan),
  ]);

  return {
    runId: m5.runId,
    topic,
    wordCount: draft.totalWordCount,
    claimCount: claimLedger.claims.length,
    sourcedClaims: claimLedger.claims.filter(c => c.type === 'sourced').length,
    derivedClaims: claimLedger.claims.filter(c => c.type === 'derived').length,
    draftUrl: draftMdUrl,
  };
}
