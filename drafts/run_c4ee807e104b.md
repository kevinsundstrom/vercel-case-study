For a long time, getting reliable execution for long-running work meant adding a second system to your stack. A dedicated orchestration service, a state machine layer, a background job framework running alongside the application you were actually trying to ship. That overhead, operational, and cognitive, was the price of reliability.

Both Vercel and Cloudflare have built durable execution into their platforms. Developers no longer have to leave their deployment environment to get it. But these two implementations are not the same, and the difference is not superficial.

The difference isn't in how they recover execution. It's in where durability lives in your mental model.

---

## The execution model both engines share

Both engines use the same recovery mechanism.

When a workflow resumes after a failure, a long wait, or a retry, the workflow function re-executes from the top. Each step checks a persistent store. If that step already completed, its cached result gets returned immediately and execution continues. If not, the step runs.

This pattern, sometimes called replay-with-memoization, Temporal pioneered, and is now the standard approach for code-first durable execution tools. Both Vercel and Cloudflare chose it.

Where they differ is in how that model is expressed in code, and where the state that makes it work actually lives.

---

## Where durability lives

Vercel's approach treats durability as a property of your functions, expressed through directives in the code itself.

You add two directives to async TypeScript.

The first, `"use workflow"`, marks the function that orchestrates the work. The second, `"use step"`, marks each function that performs a discrete unit of work. The runtime handles persistence, retries, and resumption. The code reads like normal async logic because structurally it is.

Here is what a two-step workflow looks like in Vercel using only directives.

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

The orchestration is implied by the call sequence. The developer does not declare step names. The compiler generates step IDs from the function's filepath and name.

Cloudflare's approach starts from a different premise. Durability is a property of a stateful primitive called a Durable Object, a compute unit that persists its own state in a co-located SQLite database. Every workflow instance is one of these objects. The workflow's `run` method gets invoked by an internal engine, and each step is an explicit named operation. Cloudflare's engineers described their design as a game loop: the function keeps re-running until every named step has completed and its cached result is available.

Here is the same two-step workflow in Cloudflare, where steps are named explicitly, and the workflow is a class.

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

The step names are explicit strings supplied by the developer. The runtime uses those strings as cache keys.

---

## Where state lives

Vercel stores workflow state in a managed event log. The storage layer is designed to be swappable through an adapter system called Worlds. Out of the box you get Vercel's managed infrastructure. A Postgres reference implementation exists for self-hosting. The SDK is open source, and the workflow runtime can be hosted and operated independently of Vercel's platform.

Cloudflare stores workflow state in a SQLite database inside each workflow's Durable Object instance. State and compute are co-located at the edge. For latency-sensitive workloads where the workflow runs close to the data it needs, this is a meaningful architectural advantage. It is also a platform commitment. There is no self-hosted path. Cloudflare Workflows runs on Cloudflare.

The tradeoff is portability against edge-local state.

---

## A tradeoff worth understanding

Vercel's directive approach raises a real question: what happens when you rename or move a function while a workflow is still running?

The compiler generates step IDs from the function's filepath and name. Vercel's answer is that deploy skew protection pegs each run to the deployment it started on, and atomic versioning in the storage layer ensures in-flight runs complete before new versions take over. Whether that holds across all real-world refactor patterns is something each team needs to evaluate before committing.

Cloudflare's explicit step naming sidesteps this entirely. The developer supplies the cache key, and step identity is determined solely by that string. Refactoring the surrounding code leaves step identity unchanged as long as the string name stays the same.

The tradeoff is that the developer is now responsible for naming discipline across the codebase.

Both systems share the determinism constraint common to replay-based execution: no random values, no timestamps, no external calls outside of steps.

This requires active discipline regardless of which platform you choose.

Vercel's replay model accumulates overhead as event histories grow. Their docs recommend splitting into child workflows past roughly 2,000 events, and a future version plans to address this with a snapshot-based runtime. Cloudflare's primary constraint is platform lock-in. Some developers have reported startup latency before workflow instances initialize, particularly for workloads triggered at machine speed rather than human speed. Cloudflare has made architectural changes to how workflow instances are managed to address this, but it is worth testing against your own workload patterns before committing.

---

## How to think about the choice

The comparison comes down to two questions.

First: where does the workflow live relative to your application? If the workflow is part of the application, woven into the same codebase, triggered by the same events, and sharing the same deployment, Vercel's model fits naturally. The directives disappear into the code and the runtime handles the rest. If the workflow is a system of its own, operating at the edge and tightly coupled to Cloudflare's data and compute primitives, Cloudflare's model gives you explicit control over something that warrants it.

Second: how much platform are you willing to adopt? Vercel's open-source SDK and pluggable storage layer mean you can start on Vercel and move later. Cloudflare's model is deeply integrated with the Workers ecosystem. That integration is an advantage if you are already there. It is a constraint if you are not.

Neither answer is wrong. The systems reflect different convictions about where orchestration belongs in an application's architecture.

---

## The landscape has shifted

Durable execution used to require adopting infrastructure that sat beside your application. Both Vercel and Cloudflare have moved it inside the platform itself, which changes the question developers are asking. The question now is which execution model matches the way you think about building software.

The question isn't which system is more powerful. It's which model fits the way you already build.