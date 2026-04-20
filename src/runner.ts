import 'dotenv/config'
/**
 * Local entry point for the evidence → claims vertical slice.
 *
 * Usage:
 *   npm run pipeline
 *   npm run pipeline "Custom comparison topic"
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 * Output: runs/{runId}/*.json
 */
import { initializeRun } from './workflows/initializeRun';
import { planSources } from './workflows/planSources';
import { extractEvidence } from './workflows/extractEvidence';
import { normalizeClaims } from './workflows/normalizeClaims';
import { writeDraft } from './workflows/writeDraft';
import { saveArtifact, saveMarkdownFile } from './lib/artifacts';

const TOPIC = process.argv[2] ?? 'Vercel Workflows vs. Cloudflare Workflows';

const DEFAULT_CONFIG = {
  maxRepairIterations: 3,
  targetWordCount: 1500,
  articleVersion: '1.0.0',
};

async function main(): Promise<void> {
  console.log(`\ncontent-pipeline — evidence → claims vertical slice`);
  console.log(`topic: "${TOPIC}"\n`);

  // 1. initializeRun
  console.log('[1/4] Initializing run…');
  const { manifest: m1 } = await initializeRun({ topic: TOPIC, config: DEFAULT_CONFIG });
  saveArtifact(m1.runId, 'manifest', m1);
  console.log(`  runId: ${m1.runId}`);

  // 2. planSources
  console.log('[2/4] Planning sources…');
  const { manifest: m2, sourcePlan } = await planSources({ manifest: m1 });
  saveArtifact(m2.runId, 'sourcePlan', sourcePlan);
  const vPlan = sourcePlan.vendorPlans.vercel;
  const cPlan = sourcePlan.vendorPlans.cloudflare;
  console.log(`  vercel:     ${vPlan.researchQuestions.length} questions, ${vPlan.candidateUrls.length} URLs`);
  console.log(`  cloudflare: ${cPlan.researchQuestions.length} questions, ${cPlan.candidateUrls.length} URLs`);

  // 3. extractEvidence
  console.log('[3/4] Extracting evidence…');
  const { manifest: m3, evidencePacks } = await extractEvidence({ manifest: m2, sourcePlan });
  for (const pack of evidencePacks) {
    saveArtifact(m3.runId, `evidencePack_${pack.vendor}`, pack);
    console.log(`  ${pack.vendor}: ${pack.sources.length} sources, ${pack.extracts.length} extracts`);
  }

  // 4. normalizeClaims
  console.log('[4/4] Normalizing claims…');
  const { manifest: m4, claimLedger, comparisonSchema } = await normalizeClaims({
    manifest: m3,
    evidencePacks,
  });
  saveArtifact(m4.runId, 'claimLedger', claimLedger);
  saveArtifact(m4.runId, 'comparisonSchema', comparisonSchema);

  const sourced = claimLedger.claims.filter(c => c.type === 'sourced').length;
  const derived = claimLedger.claims.filter(c => c.type === 'derived').length;
  console.log(`  ${claimLedger.claims.length} claims — ${sourced} sourced, ${derived} derived`);
  console.log(`  ${claimLedger.evidence.length} evidence items across ${claimLedger.sources.length} sources`);

  // 5. writeDraft
  console.log('[5/5] Writing draft…');
  const { manifest: m5, draft } = await writeDraft({
    manifest: m4,
    claimLedger,
    comparisonSchema,
  });
  saveArtifact(m5.runId, 'articleDraft', draft);
  saveMarkdownFile(m5.runId, 'articleDraft', draft.markdown);
  console.log(`  ${draft.sections.length} sections, ~${draft.totalWordCount} words`);
  console.log(`  draft saved: runs/${m5.runId}/articleDraft.md`);

  // Save final manifest
  saveArtifact(m5.runId, 'manifest', { ...m5, status: 'complete', currentStage: 'done' });

  console.log(`\nArtifacts saved to: runs/${m5.runId}/`);
  console.log('  manifest.json');
  console.log('  sourcePlan.json');
  console.log('  evidencePack_vercel.json');
  console.log('  evidencePack_cloudflare.json');
  console.log('  claimLedger.json');
  console.log('  comparisonSchema.json');
  console.log('  articleDraft.json');
  console.log('  articleDraft.md');
}

main().catch(err => {
  console.error('\nPipeline error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
