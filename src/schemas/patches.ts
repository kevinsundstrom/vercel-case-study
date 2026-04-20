import { z } from 'zod';
import { PatchOpTypeSchema, PatchStrategySchema, SectionIdSchema } from './core';

export const PatchOpSchema = z.object({
  type: PatchOpTypeSchema,
  sectionId: SectionIdSchema,
  spanId: z.string().optional(),
  paragraphIndex: z.number().int().nonnegative().optional(),
  afterId: z.string().optional(),
  newContent: z.string().optional(),
});

export const RejectedOpSchema = z.object({
  op: PatchOpSchema,
  reason: z.string(),
});

export const PatchRequestSchema = z.object({
  runId: z.string(),
  draftVersion: z.number().int().positive(),
  issueIds: z.array(z.string()).min(1),
  ops: z.array(PatchOpSchema).min(1),
  rationale: z.string(),
  requestedBy: z.enum(['repair_writer', 'system']),
  createdAt: z.string().datetime(),
});

export const PatchResponseSchema = z.object({
  runId: z.string(),
  sourceDraftVersion: z.number().int().positive(),
  resultDraftVersion: z.number().int().positive(),
  appliedOps: z.array(PatchOpSchema),
  rejectedOps: z.array(RejectedOpSchema),
  success: z.boolean(),
  appliedAt: z.string().datetime(),
});

export const RepairStepSchema = z.object({
  issueId: z.string(),
  issueType: z.enum(['verification', 'lint']),
  strategy: PatchStrategySchema,
  patch: PatchRequestSchema,
});

export const RepairPlanSchema = z.object({
  runId: z.string(),
  draftVersion: z.number().int().positive(),
  iterationNumber: z.number().int().positive(),
  steps: z.array(RepairStepSchema).min(1),
  createdAt: z.string().datetime(),
});
