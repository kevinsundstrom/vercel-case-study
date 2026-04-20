import type { ComparisonDimensionKey } from '../types';

export interface DimensionSpec {
  key: ComparisonDimensionKey;
  label: string;
  description: string;
  /** Guidance for the writer filling this dimension. */
  writerNote: string;
}

export const comparisonDimensions: DimensionSpec[] = [
  {
    key: 'orchestration_model',
    label: 'Orchestration Model',
    description: 'How orchestration logic is expressed and controlled.',
    writerNote:
      'Vercel: code-as-orchestrator via async generators. Cloudflare: step-based class definition. This is the thesis dimension — be specific.',
  },
  {
    key: 'workflow_definition_model',
    label: 'Workflow Definition Model',
    description: 'How a workflow is declared and structured in code.',
    writerNote:
      'Vercel uses function composition; Cloudflare uses a Workflow class extending a base class with a run() method.',
  },
  {
    key: 'control_flow_model',
    label: 'Control Flow Model',
    description: 'How branching, loops, and conditional logic are expressed.',
    writerNote:
      'Vercel leverages native language constructs (if/else, loops). Cloudflare constrains control flow to explicit step boundaries.',
  },
  {
    key: 'durability_model',
    label: 'Durability Model',
    description: 'How execution state is persisted and resumed across failures.',
    writerNote:
      'Describe the durability boundary — per-step vs. per-yield. Note what happens on worker crash.',
  },
  {
    key: 'system_boundary',
    label: 'System Boundary',
    description: 'Where the workflow runs and what infrastructure it assumes.',
    writerNote:
      'Vercel: Fluid Compute, Node.js, Vercel platform. Cloudflare: Durable Objects, Workers runtime, Cloudflare platform.',
  },
  {
    key: 'primary_use_case_shape',
    label: 'Primary Use Case Shape',
    description: 'The class of problems each approach is best suited for.',
    writerNote:
      'Favor concrete examples. Avoid generic "best for complex workflows" language.',
  },
];
