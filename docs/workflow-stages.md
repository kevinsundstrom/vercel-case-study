# Workflow Stages

Each stage is a function in `src/workflows/`. All stages are currently stubbed.

---

## 1. `initializeRun`

Creates the `RunManifest` — the identity record for this pipeline run. Generates a unique `runId`, records the topic, sets the initial status to `initialized`, and stores the run config (target word count, max repair iterations, article version).

Every downstream stage receives and returns an updated copy of this manifest.

**Input:** topic string + `RunConfig`
**Output:** `RunManifest` (version 1)
**No agent needed.**

---

## 2. `planSources`

Produces a `SourcePlan`: a list of candidate URLs and search queries for each comparison dimension. The planner agent reasons about which sources are most likely to yield authoritative, sourced evidence. It does not fetch any content.

**Input:** `RunManifest`
**Output:** `RunManifest`, `SourcePlan`
**Agent:** `planner`

---

## 3. `extractEvidence`

Fetches content from the planned sources and extracts relevant excerpts. The researcher agent identifies the most quotable passages for each comparison dimension. The output is a raw `EvidencePack` — verbatim quotes linked to source URLs — not yet structured into claims.

**Input:** `RunManifest`, `SourcePlan`
**Output:** `RunManifest`, `EvidencePack`
**Agent:** `researcher` (extraction mode)

---

## 4. `normalizeClaims`

The highest-leverage stage. Transforms the raw `EvidencePack` into typed, traceable claims. Every claim is classified as `sourced`, `derived`, or `interpretive` and linked to its evidence or parent claims. Populates the `ComparisonSchema` by mapping claims to the six comparison dimensions.

No claim leaves this stage without a verified traceability chain.

**Input:** `RunManifest`, `EvidencePack`
**Output:** `RunManifest`, `ClaimLedger`, `ComparisonSchema`
**Agent:** `researcher` (normalization mode)

---

## 5. `writeDraft`

Produces the first `ArticleDraft` from the claim ledger and comparison schema. The writer agent follows section contracts (required sections, word counts, allowed claim types) and the style profile (voice, banned phrases, formatting). Every section includes the `claimIds` it asserts.

The writer cannot use claims that do not exist in the ledger.

**Input:** `RunManifest`, `ClaimLedger`, `ComparisonSchema`
**Output:** `RunManifest`, `ArticleDraft` (version 1)
**Agent:** `writer`

---

## 6. `verifyDraft`

Runs claim-level checks on the draft. Checks that every `claimId` in the draft exists in the ledger, that claim types match section contract rules, that traceability chains are intact, and that key terms are used consistently. Produces a `VerificationReport`.

This stage does not check structure or formatting.

**Input:** `RunManifest`, `ArticleDraft`, `ClaimLedger`
**Output:** `RunManifest`, `VerificationReport`
**Agent:** `verifier` (partial — structural checks can be rule-based)

---

## 7. `lintDraft`

Runs structure and formatting checks on the draft. Checks section presence, order, word counts, banned phrases, comparison table completeness, and markdown validity. Produces a `LintReport`.

This stage does not check claim traceability.

**Input:** `RunManifest`, `ArticleDraft`
**Output:** `RunManifest`, `LintReport`
**No agent needed for most rules — rule-based checks against config.**

---

## 8. `repairDraft`

If verification or linting found error-severity issues, this stage builds a `RepairPlan` and applies targeted patches to produce a new draft version.

For each issue, the repair policy determines the strategy: `span_patch` (preferred), `paragraph_patch`, or `section_rewrite`. The repair writer agent proposes a `PatchRequest` per issue. Patches are applied in sequence, and the draft version is incremented.

After repair, the pipeline loops back to `verifyDraft`.

**Input:** `RunManifest`, `ArticleDraft`, `ClaimLedger`, `VerificationReport`, `LintReport`, `iterationNumber`
**Output:** `RunManifest`, new `ArticleDraft`, `RepairPlan`, `PatchResponse`
**Agent:** `repairWriter`

---

## 9. `finalizeRun`

Evaluates escalation conditions from `escalationPolicy`. If any abort condition is met (e.g. max repair iterations exceeded with remaining errors), marks the run as `failed` and records the triggering condition for human review.

If all conditions pass, marks the run as `complete` and produces a `FinalizationReport` summarizing word count, claim count, evidence count, repair iterations, and final pass/fail status.

**Input:** `RunManifest`, `ArticleDraft`, `ClaimLedger`, `VerificationReport`, `LintReport`, `repairIterations`
**Output:** `RunManifest`, `FinalizationReport`
**No agent needed.**
