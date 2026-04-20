# Architecture

## Three distinct concepts

This codebase separates three concepts that are often conflated in content pipelines:

### 1. Workflow stages (`src/workflows/`)
Stages are the **pipeline steps**. They define what happens, in what order, with what inputs and outputs. Each stage is a function: it takes a typed input, does work (or will, once implemented), and returns a typed output.

Stages are not agents. A stage orchestrates — it decides when to call an agent, how to validate the result, and how to update the run manifest.

### 2. Agent roles (`src/agents/`)
Agents are the **reasoning units**. Each agent role represents a specific kind of LLM-powered reasoning: planning, researching, writing, verifying, or repairing. Agents do not manage pipeline state — they receive inputs and return structured outputs.

Agents are not microservices. They are thin wrappers around LLM calls with typed I/O and prompt templates. Multiple stages can invoke the same agent.

### 3. Artifacts (`src/types/`, `fixtures/`)
Artifacts are the **data contracts** — the typed objects that flow between stages. Every artifact has a zod schema for runtime validation.

The artifact graph is append-only in a run: stages produce new artifacts or new versions of existing ones. Nothing is deleted mid-run.

---

## How they relate

```
Workflow stage
  │
  ├─ reads:  typed input artifacts
  ├─ calls:  one or more agent roles (for reasoning)
  ├─ writes: typed output artifacts
  └─ updates: RunManifest (status + artifactRefs)
```

A stage without reasoning (e.g. `initializeRun`, `lintDraft`) may not call any agent. A stage with complex reasoning (e.g. `normalizeClaims`) may call an agent multiple times.

---

## Artifact flow through the pipeline

```
RunManifest ─────────────────────────────────────────────────────────┐
  (created by initializeRun, threaded through every stage)            │
                                                                       │
initializeRun ──────────────────────────────────────────────────────→ RunManifest v1
planSources ────────────────────────────────────────────────────────→ SourcePlan
extractEvidence ────────────────────────────────────────────────────→ EvidencePack
normalizeClaims ────────────────────────────────────────────────────→ ClaimLedger
                                                                       ComparisonSchema
writeDraft ─────────────────────────────────────────────────────────→ ArticleDraft v1
                                                                       │
                         ┌─────────────────────────────────────────── │
                         │           repair loop                       │
                         ▼                                             │
verifyDraft ──────────────────────────────────────────────────────→ VerificationReport
lintDraft ────────────────────────────────────────────────────────→ LintReport
                         │
              (if issues) │
                         ▼
repairDraft ──────────────────────────────────────────────────────→ RepairPlan
                                                                       PatchRequest(s)
                                                                       PatchResponse(s)
                                                                       ArticleDraft vN+1
                         │
              (loop back to verifyDraft)
                         │
              (if all pass or max iterations)
                         ▼
finalizeRun ──────────────────────────────────────────────────────→ FinalizationReport
                                                                       RunManifest vFinal
```

---

## Key design decisions

**Claim ledger is the single source of truth for facts.** The writer can only assert claims that exist in the ledger. This prevents hallucination from propagating into the final article.

**Verification and linting are strictly separated.** Verification owns claim semantics; linting owns structure and formatting. This separation makes each check deterministic and composable — and makes repair prompts easier to write.

**Repair is targeted, not broad.** A patch targets the smallest scope that fixes the issue. This keeps each repair iteration fast and auditable. The `RepairPlan` is a complete record of what was changed and why.

**The run manifest is threaded through every stage.** It records current status, stage history, and artifact refs. Every stage reads the manifest on entry and returns an updated manifest. This makes the pipeline inspectable at any point.

**Agent roles are not microservices.** They are thin TypeScript functions that wrap LLM calls. This makes them easy to test with mocked responses and easy to swap for different models.

---

## Config files and their roles

| Config file | Used by |
|---|---|
| `sectionContracts` | `writeDraft`, `lintDraft`, `repairDraft`, `verifyDraft` |
| `styleProfile` | `writeDraft`, `lintDraft`, `repairDraft` |
| `comparisonDimensions` | `normalizeClaims`, `writeDraft`, `lintDraft` |
| `repairPolicy` | `repairDraft`, `finalizeRun` |
| `lintRules` | `lintDraft` |
| `escalationPolicy` | `finalizeRun` |
