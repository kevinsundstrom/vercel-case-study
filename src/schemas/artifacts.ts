import { z } from 'zod';
import {
  ClaimTypeSchema,
  ComparisonDimensionKeySchema,
  ComparisonSubjectSchema,
  EvidenceSourceTypeSchema,
  RunStatusSchema,
  SectionIdSchema,
} from './core';

export const RawExtractSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  quote: z.string().min(1),
  context: z.string(),
  dimensionHint: ComparisonDimensionKeySchema.optional(),
});

export const EvidencePackSchema = z.object({
  runId: z.string(),
  vendor: z.enum(['vercel', 'cloudflare']),
  sources: z.array(
    z.object({
      id: z.string(),
      url: z.string().url(),
      title: z.string(),
      type: EvidenceSourceTypeSchema,
      retrievedAt: z.string().datetime(),
      excerpt: z.string(),
    })
  ),
  extracts: z.array(RawExtractSchema),
  createdAt: z.string().datetime(),
});

export const EvidenceSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  quote: z.string().min(1),
  context: z.string(),
});

export const ClaimSchema = z.object({
  id: z.string(),
  type: ClaimTypeSchema,
  text: z.string().min(1),
  subject: ComparisonSubjectSchema,
  sectionRef: SectionIdSchema,
  evidenceIds: z.array(z.string()),
  parentClaimIds: z.array(z.string()),
  notes: z.string().optional(),
});

export const EvidenceSourceSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  type: EvidenceSourceTypeSchema,
  retrievedAt: z.string().datetime(),
  excerpt: z.string(),
});

export const ClaimLedgerSchema = z.object({
  runId: z.string(),
  claims: z.array(ClaimSchema),
  evidence: z.array(EvidenceSchema),
  sources: z.array(EvidenceSourceSchema),
  createdAt: z.string().datetime(),
});

export const ComparisonDimensionEntrySchema = z.object({
  dimension: ComparisonDimensionKeySchema,
  label: z.string(),
  vercel: z.string(),
  cloudflare: z.string(),
  claimIds: z.array(z.string()),
});

export const ComparisonSchemaSchema = z.object({
  runId: z.string(),
  dimensions: z.array(ComparisonDimensionEntrySchema),
  createdAt: z.string().datetime(),
});

export const ArticleSectionSchema = z.object({
  id: SectionIdSchema,
  title: z.string(),
  content: z.string(),
  claimIds: z.array(z.string()),
  wordCount: z.number().int().nonnegative(),
});

export const ArticleDraftSchema = z.object({
  runId: z.string(),
  version: z.number().int().positive(),
  markdown: z.string(),
  sections: z.array(ArticleSectionSchema),
  totalWordCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});

export const RunConfigSchema = z.object({
  maxRepairIterations: z.number().int().positive(),
  targetWordCount: z.number().int().positive(),
  articleVersion: z.string(),
});

export const ArtifactRefsSchema = z.object({
  evidencePack: z.string().optional(),
  claimLedger: z.string().optional(),
  comparisonSchema: z.string().optional(),
  articleDraft: z.string().optional(),
  verificationReport: z.string().optional(),
  lintReport: z.string().optional(),
  repairPlan: z.string().optional(),
  finalizationReport: z.string().optional(),
});

export const RunManifestSchema = z.object({
  runId: z.string(),
  topic: z.string(),
  status: RunStatusSchema,
  currentStage: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  config: RunConfigSchema,
  artifactRefs: ArtifactRefsSchema,
});

export const FinalizationReportSchema = z.object({
  runId: z.string(),
  draftVersion: z.number().int().positive(),
  repairIterations: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
  claimCount: z.number().int().nonnegative(),
  evidenceCount: z.number().int().nonnegative(),
  passed: z.boolean(),
  finalizedAt: z.string().datetime(),
});
