import type { SourcePlan } from '../src/types';

export const sourcePlanFixture: SourcePlan = {
  runId: 'run_a1b2c3d4e5f6',
  prompt: 'Vercel Workflows vs. Cloudflare Workflows',
  generatedAt: '2026-04-17T10:02:00.000Z',
  vendorPlans: {
    vercel: {
      subject: 'vercel',
      researchQuestions: [
        {
          id: 'q_v_001',
          question: 'How does Vercel Workflows define the boundary between one durable unit of execution and the next?',
          dimensionKey: 'orchestration_model',
          type: 'definitional',
          priority: 'high',
        },
        {
          id: 'q_v_002',
          question: 'What programming construct does Vercel use to express workflow logic — a class, a function, or something else?',
          dimensionKey: 'workflow_definition_model',
          type: 'definitional',
          priority: 'high',
        },
        {
          id: 'q_v_003',
          question: 'What happens to in-progress Vercel Workflows if the underlying compute instance is interrupted?',
          dimensionKey: 'durability_model',
          type: 'evidence_critical',
          priority: 'high',
        },
        {
          id: 'q_v_004',
          question: 'Does Vercel Workflows allow standard TypeScript control flow (if/else, loops) between durable checkpoints?',
          dimensionKey: 'control_flow_model',
          type: 'evidence_critical',
          priority: 'medium',
        },
        {
          id: 'q_v_005',
          question: 'What Vercel infrastructure does Workflows run on — Edge, Fluid Compute, or another runtime?',
          dimensionKey: 'system_boundary',
          type: 'definitional',
          priority: 'medium',
        },
        {
          id: 'q_v_006',
          question: 'What use cases does Vercel describe as the primary fit for Workflows?',
          dimensionKey: 'primary_use_case_shape',
          type: 'comparative',
          priority: 'medium',
        },
      ],
      priorityQuestions: ['q_v_001', 'q_v_002', 'q_v_003'],
      dimensionsCovered: [
        'orchestration_model',
        'workflow_definition_model',
        'control_flow_model',
        'durability_model',
        'system_boundary',
        'primary_use_case_shape',
      ],
      candidateUrls: [
        'https://vercel.com/docs/workflow-vitals',
        'https://vercel.com/docs/functions/runtimes',
        'https://vercel.com/blog/workflow-vitals',
      ],
      notes:
        'Focus on official Vercel docs. Prioritize any pages describing the async generator / checkpoint model if confirmed.',
    },
    cloudflare: {
      subject: 'cloudflare',
      researchQuestions: [
        {
          id: 'q_c_001',
          question: 'How does a Cloudflare Workflow define the boundary between durable execution steps?',
          dimensionKey: 'orchestration_model',
          type: 'definitional',
          priority: 'high',
        },
        {
          id: 'q_c_002',
          question: 'What programming construct is used to declare a Cloudflare Workflow — a class, a function, or a config file?',
          dimensionKey: 'workflow_definition_model',
          type: 'definitional',
          priority: 'high',
        },
        {
          id: 'q_c_003',
          question: 'How does Cloudflare Workflows handle partial execution — if a step completes but the workflow crashes before finishing, what state is preserved?',
          dimensionKey: 'durability_model',
          type: 'evidence_critical',
          priority: 'high',
        },
        {
          id: 'q_c_004',
          question: 'Can Cloudflare Workflow steps contain arbitrary logic, or must they follow specific structural constraints?',
          dimensionKey: 'control_flow_model',
          type: 'evidence_critical',
          priority: 'medium',
        },
        {
          id: 'q_c_005',
          question: 'What Cloudflare infrastructure underpins Workflows — Durable Objects, Workers, or a separate system?',
          dimensionKey: 'system_boundary',
          type: 'definitional',
          priority: 'medium',
        },
        {
          id: 'q_c_006',
          question: 'What use cases does Cloudflare describe as the primary fit for Workflows?',
          dimensionKey: 'primary_use_case_shape',
          type: 'comparative',
          priority: 'medium',
        },
      ],
      priorityQuestions: ['q_c_001', 'q_c_002', 'q_c_003'],
      dimensionsCovered: [
        'orchestration_model',
        'workflow_definition_model',
        'control_flow_model',
        'durability_model',
        'system_boundary',
        'primary_use_case_shape',
      ],
      candidateUrls: [
        'https://developers.cloudflare.com/workflows/',
        'https://developers.cloudflare.com/workflows/get-started/guide/',
        'https://developers.cloudflare.com/workflows/reference/durable-objects/',
      ],
      notes:
        'Focus on official Cloudflare developer docs. Confirm whether Durable Objects are the underlying mechanism.',
    },
  },
};
