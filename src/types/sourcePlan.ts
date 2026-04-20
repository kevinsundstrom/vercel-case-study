import type { ComparisonDimensionKey } from './core';

export type ResearchQuestionType = 'definitional' | 'comparative' | 'evidence_critical';
export type ResearchQuestionPriority = 'high' | 'medium' | 'low';

export interface ResearchQuestion {
  id: string;
  question: string;
  dimensionKey: ComparisonDimensionKey;
  type: ResearchQuestionType;
  priority: ResearchQuestionPriority;
}

export interface VendorPlan {
  subject: 'vercel' | 'cloudflare';
  researchQuestions: ResearchQuestion[];
  /** IDs of researchQuestions with priority === 'high'. */
  priorityQuestions: string[];
  dimensionsCovered: ComparisonDimensionKey[];
  candidateUrls: string[];
  notes: string;
}

export interface SourcePlan {
  runId: string;
  /** The original article topic / prompt. */
  prompt: string;
  generatedAt: string;
  vendorPlans: {
    vercel: VendorPlan;
    cloudflare: VendorPlan;
  };
}
