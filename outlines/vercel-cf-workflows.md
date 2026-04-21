# Vercel Workflows vs Cloudflare Workflows: how much platform do you need?

## Audience
Full-stack TypeScript developers building long-running agentic systems. Know async/await, have heard of Temporal, may have used GitHub Actions for orchestration-adjacent tasks. Not Temporal experts. Evaluating Vercel or Cloudflare as their primary deployment platform.

## Goal
Help developers understand the architectural difference between the two systems well enough to make an informed choice. Land Vercel as the favorable default for the application developer without being uncritical. Credibility is the mechanism, not enthusiasm.

## Length
1,200 to 1,500 words. No more.

## Hard constraints for the writer
- No em dashes. Use a period or restructure the sentence.
- Oxford comma required in all lists.
- No summary conclusions. Do not open the closing section with "Overall," "In conclusion," or "In summary."
- No hype openings.
- No banned words: delve, utilize, streamline, harness, robust.
- Specific numbers over vague claims. If the outline provides a number, use it. Do not invent numbers not present in this outline.
- Do not add technical claims not present in this outline.
- Do not editorialize after code blocks.
- Short paragraphs. Two to four sentences maximum.
- Peer-to-peer tone. One developer talking to another.

---

## Section 1: Opening

Establish that the question has changed. Do not open with enthusiasm or a product announcement. Open in motion.

The old problem: durable execution required adopting a whole separate platform — a Temporal cluster, an Inngest organization, an AWS Step Functions state machine — on top of your application. That was the tax developers paid for reliability. Vercel and Cloudflare have both shipped durable execution as a native platform primitive. The calculus is shifting.

Close this section with this line or a close variant: "The difference isn't in how they recover execution. It's in where durability lives in your mental model."

---

## Section 2: The execution model both engines share

Heading: The execution model both engines share

Both Vercel Workflows and Cloudflare Workflows use replay-with-memoization. This is the same execution model Temporal pioneered and the category consensus. When a workflow resumes after a pause or failure, the workflow function re-executes from the top. Completed step calls are short-circuited using cached outputs from a persistent store. Neither engine is novel at the execution-model layer. The differentiation is in packaging, language surface, and platform integration depth.

CRITICAL: Do not claim Vercel uses replay and Cloudflare uses checkpoints. Both use replay-with-memoization. This is confirmed from both companies' primary source documentation.

Sources this section draws from:
- vercel.com/blog/a-new-programming-model-for-durable-execution
- blog.cloudflare.com/building-workflows-durable-execution-on-workers/

---

## Section 3: Where durability lives

Heading: Where durability lives

This is the conceptual heart of the piece. Explain the real architectural difference in terms a developer will feel, not just understand.

Vercel's thesis, stated in their GA post: your code is the orchestrator. Durability is applied via two directives — "use workflow" on the function, "use step" on each unit of work. No separate orchestration service. No new class to extend. No YAML. Quote to use: "At first glance, this looks like one function calling another, and that is exactly the point."

Cloudflare's model: every workflow instance is an Engine Durable Object backed by SQLite. The user's run(event, step) method is driven by the Engine via JavaScript RPC. Step names supplied by the developer act as the cache key. Quote to use: "What if we could model the engine as a game loop?"

Include this code block exactly as written. Do not editorialize after it.

Vercel:
```typescript
async function createSite(params: Params) {
  "use workflow";
  const repo = await createRepo(params);
  const site = await deploySite(repo);
  return site;
}

async function createRepo(params: Params) {
  "use step";
  // creates GitHub repo
}

async function deploySite(repo: Repo) {
  "use step";
  // deploys to Vercel
}
```

Cloudflare:
```typescript
export class MySiteWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const repo = await step.do("create repo", async () => {
      // creates GitHub repo
    });
    const site = await step.do("deploy site", async () => {
      // deploys to Vercel
    });
    return site;
  }
}
```

---

## Section 4: Storage topology and portability

Heading: Storage topology and portability

Vercel persists state to a managed event log. The storage layer is abstracted via the Worlds system — an adapter pattern that makes the event log pluggable. Ships with a Managed World (Vercel infrastructure), a Local World for development, and a Postgres reference implementation for self-hosting. Community Worlds include Redis, Turso, MongoDB, Jazz Cloud, and Cloudflare's own storage primitives. The SDK is open source. It runs on any platform.

Cloudflare persists state to a SQLite database co-located inside each workflow's Engine Durable Object. State and compute are pinned together at the edge across 330+ Cloudflare cities. Tight integration with D1, R2, Queues, and the Agents SDK. No self-hosted path. Running Cloudflare Workflows means running on Cloudflare.

Do not frame the Cloudflare model as wrong. Edge-local state has real advantages for latency-sensitive workloads. Present the tradeoff, not a verdict.

---

## Section 5: Implicit vs explicit step identity

Heading: Implicit vs explicit step identity

In October 2025, Inngest published a direct response to Vercel's Workflow SDK launch arguing that implicit step identification creates a production stability risk. Their argument: when developers update their code, running workflows can break if step identity is tied to position rather than an explicit name. Their own experience: it looked cleaner in demos, then users deployed to production and updated their code.

Vercel's architectural answer: the compiler generates stable step IDs from the function's filepath and function name, not its position in the call stack. Atomic versioning in the World ensures in-flight runs finish on the deployment they started. Deploy skew protection pegs each run to a specific deployment version.

This is a live debate. The stability of implicit step IDs across real-world code changes — renamed files, moved functions, refactored modules — is something each team needs to evaluate. Do not declare a winner.

Sources:
- inngest.com/blog/explicit-apis-vs-magic-directives
- useworkflow.dev/docs/how-it-works/understanding-directives

---

## Section 6: Real limitations, not footnotes

Heading: Real limitations, not footnotes

This section must be genuinely honest. Soft-pedaling will be noticed by technical readers.

Vercel: replay overhead grows as event histories lengthen. Vercel's own docs recommend splitting into child workflows once a run exceeds roughly 2,000 events. Workflows 5 plans a snapshot-based runtime to reduce replay cost as histories grow — this is on their public roadmap. Workflow functions must be fully deterministic: no Math.random(), no Date.now(), no I/O outside of steps. This is a category-wide constraint, not unique to Vercel, but it is a real programming model discipline.

Cloudflare: runs only on Cloudflare — no portability path. A Hacker News thread from April 2026 documented startup delays of up to four minutes before workflow instances started under normal load, not only under stress. Cloudflare's V2 rearchitecture in April 2026 addressed scaling pressure from agent workloads, which indicates earlier limits were real constraints.

Sources:
- Vercel docs on workflow limits
- vercel.com/blog/a-new-programming-model-for-durable-execution (Workflows 5 roadmap section)
- news.ycombinator.com/item?id=47334792
- blog.cloudflare.com/workflows-v2/

---

## Section 7: Making the call

Heading: Making the call

Two short paragraphs. No feature matrix.

Choose Vercel Workflows if your workflows are part of your application rather than a separate system, if you want durability to disappear into your existing TypeScript codebase, and if portability or self-hosting matters. It is also the stronger choice if you are building for or with coding agents — the directive model means an agent only has to reason about one system.

Choose Cloudflare Workflows if you are committed to the Workers ecosystem and want workflow state co-located with your edge compute. The CPU-only billing model — where sleeps and waits are genuinely free — is a real advantage for long-running workflows that spend most of their time waiting rather than computing.

---

## Section 8: Closing

Do not summarize. Do not restate what the piece covered. Do not open with "Overall," "In conclusion," or "In summary." Land a final point that reframes everything that came before it.

The durable execution category has converged on a shared execution model. What Vercel and Cloudflare are competing on now is ergonomics and integration depth — how naturally durability fits into the way you already build. That is a different kind of competition than it used to be.

Final line — use this exactly: "The question isn't which system is more powerful. It's how little infrastructure you want to think about to build something that runs forever."
