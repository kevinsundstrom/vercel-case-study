import 'dotenv/config';
import { loadArtifact, saveArtifact, saveMarkdownFile } from './lib/artifacts';
import { writeDraft } from './workflows/writeDraft';
import { ClaimLedgerSchema, ComparisonSchemaSchema } from './schemas';

const runId = process.argv[2];

if (!runId) {
  console.error('Usage: npm run draft <runId>');
  console.error('Example: npm run draft run_3299f5e75c85');
  process.exit(1);
}

async function main(): Promise<void> {
  console.log(`\ndraft-only run — runId: ${runId}\n`);

  let claimLedgerRaw: unknown;
  let comparisonSchemaRaw: unknown;
  try {
    claimLedgerRaw = loadArtifact(runId, 'claimLedger');
  } catch {
    console.error(`Error: runs/${runId}/claimLedger.json not found or unreadable.`);
    process.exit(1);
  }
  try {
    comparisonSchemaRaw = loadArtifact(runId, 'comparisonSchema');
  } catch {
    console.error(`Error: runs/${runId}/comparisonSchema.json not found or unreadable.`);
    process.exit(1);
  }

  const claimLedger = ClaimLedgerSchema.parse(claimLedgerRaw);
  const comparisonSchema = ComparisonSchemaSchema.parse(comparisonSchemaRaw);

  const sourced = claimLedger.claims.filter(c => c.type === 'sourced').length;
  const derived = claimLedger.claims.filter(c => c.type === 'derived').length;
  console.log(`  loaded: ${claimLedger.claims.length} claims (${sourced} sourced, ${derived} derived), ${claimLedger.evidence.length} evidence items`);

  const manifest = {
    runId,
    topic: 'Vercel Workflows vs. Cloudflare Workflows',
    status: 'writing' as const,
    currentStage: 'writeDraft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: { maxRepairIterations: 3, targetWordCount: 1500, articleVersion: '1.0.0' },
    artifactRefs: {},
  };

  console.log('  calling writeDraft…');
  const { draft } = await writeDraft({ manifest, claimLedger, comparisonSchema });

  saveArtifact(runId, 'articleDraft', draft);
  saveMarkdownFile(runId, 'articleDraft', draft.markdown);

  console.log(`  ${draft.sections.length} sections, ~${draft.totalWordCount} words`);
  console.log(`\nArtifacts written:`);
  console.log(`  runs/${runId}/articleDraft.json`);
  console.log(`  runs/${runId}/articleDraft.md`);
}

main().catch(err => {
  console.error('\nDraft error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
