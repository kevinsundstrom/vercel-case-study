import { z } from 'zod';
import { SectionIdSchema } from './core';

export const SectionRenderingEntrySchema = z.object({
  render: z.boolean(),
  heading: z.string().min(1).optional(),
  purpose: z.string().min(1),
  instructions: z.string().min(1),
});

export const SectionRenderingConfigSchema = z.record(
  SectionIdSchema,
  SectionRenderingEntrySchema
);

export const EditorialBriefAudienceSchema = z.object({
  role: z.string().min(1),
  context: z.string().min(1),
  priorKnowledge: z.string().min(1),
});

export const EditorialBriefToneSchema = z.object({
  style: z.enum(['technical', 'analytical', 'opinionated']),
  verbosity: z.enum(['tight', 'moderate']),
});

export const EditorialBriefConstraintsSchema = z.object({
  mustBeComparative: z.boolean(),
  noGenericHeadings: z.boolean(),
  noFluff: z.boolean(),
});

export const EditorialBriefSchema = z.object({
  audience: EditorialBriefAudienceSchema,
  objective: z.string().min(1),
  coreThesis: z.string().min(1),
  keyTensions: z.array(z.string().min(1)).min(1),
  readerTakeaway: z.string().min(1),
  tone: EditorialBriefToneSchema,
  constraints: EditorialBriefConstraintsSchema,
});
