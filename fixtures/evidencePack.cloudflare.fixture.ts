import type { EvidencePack } from '../src/types';

export const evidencePackCloudflareFixture: EvidencePack = {
  runId: 'run_a1b2c3d4e5f6',
  vendor: 'cloudflare',
  createdAt: '2026-04-17T10:09:00.000Z',
  sources: [
    {
      id: 'src_c001',
      url: 'https://developers.cloudflare.com/workflows/',
      title: 'Cloudflare Workflows — Overview',
      type: 'official_docs',
      retrievedAt: '2026-04-17T10:07:00.000Z',
      excerpt:
        'A Cloudflare Workflow is a class that extends WorkflowEntrypoint. The run() method defines a series of named steps.',
    },
  ],
  extracts: [
    {
      id: 'rex_c001',
      sourceId: 'src_c001',
      quote:
        'A Cloudflare Workflow is a class that extends WorkflowEntrypoint. The run() method defines a series of named steps. Each step is a durable unit of execution.',
      context:
        'From the Workflows overview page, under "Defining a workflow."',
      dimensionHint: 'orchestration_model',
    },
    {
      id: 'rex_c002',
      sourceId: 'src_c001',
      quote:
        'Each step is a durable unit of execution. Cloudflare persists the output of each completed step, so a workflow can resume after failure without re-running completed steps.',
      context:
        'From the Workflows overview page, under "Durability."',
      dimensionHint: 'durability_model',
    },
    {
      id: 'rex_c003',
      sourceId: 'src_c001',
      quote:
        'Cloudflare Workflows is built on Durable Objects, which provide persistent state and guaranteed execution across Cloudflare\'s global network.',
      context:
        'From the Workflows overview page, under "Infrastructure."',
      dimensionHint: 'system_boundary',
    },
    {
      id: 'rex_c004',
      sourceId: 'src_c001',
      quote:
        'Workflows are designed for long-running background jobs, multi-step data pipelines, and tasks that require reliable retry and resume semantics.',
      context:
        'From the Workflows overview page, under "When to use Workflows."',
      dimensionHint: 'primary_use_case_shape',
    },
  ],
};
