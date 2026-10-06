# Graph Report - N  (2026-10-06)

## Corpus Check
- 9 files · ~2,341 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 32 nodes · 23 edges · 9 communities (3 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `693a5629`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- StudEx Agent Home
- Model house integration
- memory/README.md
- obsidian/README.md
- work/README.md
- Findings
- StudEx Harness: AutoResearch + MiroFish
- context/README.md
- dictation_to_context.sh

## God Nodes (most connected - your core abstractions)
1. `StudEx Harness: AutoResearch + MiroFish` - 6 edges
2. `Findings` - 5 edges
3. `StudEx Agent Home` - 3 edges
4. `StudEx source-file review — 2026-10-06` - 3 edges
5. `Model house integration` - 2 edges
6. `dictation_to_context.sh script` - 1 edges
7. `Daily contract` - 1 edges
8. `Current model-house status` - 1 edges
9. `Context inbox` - 1 edges
10. `Rollout` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (9 total, 6 thin omitted)

### Community 0 - "StudEx Agent Home"
Cohesion: 0.50
Nodes (3): Current model-house status, Daily contract, StudEx Agent Home

### Community 5 - "Findings"
Cohesion: 0.25
Nodes (7): Canonical integration decision, Findings, `nexus-command-deck.html`, `nexus-command-deck-offline.html`, StudBot integration plan, `studex-master-os.html`, StudEx source-file review — 2026-10-06

### Community 6 - "StudEx Harness: AutoResearch + MiroFish"
Cohesion: 0.29
Nodes (6): First pilot, Four-model routing, StudEx composition, StudEx Harness: AutoResearch + MiroFish, What each component does, Where GPT-5 belongs

## Knowledge Gaps
- **18 isolated node(s):** `dictation_to_context.sh script`, `Daily contract`, `Current model-house status`, `Context inbox`, `Rollout` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 27 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `dictation_to_context.sh script`, `Daily contract`, `Current model-house status` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._