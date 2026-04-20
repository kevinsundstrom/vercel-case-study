import type { ClaimLedger } from '../src/types';

/**
 * Hand-written fixture demonstrating a realistic ClaimLedger for the
 * Vercel Workflows vs. Cloudflare Workflows comparison.
 *
 * Traceability chain:
 *   ev_001 → src_001 (Vercel Workflows docs)
 *   ev_002 → src_001 (Vercel Workflows docs)
 *   ev_003 → src_002 (Cloudflare Workflows docs)
 *   ev_004 → src_002 (Cloudflare Workflows docs)
 *
 *   claim_vercel_0001 (sourced)    ← ev_001
 *   claim_vercel_0002 (sourced)    ← ev_002
 *   claim_cf_0001    (sourced)    ← ev_003
 *   claim_cf_0002    (sourced)    ← ev_004
 *   claim_both_0001  (derived)    ← claim_vercel_0001, claim_cf_0001
 *   claim_both_0002  (interpretive) ← claim_both_0001, claim_vercel_0002
 */
export const claimLedgerFixture: ClaimLedger = {
  runId: 'run_a1b2c3d4e5f6',
  createdAt: '2026-04-17T10:00:00.000Z',

  sources: [
    {
      id: 'src_001',
      url: 'https://vercel.com/docs/workflow-vitals',
      title: 'Vercel Workflows — Overview',
      type: 'official_docs',
      retrievedAt: '2026-04-17T09:45:00.000Z',
      excerpt:
        'Vercel Workflows uses async generator functions to define orchestration logic. Each yield point is a durable checkpoint.',
    },
    {
      id: 'src_002',
      url: 'https://developers.cloudflare.com/workflows/',
      title: 'Cloudflare Workflows — Getting Started',
      type: 'official_docs',
      retrievedAt: '2026-04-17T09:46:00.000Z',
      excerpt:
        'A Cloudflare Workflow is a class that extends WorkflowEntrypoint. The run() method defines a series of named steps. Each step is a durable unit of execution.',
    },
  ],

  evidence: [
    {
      id: 'ev_001',
      sourceId: 'src_001',
      quote:
        'Vercel Workflows uses async generator functions to define orchestration logic. Each yield point is a durable checkpoint.',
      context:
        'From the Vercel Workflows overview page, under "How workflows are defined."',
    },
    {
      id: 'ev_002',
      sourceId: 'src_001',
      quote:
        'Because orchestration is expressed as native TypeScript, developers can use standard control flow: if/else, loops, try/catch.',
      context:
        'From the Vercel Workflows overview page, under "Control flow."',
    },
    {
      id: 'ev_003',
      sourceId: 'src_002',
      quote:
        'A Cloudflare Workflow is a class that extends WorkflowEntrypoint. The run() method defines a series of named steps.',
      context:
        'From the Cloudflare Workflows getting started page, under "Defining a workflow."',
    },
    {
      id: 'ev_004',
      sourceId: 'src_002',
      quote:
        'Each step is a durable unit of execution. Cloudflare persists the output of each completed step, so a workflow can resume after failure without re-running completed steps.',
      context:
        'From the Cloudflare Workflows getting started page, under "Durability."',
    },
  ],

  claims: [
    {
      id: 'claim_vercel_0001',
      type: 'sourced',
      text: 'Vercel Workflows defines orchestration logic using async generator functions, with each yield point acting as a durable checkpoint.',
      subject: 'vercel',
      sectionRef: 'orchestration_model',
      evidenceIds: ['ev_001'],
      parentClaimIds: [],
    },
    {
      id: 'claim_vercel_0002',
      type: 'sourced',
      text: 'Because Vercel Workflows uses native TypeScript, developers can express conditional logic with standard if/else, loops, and try/catch.',
      subject: 'vercel',
      sectionRef: 'orchestration_model',
      evidenceIds: ['ev_002'],
      parentClaimIds: [],
    },
    {
      id: 'claim_cf_0001',
      type: 'sourced',
      text: 'Cloudflare Workflows defines a workflow as a class extending WorkflowEntrypoint, with steps declared inside a run() method.',
      subject: 'cloudflare',
      sectionRef: 'orchestration_model',
      evidenceIds: ['ev_003'],
      parentClaimIds: [],
    },
    {
      id: 'claim_cf_0002',
      type: 'sourced',
      text: 'Cloudflare Workflows persists the output of each completed step, enabling resume-after-failure without replaying finished steps.',
      subject: 'cloudflare',
      sectionRef: 'orchestration_model',
      evidenceIds: ['ev_004'],
      parentClaimIds: [],
    },
    {
      id: 'claim_both_0001',
      type: 'derived',
      text: 'Vercel and Cloudflare represent two distinct orchestration philosophies: code-as-orchestrator (Vercel) vs. step-as-contract (Cloudflare).',
      subject: 'both',
      sectionRef: 'orchestration_model',
      evidenceIds: [],
      parentClaimIds: ['claim_vercel_0001', 'claim_cf_0001'],
    },
    {
      id: 'claim_both_0002',
      type: 'interpretive',
      text: 'Vercel Workflows favors developer ergonomics and expressive control flow; Cloudflare Workflows favors explicit durability boundaries and predictable step isolation.',
      subject: 'both',
      sectionRef: 'developer_implications',
      evidenceIds: [],
      parentClaimIds: ['claim_both_0001', 'claim_vercel_0002'],
      notes: 'This is the thesis-level interpretive claim. Handle carefully in repair.',
    },
  ],
};
