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
[To be filled after pipeline trigger]
