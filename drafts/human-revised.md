# The architecture of resilient agents

Long-running agents fail for many reasons. Networks drop, tools time out, LLM calls don't complete. A multi-step agent that runs for minutes or hours needs a way to pick up where it left off when something goes wrong. Without durable execution, any failure ends the run permanently, which makes autonomous operation impossible in practice.

Both Vercel and Cloudflare have built durable execution into their platforms. Developers no longer have to reach for a separate orchestration service to get it. But the two implementations take different approaches to where durability lives.

Both platforms use the same recovery mechanism. When a workflow resumes after a failure or a long wait, it re-executes from the top, but completed steps are skipped. The runtime checks a persistent store for a cached result and moves on if it finds one.

[Temporal](https://temporal.io) pioneered this pattern, sometimes called replay-with-memoization, and it is now the dominant approach in code-first durable execution.

Where Vercel and Cloudflare differ is in how that model is expressed in code, and where state is stored.

---

## Where durability lives

Vercel Workflows makes durability a language-level concept, not a system you integrate with. The compiler infers what your code needs rather than requiring you to provision it separately. You add two directives to async TypeScript. The first marks the function that orchestrates the work. The second marks each function that performs a step. The runtime handles persisting state, managing retries, and resuming after failures.

Here is what a two-step research agent looks like in Vercel using only directives.

```typescript
async function runResearchAgent(query: string) {
  "use workflow";
  const sources = await fetchSources(query);
  const summary = await synthesizeFindings(sources);
  return summary;
}

async function fetchSources(query: string) {
  "use step";
  // calls external APIs, searches the web
}

async function synthesizeFindings(sources: Source[]) {
  "use step";
  // calls LLM to summarize and reason over sources
}
```

The orchestration is implied by the structure, not declared explicitly.

With Cloudflare, durability is a property of a stateful primitive called a Durable Object. A Durable Object is a compute unit that persists state in its own co-located SQLite database. Every workflow instance is one of these objects. Each step is an explicitly named operation whose result is stored and retrieved by name. Cloudflare's engineers [described this design as a game loop](https://blog.cloudflare.com/building-workflows-durable-execution-on-workers/): a function that keeps re-running until every named step has completed and its result is cached.

Here is the same research agent in Cloudflare, where steps are named explicitly and the workflow is a class.

```typescript
export class ResearchAgentWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const sources = await step.do("fetch sources", async () => {
      // calls external APIs, searches the web
    });
    const summary = await step.do("synthesize findings", async () => {
      // calls LLM to summarize and reason over sources
    });
    return summary;
  }
}
```

The step names are explicit strings supplied by the developer. The runtime does not infer them from the code structure.

---

## Where state lives

Vercel stores workflow state in a managed event log. The storage layer is swappable through an adapter system called Worlds. Out of the box you get Vercel's managed infrastructure, but a Postgres reference implementation exists for self-hosting. The SDK is open source and the runtime is portable. Because state lives in the event log, clients can disconnect and reconnect to a running agent's output at any point without losing progress.

Cloudflare stores workflow state in a SQLite database inside each workflow's Durable Object instance. State and compute are co-located at the edge. For agents that read and write accumulated state frequently, that co-location reduces the round-trip between compute and the data it acts on. Because of this architecture, there is no self-hosted path. Cloudflare Workflows runs on Cloudflare.

A team that starts on Cloudflare for the edge-local performance benefit is also accepting that their workflow state, retry logic, and execution history are tightly coupled to the Workers runtime. For most teams building internal tooling or low-latency agents, that's a reasonable trade. For teams that need to move infrastructure or audit execution history outside the platform, it's a meaningful constraint to account for early.

---

## Design decisions and trade-offs

Vercel's use of inferred IDs means code structure and execution state are linked. Each step gets an ID generated from its filepath and function name. If you rename a file or move a function, the compiler generates new IDs, which creates new step identities in the updated deployment.

Vercel solves this through deploy skew protection: in-flight runs are pinned to the deployment they started on, while new runs pick up the latest code. It means in-flight tasks cannot be upgraded to new logic mid-flight, and renamed steps will appear under different names in observability across the two deployments.

Cloudflare requires explicit step names. Because you supply the cache key as a string, you can move code anywhere without breaking identity. The tradeoff is manual overhead: you are responsible for maintaining unique keys across your codebase, and the compiler won't catch a naming collision.

Cloudflare's co-located state reduces read/write latency between compute and state, but adds platform lock-in and potential startup latency for high-frequency machine triggers. Vercel's event-log model is flexible but carries overhead as histories grow; their docs recommend splitting logic into child workflows past 2,000 events. Workflow functions must also be fully deterministic: no random values, no timestamps, no side effects outside of steps.

---

## The decision is architectural before it is technical

The first question is visibility. Do you want orchestration to disappear into your application code, or remain an explicit architectural boundary? Vercel makes it invisible. Directives extend your existing async functions without a separate entrypoint, a separate class, or a separate configuration file. Cloudflare's model is explicit by design. It asks for a dedicated class, a named binding, and a configuration that makes the workflow an explicit architectural boundary.

The second question is whether your workflow layer needs to be portable independent of your deployment platform. Vercel's open-source SDK and pluggable storage mean the workflow layer can outlive the deployment layer. Cloudflare's model doesn't offer that separation, and it doesn't pretend to. If you're already deep in the Workers ecosystem, that's not a constraint. It's just the architecture. If you're not, it's the first thing to pressure-test before you commit to the platform.

---

## Durable execution is now the floor, not the feature

Durable execution used to be infrastructure you bolted on. Both Vercel and Cloudflare have moved it inside the platform, but they have made different decisions about where it belongs. The question isn't which system handles more. It's how explicitly you want to manage that infrastructure while you're building.
