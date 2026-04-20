import { z } from 'zod';
import { ComparisonDimensionKeySchema } from './core';

export const ResearchQuestionTypeSchema = z.enum([
  'definitional',
  'comparative',
  'evidence_critical',
]);

export const ResearchQuestionPrioritySchema = z.enum(['high', 'medium', 'low']);

export const ResearchQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  dimensionKey: ComparisonDimensionKeySchema,
  type: ResearchQuestionTypeSchema,
  priority: ResearchQuestionPrioritySchema,
});

export const VendorPlanSchema = z.object({
  subject: z.enum(['vercel', 'cloudflare']),
  researchQuestions: z.array(ResearchQuestionSchema),
  priorityQuestions: z.array(z.string()),
  dimensionsCovered: z.array(ComparisonDimensionKeySchema),
  candidateUrls: z.array(z.string()),
  notes: z.string(),
});

export const SourcePlanSchema = z.object({
  runId: z.string(),
  prompt: z.string(),
  generatedAt: z.string().datetime(),
  vendorPlans: z.object({
    vercel: VendorPlanSchema,
    cloudflare: VendorPlanSchema,
  }),
});
