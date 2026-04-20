import type { EvidencePack } from '../src/types';

export const evidencePackVercelFixture: EvidencePack = {
  runId: 'run_a1b2c3d4e5f6',
  vendor: 'vercel',
  createdAt: '2026-04-17T10:08:00.000Z',
  sources: [
    {
      id: 'src_v001',
      url: 'https://vercel.com/docs/workflow-vitals',
      title: 'Vercel Workflows — Overview',
      type: 'official_docs',
      retrievedAt: '2026-04-17T10:06:00.000Z',
      excerpt:
        'Vercel Workflows uses async generator functions to define orchestration logic. Each yield point is a durable checkpoint.',
    },
  ],
  extracts: [
    {
      id: 'rex_v001',
      sourceId: 'src_v001',
      quote:
        'Vercel Workflows uses async generator functions to define orchestration logic. Each yield point is a durable checkpoint.',
      context:
        'From the Workflows overview page, under "How workflows are defined."',
      dimensionHint: 'orchestration_model',
    },
    {
      id: 'rex_v002',
      sourceId: 'src_v001',
      quote:
        'Because orchestration is expressed as native TypeScript, developers can use standard control flow: if/else, loops, try/catch.',
      context:
        'From the Workflows overview page, under "Control flow."',
      dimensionHint: 'control_flow_model',
    },
    {
      id: 'rex_v003',
      sourceId: 'src_v001',
      quote:
        'Workflows run on Vercel Fluid Compute, which supports full Node.js and resumes execution after infrastructure interruptions.',
      context:
        'From the Workflows overview page, under "Infrastructure."',
      dimensionHint: 'system_boundary',
    },
    {
      id: 'rex_v004',
      sourceId: 'src_v001',
      quote:
        'Typical use cases include AI pipelines, multi-step data processing, and any long-running tasks that require reliable execution.',
      context:
        'From the Workflows overview page, under "When to use Workflows."',
      dimensionHint: 'primary_use_case_shape',
    },
  ],
};
