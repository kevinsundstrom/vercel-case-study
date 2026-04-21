# Pipeline iteration log

---

## Iteration 2

### Problems observed in iteration 1 draft

1. **Attribution over argument.** The piece attributed too many ideas to Vercel as a corporate voice ("Vercel's thesis," "As Vercel's GA post puts it") rather than letting the ideas stand on their own. This created a marketing tone rather than a developer-to-developer voice.

2. **Technical claims stated without being earned.** "Replay-with-memoization" was declared as category consensus without explanation. Developers unfamiliar with the term had no way to evaluate the claim. The piece asserted things it should have earned.

3. **Opening throws reader into the pool.** The piece opened with terminology and platform names without establishing why the reader should care. Context-setting was missing before the cold open.

4. **Imprecise framing of directives.** "You apply durability via two directives" is technically inaccurate. The directives define structure and step boundaries. The runtime provides durability in response. The distinction matters because it is the conceptual heart of Vercel's pitch.

5. **Code blocks introduced without orientation.** Neither code block had a setup sentence to tell the reader what they were about to see. The reader was handed code without context.

6. **Game loop quote introduced unnaturally.** "Cloudflare frames this with a question from their engineering blog" is unnatural attribution. The concept needed to be explained before the quote, not after.

7. **No-editorialize-after-code rule too blunt.** The linter rule prevented any observation after code blocks, including useful orientation for the reader. The intent was to prevent declaring a winner, not prevent all commentary.

8. **Section headings too technical.** "Storage topology and portability" and similar headings used technical precision where plain language would serve the reader better.

9. **Worlds system introduced without explanation.** "The Worlds system" was referenced as though the reader already knew what it was. New concepts require one sentence of context before use.

10. **Storage section stuffed with docs content.** The list of World implementations (Redis, Turso, MongoDB, Jazz Cloud) was implementation detail that did not drive the comparison forward. Word count constraint caused context stuffing.

11. **Implicit vs explicit section omitted Cloudflare.** The section discussed Vercel's directive approach and the Inngest critique but never noted that Cloudflare's explicit step naming sidesteps the problem entirely. The contrast was the point.

12. **Hacker News citation reads as gossip.** Citing a forum thread for a factual claim about production behavior was not credible. The underlying point was valid but needed softer framing.

13. **Making the call section too prescriptive.** Telling developers explicitly which system to choose reads as sales copy. Developers don't want a vendor to make the decision for them.

14. **Closing section framing.** "The competition has changed" positions this as a vendor competition rather than a developer landscape shift. "Durable execution category" is jargon that had not been earned by that point in the piece.

### Changes made

| Change | Mechanism | Rationale |
|---|---|---|
| Remove corporate attribution voice | STYLE_GUIDE.md | Global issue affecting tone throughout |
| Plain language over technical terminology | STYLE_GUIDE.md | Global issue affecting accessibility |
| Remove hard word count constraint | Writer prompt + outline | Was causing context stuffing |
| Reframe Making the Call section | Outline | Section should tie threads together, not prescribe decisions |
| Add code block orientation sentences | Outline | Readers need a handshake before code |
| Fix game loop setup | Outline | Explain concept before quote, not after |
| Fix Worlds system introduction | Outline | New concepts need one sentence of context |
| Remove World implementations list | Outline | Docs content that doesn't drive comparison forward |
| Add Cloudflare contrast to Implicit/Explicit section | Outline | Section was incomplete without it |
| Soften HN citation to general developer observation | Outline | Forum citation is not credible sourcing |
| Soften no-editorialize rule to no-declare-winner rule | Linter | Rule was too blunt, prevented useful reader orientation |
| Reframe closing section heading and framing | Outline | Competition framing wrong for developer audience |

### Anticipated improvement

- Tone shifts from attributed marketing to peer-to-peer developer voice
- Technical claims feel earned rather than declared
- Code blocks are navigable for readers unfamiliar with either system
- Making the call section respects developer intelligence
- Storage section is shorter and drives the story forward
- Closing reframes around the developer landscape, not vendor competition

### Run ID
wrun_01KPRGXWQGBK9TY2N0VVJTCYTR — draft: drafts/run_60e780d58ab9.md

---

## Iteration 3 — transition to targeted refinement

### Why we stopped running the full pipeline

After two full pipeline runs, the piece reached a point where structure, voice, and argument were largely locked. Continuing to run the full pipeline introduced diminishing returns and risk: each full run could fix targeted issues while introducing unintended changes elsewhere. The remaining problems were sentence-level, not structural.

### What we built instead

A lightweight refinement agent that takes the current draft and a list of targeted feedback items, then returns a structured diff showing only the suggested changes. No researcher, no fact checker, no lint loop, no durable execution. A standard API route with a single LLM call.

This change reflects a deliberate architectural decision: use the right tool for the job. Vercel Workflows is the right tool for a multi-step, long-running, recoverable content pipeline. A direct Anthropic SDK call is the right tool for a fast, targeted, single-pass refinement.

### Review and approval process

The refine endpoint returns a structured markdown diff. Each change is labeled with the target passage, the before text, the after text, and the reason for the change. Changes are reviewed and approved manually. Approved changes are applied directly to the draft file using surgical string replacement. Rejected changes are discarded. Nothing outside the targeted passages is touched.

### Problems observed in iteration 2 draft

1. **Broken sentence structure in "The execution model both engines share."** "This pattern, sometimes called replay-with-memoization, Temporal pioneered, and most code-first durable execution tools now use." Clause order makes it read as if Temporal pioneered the tools, not the pattern.

2. **Missing word after Vercel code block.** "The orchestration the structure implies, not declared explicitly." Missing verb. Should read as "The orchestration is implied by the structure" or similar.

3. **Worlds system still lands slightly abruptly.** "An adapter system called Worlds" is better than before but a developer still does not have enough context to know whether this is a new concept or something they should already know.

4. **Weak closing sentence in "Where state lives."** "Neither is the wrong choice. They serve different priorities." Adds nothing the reader has not already concluded. Softens a section that was working without it.

5. **"A tradeoff worth understanding" covers two distinct topics.** Step identity and system limitations are related but not the same tradeoff. The heading does not accurately represent the section's content.

### Changes made

| Change | Mechanism | Rationale |
|---|---|---|
| Fix broken sentence in execution model section | Refine agent — targeted diff | Sentence-level fix, no structural change needed |
| Fix missing word after Vercel code block | Refine agent — targeted diff | Single word omission |
| Add half-sentence of context for Worlds system | Refine agent — targeted diff | Concept needs minimal grounding on first reference |
| Remove weak closing sentence in Where state lives | Refine agent — targeted diff | Sentence adds no value |
| Reconsider "A tradeoff worth understanding" heading | Refine agent — targeted diff | Heading does not reflect section content |

### Anticipated improvement

- Prose is clean and structurally correct throughout
- No concept introduced without minimal context
- Section headings accurately reflect content
- No sentences that soften sections unnecessarily

### Run ID
run_d6839d85d590 — draft: drafts/run_60e780d58ab9-r1.md

### Approved changes

| Change | User adjustment | Applied |
|---|---|---|
| Fix broken sentence in execution model section | Reordered to active voice: "Temporal pioneered this pattern..." | Yes |
| Fix missing word after Vercel code block | As suggested: "The orchestration is implied by the structure..." | Yes |
| Add half-sentence of context for Worlds system | Added "a pluggable interface that lets you swap storage backends" (no em dash) | Yes |
| Remove weak closing sentence in Where state lives | As suggested | Yes |
| Reconsider "A tradeoff worth understanding" heading | User changed to "Where each system gets harder" | Yes |

### Rejected changes
None — all 5 changes approved (2 with user-supplied wording adjustments).
