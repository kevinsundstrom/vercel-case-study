import { runWriter } from '../agents/writer';
import type { RunManifest, ClaimLedger, ComparisonSchema, ArticleDraft, EditorialBrief, SectionRenderingConfig } from '../types';
import { editorialBrief as defaultEditorialBrief } from '../config/editorialBrief';
import { sectionRenderingConfig as defaultSectionRenderingConfig } from '../config/sectionRendering';

export interface WriteDraftInput {
  manifest: RunManifest;
  claimLedger: ClaimLedger;
  comparisonSchema: ComparisonSchema;
  editorialBrief?: EditorialBrief;
  sectionRenderingConfig?: SectionRenderingConfig;
}

export interface WriteDraftOutput {
  manifest: RunManifest;
  draft: ArticleDraft;
}

export async function writeDraft(input: WriteDraftInput): Promise<WriteDraftOutput> {
  const manifest: RunManifest = {
    ...input.manifest,
    status: 'writing',
    currentStage: 'writeDraft',
    updatedAt: new Date().toISOString(),
  };

  const draft = await runWriter({
    claimLedger: input.claimLedger,
    comparisonSchema: input.comparisonSchema,
    editorialBrief: input.editorialBrief ?? defaultEditorialBrief,
    sectionRenderingConfig: input.sectionRenderingConfig ?? defaultSectionRenderingConfig,
    runId: manifest.runId,
    topic: manifest.topic,
  });

  return {
    manifest: { ...manifest, updatedAt: new Date().toISOString() },
    draft,
  };
}
