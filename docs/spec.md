# Pipeline Specification

## Article structure

The article has seven required sections, in this order:

| Order | Section ID | Title | Claim types allowed |
|---|---|---|---|
| 1 | `short_answer` | Short Answer | interpretive |
| 2 | `what_is_compared` | What Is Being Compared | sourced |
| 3 | `orchestration_model` | Orchestration Model | sourced, derived |
| 4 | `developer_implications` | What This Means for Developers | derived, interpretive |
| 5 | `comparison_table` | Comparison Table | sourced, derived |
| 6 | `when_to_use` | When Each Approach Makes Sense | interpretive |
| 7 | `bottom_line` | Bottom Line | interpretive |

Every section is required. Word count bounds and full notes live in `src/config/sectionContracts.ts`.

---

## Claim model

Every claim must be one of three types:

### `sourced`
A claim that directly reflects content from a retrieved source.
- Must have at least one `evidenceId`
- The evidence must link to a source with a URL
- `parentClaimIds` must be empty

### `derived`
A claim synthesized from two or more sourced claims.
- Must have at least one `parentClaimId`
- All parents must be `sourced` claims
- `evidenceIds` must be empty

### `interpretive`
A claim that reasons from sourced and/or derived claims to a judgment or recommendation.
- Must have at least one `parentClaimId`
- Parents can be `sourced` or `derived`
- `evidenceIds` must be empty

**Traceability invariant:** Every claim in the article must exist in the `ClaimLedger`. No claim can appear in a draft section without a corresponding entry in the ledger.

---

## Comparison table dimensions (v1)

These six dimensions are fixed for v1. The comparison table must include all of them.

| Dimension key | What it describes |
|---|---|
| `orchestration_model` | How orchestration logic is expressed |
| `workflow_definition_model` | How a workflow is declared in code |
| `control_flow_model` | How branching, loops, and conditions are expressed |
| `durability_model` | How state is persisted and resumed across failures |
| `system_boundary` | Platform and runtime assumptions |
| `primary_use_case_shape` | The class of problems each approach fits best |

Dimension specs and writer notes live in `src/config/comparisonDimensions.ts`.

---

## Repair philosophy

The system repairs issues with **targeted patches**, not broad rewrites.

### Preferred strategy order

1. **`span_patch`** — replace, delete, or insert a specific text span within a section
2. **`paragraph_patch`** — rewrite a single paragraph (identified by index) within a section
3. **`section_rewrite`** — rewrite an entire section

The repair writer chooses the smallest scope that fixes the issue. Escalation to the next strategy only happens when the current strategy cannot address the root cause.

**Whole-article rewrite is not supported in v1.**

### Patch operations

| Operation | Description |
|---|---|
| `replace_span` | Replace a specific span with new content |
| `delete_span` | Remove a specific span |
| `insert_after` | Insert new content after a span or paragraph |
| `rewrite_paragraph` | Replace a paragraph by index |
| `rewrite_section` | Replace the full content of a section |

### Repair loop limit

The repair loop runs a maximum of `repairPolicy.maxRepairIterations` times (default: 3). If issues remain after the maximum, `finalizeRun` evaluates escalation conditions.

---

## Verification vs. linting

These are two distinct checks with different scopes.

### Verification (claim-level)
The verifier checks whether the draft's claims are valid and traceable:
- Every `claimId` in the draft exists in the `ClaimLedger`
- Claim types match section contract `allowedClaimTypes`
- Sourced claims have evidence; derived/interpretive claims have parent chains
- Key terms are used consistently (no terminology drift)
- Comparison subjects are correctly attributed (no Vercel/Cloudflare swaps)

### Linting (structure-level)
The linter checks whether the draft's structure and formatting are correct:
- All required sections are present and in the correct order
- Each section's word count is within contract bounds
- No banned phrases appear (per style profile)
- The comparison table includes all six v1 dimensions
- Markdown formatting is valid

Lint rules and severity levels live in `src/config/lintRules.ts`.
