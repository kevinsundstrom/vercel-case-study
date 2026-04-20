# content-pipeline

A **claim-governed content compiler** that produces a structured, source-grounded comparison article about Vercel Workflows vs. Cloudflare Workflows.

The system enforces traceability from evidence → claims → article output, and uses targeted patching — not broad rewrites — to repair issues found during verification and linting.

---

## What this is

The system is best understood as a pipeline that:

1. Plans which sources to consult for each comparison dimension
2. Extracts evidence as verbatim quotes from those sources
3. Normalizes evidence into typed, traceable claims (sourced / derived / interpretive)
4. Writes a structured article draft grounded in the claim ledger
5. Verifies claim traceability and consistency
6. Lints structure, formatting, and style
7. Repairs specific issues with targeted span/paragraph/section patches
8. Finalizes when both verification and lint pass (or escalates if not)

The article thesis: **Vercel Workflows is a code-as-orchestrator model; Cloudflare Workflows is a step-based workflow model.** Every claim in the article must trace to evidence that supports this framing or refines it.

---

## What is implemented now

| Area | Status |
|---|---|
| TypeScript type definitions | ✅ Complete |
| Zod schemas for all artifact types | ✅ Complete |
| Typed config files (sections, style, dimensions, repair, lint, escalation) | ✅ Complete |
| `initializeRun` workflow stage | ✅ Implemented |
| `planSources` workflow stage | ✅ Implemented — calls planner agent |
| `extractEvidence` workflow stage | ✅ Implemented — fetches URLs, calls researcher agent |
| `normalizeClaims` workflow stage | ✅ Implemented — calls LLM, builds ClaimLedger + ComparisonSchema |
| Planner agent | ✅ Implemented — produces SourcePlan via LLM |
| Researcher agent | ✅ Implemented — extracts RawExtracts from source content via LLM |
| Local artifact store | ✅ Implemented — writes `runs/{runId}/*.json` |
| Local runner (`src/runner.ts`) | ✅ Implemented — runs all 4 stages, saves all artifacts |
| Fixture files (9 fixture files) | ✅ Hand-written, including SourcePlan + EvidencePack per vendor |
| Fixture validation script | ✅ Ready — run `npm run validate-fixtures` |
| `writeDraft` workflow stage | ✅ Implemented — calls writer agent, produces ArticleDraft + Markdown file |
| Writer agent | ✅ Implemented — grounds output in ClaimLedger + ComparisonSchema + EditorialBrief |
| EditorialBrief type, schema, and config | ✅ Implemented — controls audience, thesis, tensions, tone, and constraints |
| `verifyDraft` and downstream stages | ⏳ Stubbed — not yet implemented |
| Documentation | ✅ spec, architecture, workflow stages |

---

## What is intentionally stubbed

- **`verifyDraft`, `lintDraft`, `repairDraft`, `finalizeRun`** — still throw `Error('Not implemented')`.
- **`verifier`, `repairWriter` agents** — prompt templates present, no implementation.
- **Escalation notifications** — declared but not connected.

---

## Running the vertical slice

```bash
# Install dependencies
npm install

# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...

# Run the evidence → claims pipeline
npm run pipeline

# Optionally override the topic
npm run pipeline "Custom comparison topic"
```

Artifacts are written to `runs/{runId}/`:

| File | Contents |
|---|---|
| `manifest.json` | Run identity, status, config |
| `sourcePlan.json` | Research questions + candidate URLs per vendor |
| `evidencePack_vercel.json` | Fetched sources + extracted quotes for Vercel |
| `evidencePack_cloudflare.json` | Fetched sources + extracted quotes for Cloudflare |
| `claimLedger.json` | Typed, traceable claims (sourced + derived) |
| `comparisonSchema.json` | Claims mapped to comparison dimensions |
| `articleDraft.json` | Typed ArticleDraft with per-section claim IDs and word counts |
| `articleDraft.md` | Human-readable Markdown rendering of the draft |

```bash
# Validate all fixtures without an API key
npm run validate-fixtures

# Type check
npm run typecheck
```

---

## Artifact flow

```
InitializeRun
  └─ RunManifest

PlanSources
  └─ SourcePlan

ExtractEvidence
  └─ EvidencePack

NormalizeClaims
  ├─ ClaimLedger
  └─ ComparisonSchema

WriteDraft
  └─ ArticleDraft (version 1)

VerifyDraft ──────────────────────────────────┐
  └─ VerificationReport                        │
                                               │ repair loop
LintDraft ────────────────────────────────────┤
  └─ LintReport                                │
                                               │
RepairDraft (if issues found)                  │
  ├─ RepairPlan                                │
  ├─ PatchRequest(s)                           │
  ├─ PatchResponse(s)                          │
  └─ ArticleDraft (version N+1) ───────────────┘

FinalizeRun
  └─ FinalizationReport
```

---

## Repair flow

When verification or linting finds issues:

1. `repairDraft` builds a `RepairPlan` from all error-severity issues
2. For each issue, the `repairPolicy` selects a strategy: `span_patch` → `paragraph_patch` → `section_rewrite`
3. The repair writer agent produces a `PatchRequest` per issue
4. Patches are applied in sequence to produce a new draft version
5. Verify and lint run again on the new version
6. Repeat up to `maxRepairIterations` (default: 3)
7. If issues remain after max iterations, `finalizeRun` evaluates escalation conditions

---

## Next implementation steps

1. **Implement `src/lib/ids.ts`** — already written; wire into `initializeRun`
2. **Implement `initializeRun`** — simplest stage, no agent needed
3. **Connect a real model** in `src/agents/planner.ts` using the Anthropic SDK (see `claude-api` skill)
4. **Implement `extractEvidence`** — HTTP fetch + text extraction from official docs URLs
5. **Implement `normalizeClaims`** — the highest-leverage stage; drives all downstream quality
6. **Add artifact storage** — file system or a simple key-value store as a first pass
7. **Wire the repair loop** in a top-level `runPipeline.ts` orchestrator

---

## Running

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Validate fixture files against schemas
npm run validate-fixtures
```

No environment variables are needed for the scaffold. Add `ANTHROPIC_API_KEY` when connecting agents.
