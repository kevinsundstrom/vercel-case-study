import type { ArticleDraft } from '../src/types';

/**
 * Hand-written fixture demonstrating a realistic ArticleDraft for the
 * Vercel Workflows vs. Cloudflare Workflows comparison.
 *
 * Claim traceability:
 *   claim_both_0001  (derived)      → short_answer, orchestration_model
 *   claim_vercel_0001 (sourced)     → what_is_compared, orchestration_model
 *   claim_cf_0001     (sourced)     → what_is_compared, orchestration_model
 *   claim_vercel_0002 (sourced)     → orchestration_model
 *   claim_cf_0002     (sourced)     → orchestration_model
 *   claim_both_0002   (interpretive) → developer_implications, when_to_use, bottom_line
 */
export const articleDraftFixture: ArticleDraft = {
  runId: 'run_a1b2c3d4e5f6',
  version: 1,
  createdAt: '2026-04-17T10:05:00.000Z',
  totalWordCount: 612,
  markdown: `## Short Answer

Vercel Workflows and Cloudflare Workflows both provide durable execution, but they express it differently: Vercel treats your TypeScript code as the orchestrator, while Cloudflare makes each named step an explicit contract. The choice is between expressive control flow and predictable step isolation.

---

## What Is Being Compared

Vercel Workflows is an orchestration primitive on the Vercel platform that uses async generator functions to define long-running, durable processes. Each \`yield\` point in the generator acts as a checkpoint; if the underlying compute is interrupted, execution resumes from the last checkpoint.

Cloudflare Workflows is a durable execution primitive built on the Cloudflare Workers runtime and backed by Durable Objects. A workflow is defined as a TypeScript class extending \`WorkflowEntrypoint\`, with individual steps declared inside a \`run()\` method.

---

## Orchestration Model

Vercel Workflows defines orchestration logic using async generator functions. The developer writes ordinary TypeScript — \`if/else\`, loops, \`try/catch\` — and the runtime tracks durability at each \`yield\`. There is no structural boundary between orchestration logic and step logic; the generator body is both.

Cloudflare Workflows takes the opposite position. A workflow is a class; each unit of work is a named \`step()\` call inside \`run()\`. The step boundary is explicit, not inferred. Cloudflare persists the output of each completed step, so a workflow resumes after failure without replaying finished steps.

Vercel and Cloudflare represent two distinct orchestration philosophies: code-as-orchestrator versus step-as-contract. Vercel collapses the boundary between workflow definition and control flow; Cloudflare enforces it.

---

## What This Means for Developers

Vercel Workflows favors developer ergonomics and expressive control flow. Because orchestration is native TypeScript, there is no new API surface for branching or looping — the language itself handles it.

Cloudflare Workflows favors explicit durability boundaries and predictable step isolation. The step contract makes it clear exactly what has and has not run; failure recovery is deterministic.

The practical implication: Vercel is faster to prototype with when the workflow logic is complex; Cloudflare gives more operational visibility when step-level auditability matters.

---

## Comparison Table

| Dimension | Vercel | Cloudflare |
|---|---|---|
| Orchestration Model | Async generator function; yield points are durable checkpoints | Class-based WorkflowEntrypoint; named step() calls in run() |
| Workflow Definition Model | Function composition using native TypeScript generators | Class extending WorkflowEntrypoint with a run() method |
| Control Flow Model | Native language constructs (if/else, loops, try/catch) | Constrained to explicit step boundaries |
| Durability Model | Checkpoint per yield point | Persisted output per completed step; resume without replay |
| System Boundary | Vercel platform, Node.js, Fluid Compute | Cloudflare Workers runtime, Durable Objects |
| Primary Use Case Shape | Long-running processes with complex conditional logic | Step-oriented pipelines where per-step auditability is required |

---

## When Each Approach Makes Sense

Choose Vercel Workflows when your orchestration logic is branchy or iterative and you want to express it as ordinary async TypeScript without learning a step API. The ergonomics are lower-friction for workflows that resemble imperative programs.

Choose Cloudflare Workflows when you need clear step-level visibility, when step replay safety matters, or when you are already running on the Cloudflare Workers platform. The explicit step contract makes operational reasoning straightforward.

---

## Bottom Line

Vercel Workflows and Cloudflare Workflows solve the same problem — durable, resumable execution — with different abstractions. Vercel bets on the developer's existing language intuitions; Cloudflare bets on explicit step contracts. Neither is universally better; the right choice depends on whether expressive control flow or step-level predictability is the higher priority for your workload.`,
  sections: [
    {
      id: 'short_answer',
      title: 'Short Answer',
      content:
        'Vercel Workflows and Cloudflare Workflows both provide durable execution, but they express it differently: Vercel treats your TypeScript code as the orchestrator, while Cloudflare makes each named step an explicit contract. The choice is between expressive control flow and predictable step isolation.',
      claimIds: ['claim_both_0001'],
      wordCount: 55,
    },
    {
      id: 'what_is_compared',
      title: 'What Is Being Compared',
      content:
        "Vercel Workflows is an orchestration primitive on the Vercel platform that uses async generator functions to define long-running, durable processes. Each `yield` point in the generator acts as a checkpoint; if the underlying compute is interrupted, execution resumes from the last checkpoint.\n\nCloudflare Workflows is a durable execution primitive built on the Cloudflare Workers runtime and backed by Durable Objects. A workflow is defined as a TypeScript class extending `WorkflowEntrypoint`, with individual steps declared inside a `run()` method.",
      claimIds: ['claim_vercel_0001', 'claim_cf_0001'],
      wordCount: 93,
    },
    {
      id: 'orchestration_model',
      title: 'Orchestration Model',
      content:
        "Vercel Workflows defines orchestration logic using async generator functions. The developer writes ordinary TypeScript — `if/else`, loops, `try/catch` — and the runtime tracks durability at each `yield`. There is no structural boundary between orchestration logic and step logic; the generator body is both.\n\nCloudflare Workflows takes the opposite position. A workflow is a class; each unit of work is a named `step()` call inside `run()`. The step boundary is explicit, not inferred. Cloudflare persists the output of each completed step, so a workflow resumes after failure without replaying finished steps.\n\nVercel and Cloudflare represent two distinct orchestration philosophies: code-as-orchestrator versus step-as-contract. Vercel collapses the boundary between workflow definition and control flow; Cloudflare enforces it.",
      claimIds: ['claim_vercel_0001', 'claim_vercel_0002', 'claim_cf_0001', 'claim_cf_0002', 'claim_both_0001'],
      wordCount: 130,
    },
    {
      id: 'developer_implications',
      title: 'What This Means for Developers',
      content:
        'Vercel Workflows favors developer ergonomics and expressive control flow. Because orchestration is native TypeScript, there is no new API surface for branching or looping — the language itself handles it.\n\nCloudflare Workflows favors explicit durability boundaries and predictable step isolation. The step contract makes it clear exactly what has and has not run; failure recovery is deterministic.\n\nThe practical implication: Vercel is faster to prototype with when the workflow logic is complex; Cloudflare gives more operational visibility when step-level auditability matters.',
      claimIds: ['claim_both_0002'],
      wordCount: 95,
    },
    {
      id: 'comparison_table',
      title: 'Comparison Table',
      content:
        '| Dimension | Vercel | Cloudflare |\n|---|---|---|\n| Orchestration Model | Async generator function; yield points are durable checkpoints | Class-based WorkflowEntrypoint; named step() calls in run() |\n| Workflow Definition Model | Function composition using native TypeScript generators | Class extending WorkflowEntrypoint with a run() method |\n| Control Flow Model | Native language constructs (if/else, loops, try/catch) | Constrained to explicit step boundaries |\n| Durability Model | Checkpoint per yield point | Persisted output per completed step; resume without replay |\n| System Boundary | Vercel platform, Node.js, Fluid Compute | Cloudflare Workers runtime, Durable Objects |\n| Primary Use Case Shape | Long-running processes with complex conditional logic | Step-oriented pipelines where per-step auditability is required |',
      claimIds: ['claim_vercel_0001', 'claim_vercel_0002', 'claim_cf_0001', 'claim_cf_0002'],
      wordCount: 88,
    },
    {
      id: 'when_to_use',
      title: 'When Each Approach Makes Sense',
      content:
        'Choose Vercel Workflows when your orchestration logic is branchy or iterative and you want to express it as ordinary async TypeScript without learning a step API. The ergonomics are lower-friction for workflows that resemble imperative programs.\n\nChoose Cloudflare Workflows when you need clear step-level visibility, when step replay safety matters, or when you are already running on the Cloudflare Workers platform. The explicit step contract makes operational reasoning straightforward.',
      claimIds: ['claim_both_0002'],
      wordCount: 80,
    },
    {
      id: 'bottom_line',
      title: 'Bottom Line',
      content:
        'Vercel Workflows and Cloudflare Workflows solve the same problem — durable, resumable execution — with different abstractions. Vercel bets on the developer\'s existing language intuitions; Cloudflare bets on explicit step contracts. Neither is universally better; the right choice depends on whether expressive control flow or step-level predictability is the higher priority for your workload.',
      claimIds: ['claim_both_0001', 'claim_both_0002'],
      wordCount: 71,
    },
  ],
};
