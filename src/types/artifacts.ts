import type { ComparisonDimensionKey, RunStatus } from './core';
import type { EvidenceSource, RawExtract } from './claims';
import type { ArticleSection } from './sections';

export interface RunConfig {
  maxRepairIterations: number;
  targetWordCount: number;
  articleVersion: string;
}

export interface ArtifactRefs {
  evidencePack?: string;
  claimLedger?: string;
  comparisonSchema?: string;
  articleDraft?: string;
  verificationReport?: string;
  lintReport?: string;
  repairPlan?: string;
  finalizationReport?: string;
}

export interface EvidencePack {
  runId: string;
  vendor: 'vercel' | 'cloudflare';
  sources: EvidenceSource[];
  /** Pre-normalization extracts from the researcher agent. */
  extracts: RawExtract[];
  createdAt: string;
}

export interface RunManifest {
  runId: string;
  topic: string;
  status: RunStatus;
  currentStage: string;
  createdAt: string;
  updatedAt: string;
  config: RunConfig;
  artifactRefs: ArtifactRefs;
}

export interface ComparisonDimensionEntry {
  dimension: ComparisonDimensionKey;
  /** Human-readable label for the dimension. */
  label: string;
  vercel: string;
  cloudflare: string;
  /** Claim IDs that support this dimension's values. */
  claimIds: string[];
}

export interface ComparisonSchema {
  runId: string;
  dimensions: ComparisonDimensionEntry[];
  createdAt: string;
}

export interface ArticleDraft {
  runId: string;
  version: number;
  /** Full Markdown rendering of the article, stitched from sections. */
  markdown: string;
  sections: ArticleSection[];
  totalWordCount: number;
  createdAt: string;
}

export interface FinalizationReport {
  runId: string;
  draftVersion: number;
  repairIterations: number;
  wordCount: number;
  claimCount: number;
  evidenceCount: number;
  passed: boolean;
  finalizedAt: string;
}
