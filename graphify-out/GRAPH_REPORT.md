# Graph Report - N  (2026-10-06)

## Corpus Check
- 6 files · ~1,613 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 21 nodes · 15 edges · 7 communities (2 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53dd99bd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- StudEx Agent Home
- Model house integration
- memory/README.md
- obsidian/README.md
- work/README.md
- Findings
- StudEx source-file review — 2026-10-06

## God Nodes (most connected - your core abstractions)
1. `Findings` - 5 edges
2. `StudEx Agent Home` - 3 edges
3. `StudEx source-file review — 2026-10-06` - 3 edges
4. `Model house integration` - 2 edges
5. `Daily contract` - 1 edges
6. `Current model-house status` - 1 edges
7. `Rollout` - 1 edges
8. `StudBot integration plan` - 1 edges
9. ``nexus-command-deck-offline.html`` - 1 edges
10. ``nexus-command-deck.html`` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (7 total, 5 thin omitted)

### Community 0 - "StudEx Agent Home"
Cohesion: 0.50
Nodes (3): Current model-house status, Daily contract, StudEx Agent Home

### Community 5 - "Findings"
Cohesion: 0.40
Nodes (5): Findings, `nexus-command-deck.html`, `nexus-command-deck-offline.html`, StudBot integration plan, `studex-master-os.html`

## Knowledge Gaps
- **11 isolated node(s):** `Daily contract`, `Current model-house status`, `Rollout`, `StudBot integration plan`, ``nexus-command-deck-offline.html`` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 17 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Findings` connect `Findings` to `StudEx source-file review — 2026-10-06`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `StudEx source-file review — 2026-10-06` connect `StudEx source-file review — 2026-10-06` to `Findings`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `Daily contract`, `Current model-house status`, `Rollout` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._