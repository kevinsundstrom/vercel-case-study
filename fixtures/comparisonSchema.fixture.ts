import type { ComparisonSchema } from '../src/types';

export const comparisonSchemaFixture: ComparisonSchema = {
  runId: 'run_a1b2c3d4e5f6',
  createdAt: '2026-04-17T10:05:00.000Z',
  dimensions: [
    {
      dimension: 'orchestration_model',
      label: 'Orchestration Model',
      vercel: 'Code-as-orchestrator: async generator functions with yield-point checkpointing',
      cloudflare: 'Step-based class model: WorkflowEntrypoint subclass with named steps in run()',
      claimIds: ['claim_vercel_0001', 'claim_cf_0001', 'claim_both_0001'],
    },
    {
      dimension: 'workflow_definition_model',
      label: 'Workflow Definition Model',
      vercel: 'Plain TypeScript function using async generators; no special class required',
      cloudflare: 'Class extending WorkflowEntrypoint; workflow is the class, steps are method calls inside run()',
      claimIds: ['claim_vercel_0001', 'claim_cf_0001'],
    },
    {
      dimension: 'control_flow_model',
      label: 'Control Flow Model',
      vercel: 'Native language constructs (if/else, for loops, try/catch) — no special DSL',
      cloudflare: 'Control flow is expressed around step boundaries; within a step, standard JS applies',
      claimIds: ['claim_vercel_0002', 'claim_cf_0001'],
    },
    {
      dimension: 'durability_model',
      label: 'Durability Model',
      vercel: 'Durable at yield points; state persisted per checkpoint in the async generator',
      cloudflare: 'Durable at step boundaries; completed step output is persisted, steps do not re-run on resume',
      claimIds: ['claim_vercel_0001', 'claim_cf_0002'],
    },
    {
      dimension: 'system_boundary',
      label: 'System Boundary',
      vercel: 'Vercel platform; Fluid Compute; full Node.js runtime',
      cloudflare: 'Cloudflare platform; Durable Objects + Workers runtime; V8 isolates',
      claimIds: ['claim_vercel_0001', 'claim_cf_0001'],
    },
    {
      dimension: 'primary_use_case_shape',
      label: 'Primary Use Case Shape',
      vercel: 'Multi-step pipelines with complex branching, conditional paths, and rich TypeScript logic',
      cloudflare: 'Reliable multi-step jobs where each step is an independent, retryable unit of work',
      claimIds: ['claim_both_0001', 'claim_both_0002'],
    },
  ],
};
